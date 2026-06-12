import { clusterItems, representative, shortHash, tokens } from "./cluster";
import { corroborate, enrichExcerpts, triage } from "./enrich";
import { clampExcerpt, sweepRoster } from "./rss";
import {
  beatGravity,
  BUMP_BUDGET,
  certaintyFor,
  computeScore,
  decideTier,
  matchedBeats,
  METHOD_VERSION,
  seatOrder,
  tierRank,
} from "./score";
import { ROSTER } from "./sources";
import { SAMPLE_BOARD } from "./sample";
import {
  archiveStory,
  getEdition,
  getNote,
  nextEditionNumber,
  pushSnapshot,
  saveEdition,
} from "./records";
import {
  acquireSweepLock,
  loadBoard,
  loadOverrides,
  releaseSweepLock,
  saveBoard,
} from "./store";
import { BoardState, RawItem, Story, SweepLogEntry, Tier } from "./types";

const MAX_STORIES = 48;
const MAX_RAW = 60;
const MAX_LOG = 30;
const MAX_HISTORY = 14;
const MAX_ARRIVALS = 50;
const STALE_AFTER_MS = 60_000;
const DESK_TZ = process.env.DESK_TZ || "America/Chicago";

function minutesBetween(a: string, now: Date): number {
  return Math.max(0, (now.getTime() - new Date(a).getTime()) / 60_000);
}

function sparkFor(arrivals: string[], now: Date): number[] {
  const buckets = new Array(8).fill(0);
  for (const a of arrivals) {
    const ageMin = minutesBetween(a, now);
    const idx = 7 - Math.floor(ageMin / 15);
    if (idx >= 0 && idx < 8) buckets[idx]++;
  }
  return buckets;
}

function velocity45(arrivals: string[], now: Date): number {
  return arrivals.filter((a) => minutesBetween(a, now) <= 45).length;
}

export function boardIsStale(state: BoardState | null, now = new Date()): boolean {
  if (!state) return true;
  return now.getTime() - new Date(state.sweptAt).getTime() > STALE_AFTER_MS;
}

function deskDateParts(now: Date): { date: string; hour: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: DESK_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

/**
 * THE SWEEP — the 60-second loop, GRAVITY edition.
 * Detect → resolve → triage → seat → publish, then feed the Permanent
 * Record: archive what leaves the house, snapshot the board for the Rewind,
 * freeze the 7 a.m. Morning Edition.
 */
export async function runSweep(force = false): Promise<BoardState> {
  const now = new Date();
  const prior = await loadBoard();

  if (!force && !boardIsStale(prior, now)) return prior!;

  const locked = await acquireSweepLock();
  if (!locked) return prior ?? SAMPLE_BOARD(now);

  const t0 = Date.now();
  const errors: string[] = [];

  try {
    const overrides = await loadOverrides();

    // ---- Tier 0 · detect -------------------------------------------------
    const { items, errors: feedErrors } = await sweepRoster(ROSTER, now);
    errors.push(...feedErrors.slice(0, 6));

    if (items.length === 0 && (!prior || prior.sample)) {
      const sample = SAMPLE_BOARD(now);
      await saveBoard(sample);
      return sample;
    }

    const base: BoardState =
      prior && !prior.sample
        ? prior
        : { version: 0, sweptAt: now.toISOString(), stories: [], raw: [], log: [], sample: false, method: METHOD_VERSION };

    // ---- resolve · cluster ----------------------------------------------
    const clusters = clusterItems(base.stories, items);
    const newStories: Story[] = [];
    let developments = 0;

    for (const c of clusters) {
      if (c.story) {
        const s = c.story;
        for (const it of c.items) {
          developments++;
          s.arrivals.push(it.publishedAt);
          if (s.arrivals.length > MAX_ARRIVALS) s.arrivals.shift();
          if (new Date(it.publishedAt) > new Date(s.lastDev)) s.lastDev = it.publishedAt;
          if (!s.sources.some((src) => src.owner === it.source.owner)) {
            s.sources.push({
              name: it.source.name,
              owner: it.source.owner,
              url: it.url,
              weight: it.source.weight,
              lean: it.source.lean,
              title: it.title,
            });
          }
          if (!s.excerpt && it.summary) s.excerpt = clampExcerpt(it.summary);
        }
      } else if (c.items.length > 0) {
        const rep = representative(c.items);
        const id = shortHash([...tokens(rep.title)].sort().join("|") + rep.url);
        if (base.stories.some((s) => s.id === id)) continue;
        const arrivals = c.items.map((i) => i.publishedAt).sort();
        const story: Story = {
          id,
          headline: rep.title,
          excerpt: rep.summary ? clampExcerpt(rep.summary) : undefined,
          url: rep.url,
          tier: "BRIEF",
          score: 0,
          certainty: "DEVELOPING",
          seatedAt: now.toISOString(),
          firstSeen: arrivals[0] ?? now.toISOString(),
          lastDev: arrivals[arrivals.length - 1] ?? now.toISOString(),
          sources: [],
          owners: 0,
          spark: [],
          spread: { L: 0, C: 0, R: 0 },
          workings: {
            corroboration: 0,
            corroborationDelta: 0,
            velocity45: 0,
            firstSeen: arrivals[0] ?? now.toISOString(),
            lastDev: arrivals[arrivals.length - 1] ?? now.toISOString(),
            maxSourceWeight: 1,
            beats: [],
            score: 0,
          },
          history: [],
          arrivals,
        };
        for (const it of c.items) {
          if (!story.sources.some((src) => src.owner === it.source.owner)) {
            story.sources.push({
              name: it.source.name,
              owner: it.source.owner,
              url: it.url,
              weight: it.source.weight,
              lean: it.source.lean,
              title: it.title,
            });
          }
        }
        newStories.push(story);
      }
    }

    let stories = [...base.stories, ...newStories];

    // ---- prune → ARCHIVE (nothing ever 404s) -----------------------------
    const keep: Story[] = [];
    for (const s of stories) {
      const killed = overrides[s.id]?.killed;
      const devAgeH = minutesBetween(s.lastDev, now) / 60;
      const expired = devAgeH > 36 || (s.tier === "BRIEF" && devAgeH > 12);
      if (killed || expired) {
        if (!killed) {
          if (!s.resolution) {
            s.resolution = { state: "FADED", at: now.toISOString() };
            s.history.push({ at: now.toISOString(), event: "Left the house — FADED without resolution", by: "board" });
          }
          await archiveStory(s);
        }
        continue;
      }
      keep.push(s);
    }
    stories = keep;

    // ---- Tier 3 · triage new clusters (consequence + power) ---------------
    await triage(newStories, errors);

    // ---- GRAVITY pass ------------------------------------------------------
    const scorePass = () => {
      for (const s of stories) {
        const priorOwners = s.workings.corroboration;
        s.owners = new Set(s.sources.map((x) => x.owner)).size;
        const { beats, damp } = matchedBeats(s.headline);
        const heur = beatGravity(beats);
        const consequence = s.workings.consequence ?? heur.consequence;
        const power = s.workings.power ?? heur.power;
        const maxW = Math.max(1, ...s.sources.map((x) => x.weight));
        const devAge = minutesBetween(s.lastDev, now);
        const v45 = velocity45(s.arrivals, now);
        s.score = computeScore({
          owners: s.owners,
          maxSourceWeight: maxW,
          minutesSinceDev: devAge,
          velocity45: v45,
          consequence,
          power,
          damp,
          webCorroboration: s.workings.webCorroboration,
        });
        s.spark = sparkFor(s.arrivals, now);
        s.spread = { L: 0, C: 0, R: 0 };
        for (const src of s.sources) s.spread[src.lean ?? "C"]++;
        s.workings = {
          ...s.workings,
          corroboration: s.owners,
          corroborationDelta: Math.max(0, s.owners - priorOwners),
          velocity45: v45,
          firstSeen: s.firstSeen,
          lastDev: s.lastDev,
          maxSourceWeight: maxW,
          beats,
          consequence,
          power,
          score: s.score,
        };
        s.certainty = certaintyFor(s.owners, maxW);
      }
    };
    scorePass();

    // ---- Tier 2 · corroborate clusters in motion, then rescore -------------
    await corroborate(stories, errors);
    scorePass();

    // ---- tier decisions: hysteresis + bump budget + desk overrides ----------
    const diff = { fresh: newStories.length, bumped: 0, cooled: 0, flashes: [] as string[] };
    let bumpsUsed = 0;

    for (const s of stories) {
      const isNew = newStories.includes(s);
      const ageMin = minutesBetween(s.firstSeen, now);
      const devAgeMin = minutesBetween(s.lastDev, now);
      const ov = overrides[s.id];

      s.desk = ov ? { pinned: ov.pinned, forcedTier: ov.forcedTier, killed: ov.killed } : undefined;
      s.prevTier = s.tier;

      let next: Tier = s.tier;
      let by: "board" | "desk" = "board";
      let reason: string | undefined;

      if (ov?.forcedTier) {
        next = ov.forcedTier;
        by = "desk";
        reason = "seated by the desk";
        s.pending = undefined;
      } else if (isNew) {
        const d = decideTier({ ...s, tier: "BRIEF" } as Story, s.score, ageMin, devAgeMin);
        next = d.tier;
        reason = "first seen on the wire";
      } else {
        const d = decideTier(s, s.score, ageMin, devAgeMin);
        s.pending = d.pending;
        if (d.changed) {
          const isFlashMove = d.tier === "FLASH" || s.tier === "FLASH";
          if (isFlashMove || bumpsUsed < BUMP_BUDGET) {
            next = d.tier;
            reason = d.reason;
            if (!isFlashMove) bumpsUsed++;
          }
        }
      }

      if (next === "FLASH" && s.tier !== "FLASH") {
        s.flash = { raisedAt: now.toISOString(), confirmed: ov?.flashConfirmed ?? false };
        diff.flashes.push(s.id);
      }
      if (ov?.flashConfirmed && s.flash) s.flash.confirmed = true;
      if (ov?.flashStoodDown && next === "FLASH") {
        next = "BULLETIN";
        by = "desk";
        reason = "flash stood down by the desk";
        s.flash = undefined;
      }
      if (next !== "FLASH" && s.flash && s.tier === "FLASH") s.flash = undefined;

      if (next !== s.tier) {
        const up = tierRank(next) < tierRank(s.tier);
        if (!isNew) (up ? diff.bumped++ : diff.cooled++);
        s.tier = next;
        s.seatedAt = now.toISOString();
        s.history.push({
          at: now.toISOString(),
          event: isNew
            ? `First seen on the wire · seated ${next}`
            : up
              ? `Bumped to ${next}${reason ? ` — ${reason}` : ""}`
              : `Cooled to ${next}${reason ? ` — ${reason}` : ""}`,
          by,
        });
        if (s.history.length > MAX_HISTORY) s.history.shift();
      }
    }

    // ---- Tier 1 · excerpts for the top of the house --------------------------
    await enrichExcerpts(stories, errors);

    // ---- seat the house --------------------------------------------------------
    stories.sort(seatOrder);
    stories = stories.slice(0, MAX_STORIES);

    // ---- raw ticker + log ---------------------------------------------------------
    const rawNew: RawItem[] = items
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, 25)
      .map((i) => ({ at: i.publishedAt, source: i.source.name, title: i.title, url: i.url }));
    const seenRaw = new Set(base.raw.map((r) => r.url));
    const raw = [...rawNew.filter((r) => !seenRaw.has(r.url)), ...base.raw].slice(0, MAX_RAW);

    const version = base.version + 1;
    const logLine =
      diff.fresh + diff.bumped + diff.cooled === 0
        ? `quiet sweep · ${developments} developments absorbed`
        : `${diff.fresh} new · ${diff.bumped} bumped · ${diff.cooled} cooled${diff.flashes.length ? ` · FLASH RAISED` : ""}`;
    const entry: SweepLogEntry = {
      at: now.toISOString(),
      version,
      line: logLine,
      ms: Date.now() - t0,
      errors: errors.length ? errors.slice(0, 6) : undefined,
    };

    const next: BoardState = {
      version,
      sweptAt: now.toISOString(),
      stories,
      raw,
      log: [entry, ...base.log].slice(0, MAX_LOG),
      sample: false,
      method: METHOD_VERSION,
    };

    await saveBoard(next);

    // ---- feed the Permanent Record (never fatal) -------------------------------
    try {
      await pushSnapshot({
        at: now.toISOString(),
        version,
        stories: stories.slice(0, 20).map((s) => ({ id: s.id, headline: s.headline, tier: s.tier, score: s.score })),
      });
      const { date, hour } = deskDateParts(now);
      if (hour >= 7 && !(await getEdition(date))) {
        const note = await getNote();
        const edition = {
          date,
          number: await nextEditionNumber(),
          frozenAt: now.toISOString(),
          stories: stories
            .filter((s) => s.tier !== "BRIEF")
            .slice(0, 12)
            .map((s) => ({ id: s.id, headline: s.headline, tier: s.tier, score: s.score, url: s.url })),
          note: note?.text,
        };
        await saveEdition(edition);
        const { sendMorningEdition } = await import("./ops");
        await sendMorningEdition(edition);
      }
    } catch (e: any) {
      errors.push(`record: ${e?.message || "failed"}`);
    }

    return next;
  } catch {
    if (prior) return prior;
    const sample = SAMPLE_BOARD(now);
    await saveBoard(sample);
    return sample;
  } finally {
    await releaseSweepLock();
  }
}
