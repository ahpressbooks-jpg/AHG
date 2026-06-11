"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BoardState } from "@/lib/types";
import House from "./House";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";
import { clock, Diff, diffBoards } from "./util";

const POLL_MS = 30_000;
const SWEEP_MS = 60_000;
const AWAY_MIN = 10;

const FLASH_FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#16202E"/><rect x="28" y="22" width="44" height="9" rx="4.5" fill="#64778A"/><circle cx="19" cy="45" r="4" fill="#C0455A"/><rect x="27" y="38" width="46" height="14" rx="7" fill="#C0455A"/><circle cx="81" cy="45" r="4" fill="#C0455A"/><rect x="32" y="60" width="36" height="9" rx="4.5" fill="#EDE6D8"/><rect x="37" y="76" width="26" height="7" rx="3.5" fill="#EDE6D8"/><circle cx="78" cy="22" r="14" fill="#F25C05"/></svg>`
  );

// --- newsroom mode: synthesized desk sounds, no assets, off by default -----
function makeSounds() {
  let ctx: AudioContext | null = null;
  const ensure = () => {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  };
  return {
    tick() {
      try {
        const c = ensure();
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "square";
        o.frequency.value = 1320;
        g.gain.value = 0.025;
        o.connect(g).connect(c.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.05);
        o.stop(c.currentTime + 0.06);
      } catch {}
    },
    chime() {
      try {
        const c = ensure();
        [660, 880].forEach((f, i) => {
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "sine";
          o.frequency.value = f;
          g.gain.value = 0.05;
          o.connect(g).connect(c.destination);
          o.start(c.currentTime + i * 0.16);
          g.gain.setValueAtTime(0.05, c.currentTime + i * 0.16);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + i * 0.16 + 0.4);
          o.stop(c.currentTime + i * 0.16 + 0.45);
        });
      } catch {}
    },
  };
}

function SweepClock({ sweptAt, nowMs, flash }: { sweptAt: string; nowMs: number; flash: boolean }) {
  const elapsed = nowMs - new Date(sweptAt).getTime();
  const frac = Math.min(1, Math.max(0, (elapsed % SWEEP_MS) / SWEEP_MS));
  const late = elapsed > SWEEP_MS * 1.8;
  const r = 8;
  const c = 2 * Math.PI * r;
  const remain = Math.max(0, Math.ceil((SWEEP_MS - elapsed) / 1000));
  return (
    <span
      title={late ? "Sweep running late" : `Next sweep in ${remain}s`}
      aria-hidden="true"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r={r} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <circle
          cx="11"
          cy="11"
          r={r}
          fill="none"
          stroke={flash ? "var(--orange)" : late ? "var(--maroon-row)" : "var(--slate)"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - (late ? 1 : frac))}
          transform="rotate(-90 11 11)"
        />
      </svg>
    </span>
  );
}

export default function Board({ initial, forceSample }: { initial: BoardState; forceSample: boolean }) {
  const [board, setBoard] = useState<BoardState>(initial);
  const [nowMs, setNowMs] = useState<number>(() => new Date(initial.sweptAt).getTime());
  const [queuedDiff, setQueuedDiff] = useState<Diff | null>(null);
  const [held, setHeld] = useState(false);
  const [newsroom, setNewsroom] = useState(false);
  const [openWorkings, setOpenWorkings] = useState<string | null>(null);
  const [tickerOpen, setTickerOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [wywa, setWywa] = useState<{ gapMin: number; diff: Diff } | null>(null);
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");

  const boardRef = useRef(board);
  boardRef.current = board;
  const queuedRef = useRef<BoardState | null>(null);
  const heldRef = useRef(held);
  heldRef.current = held;
  const wywaRef = useRef(wywa);
  wywaRef.current = wywa;
  const openRef = useRef<string | null>(null);
  openRef.current = openWorkings;
  const tickerRef = useRef(false);
  tickerRef.current = tickerOpen;
  const lastInteractRef = useRef(0);
  const hiddenAtRef = useRef<number | null>(null);
  const announcedFlash = useRef<Set<string>>(new Set());
  const pendingFlipRef = useRef<Map<string, number> | null>(null);
  const [entering, setEntering] = useState<Set<string>>(new Set());
  const soundsRef = useRef<ReturnType<typeof makeSounds> | null>(null);
  const newsroomRef = useRef(false);
  newsroomRef.current = newsroom;

  const flashActive = board.stories.some((s) => s.tier === "FLASH");
  const flashIncoming = (queuedDiff?.flashes.length ?? 0) > 0;
  const flashAny = flashActive || flashIncoming;

  // ---- apply a new board state, with bump physics (FLIP) -------------------
  const applyBoard = useCallback((next: BoardState, announce = true) => {
    const prev = boardRef.current;
    const rects = new Map<string, number>();
    document.querySelectorAll<HTMLElement>("[data-sid]").forEach((el) => {
      rects.set(el.dataset.sid!, el.getBoundingClientRect().top);
    });
    pendingFlipRef.current = rects;
    const prevIds = new Set(prev.stories.map((s) => s.id));
    setEntering(new Set(next.stories.filter((s) => !prevIds.has(s.id)).map((s) => s.id)));

    const d = diffBoards(prev, next);
    setBoard(next);
    queuedRef.current = null;
    setQueuedDiff(null);

    if (announce && d.total > 0) {
      setPolite(`Board re-seated: ${d.fresh} new, ${d.bumped} bumped, ${d.cooled} cooled.`);
    }
    if (newsroomRef.current && soundsRef.current) {
      if (d.flashes.length > 0) soundsRef.current.chime();
      else for (let i = 0; i < Math.min(3, d.fresh); i++) setTimeout(() => soundsRef.current?.tick(), i * 140);
    }
  }, []);

  // FLIP: animate rows from their previous seats to their new ones.
  useLayoutEffect(() => {
    const rects = pendingFlipRef.current;
    if (!rects) return;
    pendingFlipRef.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll<HTMLElement>("[data-sid]").forEach((el) => {
      const old = rects.get(el.dataset.sid!);
      if (old == null) return;
      const delta = old - el.getBoundingClientRect().top;
      if (Math.abs(delta) < 2) return;
      el.classList.remove("is-bumping");
      el.style.transform = `translateY(${delta}px)`;
      void el.offsetHeight;
      el.classList.add("is-bumping");
      el.style.transform = "";
      const clear = () => {
        el.classList.remove("is-bumping");
        el.removeEventListener("transitionend", clear);
      };
      el.addEventListener("transitionend", clear);
    });
  }, [board.version]);

  // ---- the Reading Rule -----------------------------------------------------
  const engaged = useCallback(() => {
    return (
      heldRef.current ||
      openRef.current != null ||
      tickerRef.current ||
      wywaRef.current != null ||
      window.scrollY > 140 ||
      Date.now() - lastInteractRef.current < 4000
    );
  }, []);

  const handleIncoming = useCallback(
    (next: BoardState) => {
      const prev = boardRef.current;
      if (next.version === prev.version && next.sweptAt === prev.sweptAt) return;
      const d = diffBoards(prev, next);

      // FLASH exception: the room is told immediately, the rows still wait.
      for (const id of d.flashes) {
        if (!announcedFlash.current.has(id)) {
          announcedFlash.current.add(id);
          const s = next.stories.find((x) => x.id === id);
          if (s) setAssertive(`Flash on the wire: ${s.headline}`);
          if (newsroomRef.current && soundsRef.current) soundsRef.current.chime();
        }
      }

      if (document.hidden) {
        queuedRef.current = next;
        setQueuedDiff(d);
        return;
      }
      if (d.total === 0) {
        // Nothing moved — refresh quietly (timestamps, log) without ceremony.
        applyBoard(next, false);
        return;
      }
      if (engaged()) {
        queuedRef.current = next;
        setQueuedDiff(d);
      } else {
        applyBoard(next);
      }
    },
    [applyBoard, engaged]
  );

  // ---- polling ---------------------------------------------------------------
  useEffect(() => {
    let stop = false;
    const url = forceSample ? "/api/board?sample=1" : "/api/board";
    const poll = async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as BoardState;
        if (!stop) handleIncoming(next);
      } catch {
        /* the sweepline shows staleness honestly */
      }
    };
    const t = setInterval(poll, POLL_MS);
    const kickoff = setTimeout(poll, 4000);
    return () => {
      stop = true;
      clearInterval(t);
      clearTimeout(kickoff);
    };
  }, [handleIncoming, forceSample]);

  // ---- clock tick -------------------------------------------------------------
  useEffect(() => {
    setNowMs(Date.now());
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // ---- interaction + auto-apply when reader returns to the top ----------------
  useEffect(() => {
    const mark = () => (lastInteractRef.current = Date.now());
    window.addEventListener("pointerdown", mark, { passive: true });
    window.addEventListener("keydown", mark, { passive: true });
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchstart", mark, { passive: true });
    const auto = setInterval(() => {
      if (
        queuedRef.current &&
        !document.hidden &&
        !heldRef.current &&
        !wywaRef.current &&
        window.scrollY < 140 &&
        Date.now() - lastInteractRef.current > 3500 &&
        openRef.current == null &&
        !tickerRef.current
      ) {
        applyBoard(queuedRef.current);
      }
    }, 2000);
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchstart", mark);
      clearInterval(auto);
    };
  }, [applyBoard]);

  // ---- While You Were Away ------------------------------------------------------
  useEffect(() => {
    const onVis = async () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        return;
      }
      const away = hiddenAtRef.current ? (Date.now() - hiddenAtRef.current) / 60_000 : 0;
      hiddenAtRef.current = null;
      try {
        const res = await fetch(forceSample ? "/api/board?sample=1" : "/api/board", { cache: "no-store" });
        if (res.ok) {
          const next = (await res.json()) as BoardState;
          const d = diffBoards(boardRef.current, next);
          if (away >= AWAY_MIN && d.total > 0) {
            queuedRef.current = next;
            setQueuedDiff(d);
            setWywa({ gapMin: Math.round(away), diff: d });
          } else {
            handleIncoming(next);
          }
        }
      } catch {}
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [handleIncoming, forceSample]);

  // ---- open-tab signals: title + favicon ----------------------------------------
  useEffect(() => {
    const base = "The Second Row — The Wire";
    const n = queuedDiff?.total ?? 0;
    document.title = n > 0 ? `(${n}) ${base}` : flashAny ? `⬤ FLASH — ${base}` : base;
  }, [queuedDiff, flashAny]);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]');
    if (links.length === 0) return;
    links.forEach((l) => {
      if (flashAny) {
        if (!l.dataset.orig) l.dataset.orig = l.href;
        l.href = FLASH_FAVICON;
      } else if (l.dataset.orig) {
        l.href = l.dataset.orig;
        delete l.dataset.orig;
      }
    });
  }, [flashAny]);

  // ---- FLASH protocol: the house lights dim --------------------------------------
  useEffect(() => {
    document.body.classList.toggle("flash-active", flashActive);
    return () => document.body.classList.remove("flash-active");
  }, [flashActive]);

  // ---- desk keys -------------------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-rowlink]"));
      const idx = links.findIndex((l) => l === document.activeElement);
      if (e.key === "j" || e.key === "k") {
        e.preventDefault();
        const next = e.key === "j" ? Math.min(links.length - 1, idx + 1) : Math.max(0, idx - 1);
        links[next]?.focus();
        links[next]?.scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (e.key === "t" || e.key === "T") {
        setTickerOpen((v) => !v);
      } else if (e.key === "h" || e.key === "H") {
        setHeld((v) => !v);
      } else if (e.key === ".") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (queuedRef.current) applyBoard(queuedRef.current);
      } else if (e.key === "Enter" && document.activeElement?.hasAttribute("data-rowlink")) {
        // native link behavior — open the source
      } else if (e.key === "?") {
        setLegendOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyBoard]);

  // ---- first-visit legend --------------------------------------------------------------
  useEffect(() => {
    try {
      if (!localStorage.getItem("tsr_legend")) setLegendOpen(true);
    } catch {}
  }, []);
  const closeLegend = () => {
    setLegendOpen(false);
    try {
      localStorage.setItem("tsr_legend", "1");
    } catch {}
  };

  const toggleNewsroom = () => {
    if (!soundsRef.current) soundsRef.current = makeSounds();
    setNewsroom((v) => {
      const on = !v;
      if (on) soundsRef.current?.tick();
      return on;
    });
  };

  const lastSweepAgeS = Math.round((nowMs - new Date(board.sweptAt).getTime()) / 1000);
  const late = lastSweepAgeS > 110;
  const flashCount = board.stories.filter((s) => s.tier === "FLASH").length;
  const latestRaw = board.raw[0];

  return (
    <>
      {/* MASTHEAD + INSTRUMENTS */}
      <header className="masthead">
        <div className="wrap masthead-inner">
          <Link href="/" className="masthead-brand" aria-label="The Second Row — the Wire">
            <Mark size={30} />
            <span className="masthead-name">THE SECOND ROW</span>
          </Link>
          <div className="instruments">
            {flashCount > 0 && <span className="flash-indicator">FLASH · {flashCount} ACTIVE</span>}
            <SweepClock sweptAt={board.sweptAt} nowMs={nowMs} flash={flashAny} />
            <span className={`sweepline${late ? " is-late" : ""}`} aria-live="off">
              {late ? (
                <>LAST SWEEP {Math.floor(lastSweepAgeS / 60)} MIN AGO — RETRYING</>
              ) : (
                <>
                  <strong>SWEEP {clock(board.sweptAt)}</strong> · {board.log[0]?.line ?? "—"}
                </>
              )}
            </span>
            <button
              className="btn-instrument"
              aria-pressed={held}
              onClick={() => setHeld((v) => !v)}
              title="Hold the house — changes queue while held (H)"
            >
              {held ? "Held" : "Hold"}
            </button>
            <button
              className="btn-instrument"
              aria-pressed={newsroom}
              onClick={toggleNewsroom}
              title="Newsroom mode — desk sounds"
            >
              {newsroom ? "Sound on" : "Sound"}
            </button>
            <ThemeToggle />
          </div>
        </div>
        <nav className="wrap masthead-nav" aria-label="Sections" style={{ paddingBottom: 8 }}>
          <Link href="/briefing">Briefing</Link>
          <Link href="/spin">Spin Room</Link>
          <Link href="/ledger">Ledger</Link>
          <Link href="/method">Method</Link>
          <Link href="/about">The Seat</Link>
        </nav>
      </header>

      {/* THE PILL — the Reading Rule made visible */}
      {queuedDiff && queuedDiff.total > 0 && !wywa && (
        <button className="pill" onClick={() => queuedRef.current && applyBoard(queuedRef.current)}>
          {queuedDiff.total} change{queuedDiff.total === 1 ? "" : "s"} waiting — re-seat the house
        </button>
      )}

      {/* THE HOUSE */}
      <House
        board={board}
        nowMs={nowMs}
        openWorkings={openWorkings}
        onToggleWorkings={setOpenWorkings}
        entering={entering}
      />

      {/* THE TICKER */}
      <div className="ticker" role="complementary" aria-label="The raw wire, unranked">
        <button className="ticker-bar" onClick={() => setTickerOpen((v) => !v)} aria-expanded={tickerOpen}>
          <span className="ticker-label">THE TICKER {tickerOpen ? "▾" : "▴"}</span>
          {!tickerOpen && latestRaw && (
            <span className="ticker-latest">
              {clock(latestRaw.at)} · {latestRaw.source} — {latestRaw.title}
            </span>
          )}
        </button>
        {tickerOpen && (
          <div className="ticker-drawer">
            {board.raw.map((r) => (
              <div className="ticker-item" key={r.url}>
                <time>{clock(r.at)}</time>
                <span className="tsrc">{r.source}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </div>
            ))}
            {board.raw.length === 0 && <div className="ticker-item">The raw wire is empty.</div>}
          </div>
        )}
      </div>

      {/* WHILE YOU WERE AWAY */}
      {wywa && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="While you were away">
          <div className="overlay-card">
            <div className="overlay-kicker">Since you stepped out · {wywa.gapMin} min</div>
            <h2 className="overlay-title">The house moved.</h2>
            <div className="overlay-body">
              {wywa.diff.flashes.length > 0 && (
                <div>
                  <strong>{wywa.diff.flashes.length} FLASH</strong> raised
                </div>
              )}
              <div>
                <strong>{wywa.diff.fresh}</strong> new stories seated
              </div>
              <div>
                <strong>{wywa.diff.bumped}</strong> bumped up · <strong>{wywa.diff.cooled}</strong> cooled
              </div>
            </div>
            <div className="overlay-actions">
              <button
                className="btn"
                onClick={() => {
                  setWywa(null);
                  if (queuedRef.current) applyBoard(queuedRef.current);
                }}
              >
                Re-seat the house
              </button>
              <button className="btn btn--ghost" onClick={() => setWywa(null)}>
                Keep reading as it was
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIRST-VISIT LEGEND */}
      {legendOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="How to read the house">
          <div className="overlay-card">
            <div className="overlay-kicker">How to read the house</div>
            <h2 className="overlay-title">You&apos;re seated one row back. You can see everything.</h2>
            <div className="legend-rows">
              <div className="legend-row">
                <span className="legend-bar" style={{ width: 44, background: "var(--orange)" }} />
                <span><strong>FLASH</strong> — takes the stage. Orange appears for this and nothing else.</span>
              </div>
              <div className="legend-row">
                <span className="legend-bar" style={{ width: 38, background: "var(--maroon-row)" }} />
                <span><strong>BULLETIN</strong> — the maroon row with the dots. The top of the house.</span>
              </div>
              <div className="legend-row">
                <span className="legend-bar" style={{ width: 30, background: "var(--ink)" }} />
                <span><strong>URGENT</strong> · <strong>DEVELOPING</strong> · <strong>BRIEF</strong> — rows recede as priority falls; ink fades as stories age.</span>
              </div>
              <div className="legend-row">
                <span className="legend-bar" style={{ width: 22, background: "var(--slate)" }} />
                <span>The board re-checks the wire every 60 seconds. It never re-seats while you&apos;re reading — changes wait in a pill until you&apos;re ready. Every rank can show its work: tap any tier chip.</span>
              </div>
            </div>
            <div className="overlay-body" style={{ marginTop: 8 }}>
              Desk keys: <strong>J/K</strong> walk the rows · <strong>T</strong> ticker · <strong>H</strong> hold · <strong>.</strong> newest · <strong>?</strong> this card
            </div>
            <div className="overlay-actions">
              <button className="btn" onClick={closeLegend}>Take your seat</button>
            </div>
          </div>
        </div>
      )}

      {/* screen-reader announcements */}
      <div aria-live="polite" className="visually-hidden">{polite}</div>
      <div aria-live="assertive" role="alert" className="visually-hidden">{assertive}</div>
    </>
  );
}
