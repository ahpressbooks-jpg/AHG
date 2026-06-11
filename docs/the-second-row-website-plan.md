# THE SECOND ROW

## Website Design & Build Plan

**Prepared for:** The Second Row
**Document:** Website Plan · v1
**Status:** For client review
**Tagline on the door:** *One row back. Full view.*

---

## 1 · The Brief

We are building the front page of an independent civic platform — and the centerpiece is something that does not currently exist on the internet:

> **A live news wire that re-ranks itself every 60 seconds, ordered by genuine priority rather than recency — and shows its reasoning for every rank, on every story, in public.**

Three commitments define this build:

1. **Live, honestly.** The wire sweeps the world every minute. The page never pretends to be fresher — or staler — than it is. The heartbeat is visible.
2. **Ranked, transparently.** Stories sit in the order they matter, highest priority at the top, and every story can show you *why* it ranks where it does. The algorithm shows its work — because showing the work is the brand.
3. **Designed like nothing else.** Not a feed, not a grid of cards, not another news template. The interface is built from the brand's own geometry: rows in a theater, seen from the second row.

Everything below is the plan for delivering exactly that.

---

## 2 · The Big Idea: The Interface *Is* the Logo

Look at the mark. It is rows — receding rows, the second one held in maroon, flanked by two dots. It is a theater seen from your seat.

Most sites put their logo in the corner of a layout that could belong to anyone. **We are going to make the layout itself be the logo.** The front page of The Second Row is the house of a theater:

- **The Stage** sits at the top — whatever story commands the room right now.
- **The Rows** descend beneath it — every other story, seated by priority, physically receding the way the bars of the mark recede: wide and bold near the stage, narrower and quieter toward the back of the house.
- **Your seat** is the second row: close enough to see everything, far enough back to see *all* of it.

When a visitor lands on this page, they are not reading a feed. They are taking a seat. No news product has ever been laid out this way, and no competitor can copy it without copying the brand itself.

This single idea drives every design decision that follows.

---

## 3 · The Wire — Anatomy of the Front Page

The homepage is called **The Wire**. Its structure, top to bottom:

```
┌──────────────────────────────────────────────────────────────┐
│  THE SECOND ROW          ◔ sweep in 0:42        14:32 CST    │  ← Masthead + Sweep Clock
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ████████████████████  THE STAGE  ████████████████████████   │  ← Highest-priority story.
│  FLASH · CONFIRMED · 3 MIN AGO · 14 SOURCES                  │    Full-bleed. Largest type
│  The headline that owns the room right now                   │    on the page.
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  ●  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ●        │  ← ROW 1 · BULLETIN (maroon,
│     Second-tier story · why-it-ranks · velocity ▁▃▆█         │    flanking dots — the mark)
├──────────────────────────────────────────────────────────────┤
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━              │  ← ROW 2 · URGENT (ink navy)
├──────────────────────────────────────────────────────────────┤
│       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                     │  ← ROW 3 · DEVELOPING (slate)
├──────────────────────────────────────────────────────────────┤
│         ━━━━━━━━━━━━━━━━━━━                                │  ← ROW 4+ · BRIEFS (cooling ink)
├──────────────────────────────────────────────────────────────┤
│  ▒▒▒ THE TICKER · raw unranked feed · pull to open ▒▒▒      │  ← The Ticker Drawer
└──────────────────────────────────────────────────────────────┘
```

### 3.1 The Stage

The single highest-priority story in the world right now. It gets the largest typography on the page, full width, and nothing competes with it. When the lead changes, the outgoing story visibly *steps down* into Row 1 and the new lead *takes the stage* — a deliberate, watchable changeover, not a silent swap.

### 3.2 The Rows

Every other story is a **row** — a full-width horizontal band, exactly like the bars of the mark. Rows are not equal:

- Rows near the stage are **taller, wider, higher-contrast** — headline, dek, certainty tag, source count, velocity sparkline.
- Rows recede toward the back of the house: progressively **narrower, smaller, quieter** — until the back rows are single tight lines of type.
- The receding indentation literally reproduces the geometry of the logo. The page, glanced at from across a room, *is* the mark.

A reader's eye learns the physics in five seconds: **height in the house = importance in the world.**

### 3.3 Ink That Cools

Time is rendered as ink. A story that broke three minutes ago is printed in full-strength ink — maximum contrast, almost wet. As a story ages without development, its ink **cools**: contrast eases toward the parchment background in measured steps (fresh → settling → cooling → archive). A story that re-develops gets re-inked instantly.

No other news product makes time *visible*. Here you can feel which part of the page is alive without reading a single timestamp.

### 3.4 The Sweep Clock

In the masthead lives a small instrument: a thin arc that completes a circle every 60 seconds — a broadcast-clock second hand. When it completes, the sweep lands and the house re-seats itself. Next to it, in type:

```
LAST SWEEP 14:32:05 · 3 new · 2 bumped · 1 cooled · next in 0:42
```

This is the honesty mechanism. The reader is never left wondering if the page is current — the page *proves* its freshness every minute, and admits its age if a sweep is ever delayed (see § 8, Fail-safes).

### 3.5 The Ticker Drawer

A thin band pinned to the bottom of the viewport: the raw, unranked firehose in monospace type — every item the system ingested this hour, timestamped, before triage touched it. Pull it up and you're reading the wire the way a desk editor would.

This is transparency as a feature: *here is everything we saw; above is how we seated it. Compare them whenever you like.*

### 3.6 The Reasons (the rank shows its work)

Tap any row's priority chip and it opens its **workings** — a compact provenance panel:

```
WHY THIS RANKS ROW 2 · URGENT
├─ Corroboration   11 independent sources (↑4 this sweep)
├─ Velocity        coverage accelerating · ▁▂▅█
├─ Freshness       first seen 14:19 · last development 14:31
├─ Source weight   3 primary wires among sources
└─ Certainty       REPORTED — no primary confirmation yet
```

Every editorial product on earth asks to be trusted. This one is the only one that **shows the reader the scoring of every single ranking decision**. It is the Accountability Ledger's philosophy applied to the front page, and it is structurally impossible for an opaque competitor to copy without changing what they are.

---

## 4 · The Priority Ladder

Ranking uses the language of the real wire services (the system AP and Reuters bled into every newsroom — and the one *The Newsroom* dramatized). Five tiers, strictly ordered:

| Tier | Name | Color | Behavior |
|---|---|---|---|
| 1 | **FLASH** | **Signal Orange** | Takes the Stage. Full takeover protocol (§ 5). Rare by design. |
| 2 | **BULLETIN** | Maroon (the second-row red) | Top rows. Maroon band with the mark's flanking dots. |
| 3 | **URGENT** | Ink Navy | Strong rows, full detail line. |
| 4 | **DEVELOPING** | Slate | Mid-house rows, tighter presentation. |
| 5 | **BRIEF** | Cooling ink | Back rows. Single-line. Ages toward the archive. |

### How a story earns its seat

Each sweep, every story is scored on five inputs:

1. **Corroboration breadth** — how many *independent* outlets are carrying it (not echoes of one report).
2. **Velocity** — how fast new coverage is arriving; acceleration matters more than volume.
3. **Freshness & development** — when it was first seen, and when it last *changed*.
4. **Source weight** — primary wires and original reporting outrank aggregators.
5. **Editorial weighting** — your standing rules (topics, regions, beats that matter to The Second Row's desk), applied as multipliers you control.

### The Bump

When a story's score crosses a tier boundary, it gets **bumped**: the row physically slides up the house, the rows beneath re-seat, and the row flashes its new tier color for one beat. Demotions are gentler — stories *cool* and settle backward rather than being yanked.

Two disciplines keep the board calm and trustworthy:

- **Hysteresis** — a story must *hold* a higher score across consecutive sweeps to be promoted, and must decay well below a boundary to drop. No flickering. The board moves like a newsroom, not a stock ticker.
- **Bump budget** — the house re-seats at most a handful of rows per sweep, highest deltas first. Change is legible because it is rationed.

---

## 5 · The FLASH Protocol — "Orange Is Sacred"

One rule, enforced everywhere, forever: **signal orange appears nowhere in this product except a FLASH.** Not in buttons, not in links, not in marketing banners. Zero ambient orange.

So when orange arrives, it *means something*. The FLASH protocol, in sequence:

1. **The house lights dim.** Page chrome and back rows drop in contrast — the whole interface visibly steps back.
2. **The stage clears.** The current lead steps down to Row 1 in one deliberate motion.
3. **The FLASH takes the stage** — orange band, maximum type, certainty tag and source count displayed *with* it (even a FLASH shows its work).
4. **The sweep clock turns orange** until the story is downgraded to BULLETIN, and the masthead carries a quiet `FLASH · 1 ACTIVE` indicator on every page of the site.
5. **Screen readers are told politely** — an assertive live-region announcement, once, with the headline and certainty.

This is the show *The Newsroom* promised — engineered, disciplined, and real.

---

## 6 · Signature Interactions & Motion Language

Motion in this product behaves like a stage crew: precise, mechanical, never decorative.

- **The Changeover** — stage transitions are staged: outgoing steps down, incoming takes its mark. ~600ms, ease-in-out, never simultaneous chaos.
- **The Bump** — rows slide on a vertical track with a subtle mechanical settle, echoing split-flap rundown boards. The board never reflows invisibly; you can *watch* the news change rank.
- **The Re-ink** — a developed story re-saturates with a brief ink-bloom along its row.
- **Newsroom Mode** *(toggle, off by default)* — quiet teletype ticks on new items, a single low chime on FLASH. Desk ambience for the people who want it.
- **House Lights** — light theme is the **Matinee** (parchment house, ink type — the brand's daylight look). Dark theme is the **Evening Performance** (the navy banner look, parchment type). Auto-switches with local time; reader can override.
- **Desk keys** — `J/K` walk the rows, `Enter` opens workings, `T` opens the Ticker, `.` jumps to the newest sweep. The site rewards living in it.
- **Reduced motion, honored fully** — with `prefers-reduced-motion`, every slide becomes a crossfade and the sweep clock becomes a static countdown. Nothing conveys by motion alone.

---

## 7 · Design System

### 7.1 Palette (from the brand mark)

| Token | Hex | Role |
|---|---|---|
| **Parchment** | `#EDE6D8` | House background (Matinee) |
| **Ink Navy** | `#16202E` | Type, structure; background (Evening) |
| **Second-Row Maroon** | `#7E2230` | BULLETIN tier, brand accents, the second row itself |
| **Slate** | `#64778A` | DEVELOPING tier, secondary type, instruments |
| **Signal Orange** | `#F25C05` | **FLASH only. Never anywhere else.** |
| Ink steps | 4-step ramp navy→parchment | The cooling-ink time system |

Both themes are checked at WCAG AA minimum (most pairings AAA). FLASH never relies on color alone — tier is always color **+ label + position**, so the system survives color-blindness completely.

### 7.2 Typography

| Voice | Face | Used for |
|---|---|---|
| **The Masthead** | Strong serif matched to the wordmark (e.g., Source Serif 4 / Fraunces — final pick in design phase, licensed for web) | Stage headlines, section titles |
| **The Desk** | Inter | Row deks, UI, navigation |
| **The Wire** | IBM Plex Mono | Timestamps, tiers, sweep log, the Ticker, workings panels |

The mono voice is what makes the product feel like an instrument instead of a blog: every number, time, and tier on the site speaks in wire-machine type.

### 7.3 The Row Motif

The logo's bar-and-dots geometry is the only iconography system: tier chips are short bars, the loading state is the mark assembling row by row, the favicon is the maroon row with its dots, section dividers are receding bars. One shape language, everywhere.

---

## 8 · How It Works (the engineering, in plain terms)

Built on **Vercel** with **Next.js** — the same infrastructure used by the largest media properties on the web — with two specialist services doing the gathering:

### The 60-Second Loop

```
every 60 seconds, on the server:

  1. SWEEP      Firecrawl pulls your configured source list —
                wires, mastheads, official feeds — as clean,
                structured text. Parallel runs broad live web
                search to catch what the source list hasn't
                printed yet and to count independent pickup.

  2. RESOLVE    New items are de-duplicated against the live
                board (same story ≠ two rows) and clustered:
                one story, many sources.

  3. TRIAGE     Each cluster is scored (§ 4) and given a
                certainty tag: CONFIRMED / REPORTED /
                DEVELOPING / DISPUTED — driven by independent-
                corroboration counts from Parallel.

  4. SEAT       Tiers assigned with hysteresis; bumps, cools,
                stage changeovers computed; the sweep log line
                is written.

  5. PUBLISH    The new board state is pushed to a fast edge
                store. Every open browser picks it up within
                seconds and re-seats the house.
```

### The pieces

| Layer | Technology | Job |
|---|---|---|
| Scheduler | Vercel Cron (per-minute) | Fires the sweep |
| Gathering | **Firecrawl** | Scrapes/structures the named source list reliably |
| Corroboration | **Parallel** | Live web search: discovery + independent-pickup counts |
| Triage | Scoring engine + LLM assist | Clustering, certainty tags, headline normalization |
| Memory | Postgres (Neon) | Story history, sweep logs, archive |
| Hot state | Upstash Redis | The live board, served in milliseconds |
| Delivery | Next.js on Vercel Edge | First paint server-rendered; the browser then syncs with each sweep |

The browser never hammers the news sources — **one** server-side sweep serves every reader on earth, which is what makes per-minute freshness affordable at any traffic level.

### Fail-safes (honesty under failure)

- If a sweep is late, the clock says so: `LAST SWEEP 4 MIN AGO — RETRYING` in slate, on the page, not hidden in a console. The board never silently goes stale.
- If a source goes down, the system notes it in the sweep log and continues on the remaining sources.
- Every sweep is logged permanently — a public **Sweep Log** page shows the system's own uptime and decisions. The platform keeps score on itself; so does its website.

---

## 9 · The Rest of the House (site map)

The Wire is the front page. Around it, four rooms, all on the same design system:

| Page | What it is |
|---|---|
| **The Wire** `/` | Everything above. The live, ranked board. |
| **The Briefing** `/briefing` | The daily written read — the desk's own words, every claim carrying its certainty tag. Calm, long-form reading layout: the Matinee at its quietest. |
| **The Spin Room** `/spin` | The signature editorial format: the same story's framing **left / center / right, side by side**, with the desk's verdict beneath. Three columns on one stage — the layout argument the brand makes in furniture. |
| **The Ledger** `/ledger` | The public scoreboard: every call, dated, confidence-tagged, scored — hits *and misses*, running tally, never edited after the fact. Rendered in wire-mono like the instrument it is. |
| **The Seat** `/about` | Who writes this, why the second row, the method, and the subscription tiers (Free Floor / Second Row Pro / Founding Member). |

Story permalinks live under `/wire/[story]` — each one a story's full history: every development, every rank it held, every sweep that moved it. A story's *biography*, not just its latest paragraph.

---

## 10 · Performance, Accessibility, SEO

- **Speed budget:** first paint of the board under 1.5s on a median phone; sweep updates apply in under 200ms with zero layout jank (rows animate on transforms only).
- **Accessibility:** WCAG 2.2 AA across both themes; full keyboard operation; `aria-live` announcements for bumps (polite) and FLASH (assertive, once); reduced-motion equivalents for every animation; tier never conveyed by color alone.
- **SEO & sharing:** server-rendered headlines (the board is real HTML, not a JavaScript shell); per-story permalinks with rich metadata; auto-generated social cards in the brand system — navy card, parchment type, maroon row.
- **Resilience:** the page works with JavaScript disabled — you get the board as of the last sweep, with a note saying exactly that. Honesty even in degradation.

---

## 11 · Build Plan

Four stages, each with a demo you can click. No stage opens until the previous one is approved — *allowed to stall, not allowed to skip.*

| Stage | Duration | Delivers |
|---|---|---|
| **1 · The Design of the House** | 2 weeks | Full design system (palette, type, row geometry, both themes), high-fidelity motion prototypes of the Bump, the Changeover, the FLASH protocol, and the Sweep Clock. Approved on real devices, not slideware. |
| **2 · The Engine** | 2–3 weeks | The 60-second loop live on staging: Firecrawl + Parallel sweeps, clustering, scoring, tiering with hysteresis, sweep logging. Reviewed against a week of real news side-by-side with the majors. |
| **3 · The Wire, Live** | 2–3 weeks | Engine + house joined: the full front page running on real-time data, Ticker Drawer, workings panels, Newsroom Mode, desk keys, both themes, all fail-safes. |
| **4 · The Full House** | 2 weeks | Briefing, Spin Room, Ledger, The Seat; permalinks and story biographies; performance/accessibility audit passes; domain, analytics, launch. |

**Total: roughly 8–10 weeks** from kickoff to a public, living site.

### What we need from you

1. **The source list** — the outlets and feeds the desk trusts enough to sweep (we'll propose a starting roster of wires + mastheads for your edit).
2. **Editorial weightings** — the beats, regions, and topics that should count extra at *your* desk.
3. **Accounts** — Firecrawl and Parallel API keys, Vercel team, and the domain (we can stand all of these up under your ownership).
4. **Brand files** — the master logo vectors and any type licenses already held.
5. **One hour a week** — a standing review where we show the work. Fittingly.

---

## 12 · What Success Looks Like

- **The minute test:** any story major wires carry appears on The Wire within two sweeps, seated sensibly.
- **The calm test:** the board averages a small, legible number of re-seats per sweep — alive, never frantic.
- **The trust test:** readers open the workings panels — measured — because the *why* is a feature people actually use.
- **The return test:** direct, repeat visits trend up; a wire that is genuinely live becomes a tab people keep open. That open tab is the audience the rest of the platform is built on.

---

## 13 · After Launch (the road, not the promise)

Designed-in from day one, switched on when wanted: FLASH push/email alerts for subscribers · the morning board frozen as an auto-draft email briefing · a PWA so the Wire installs like an app · per-reader desk preferences · and a public API for the Ledger, because the score was always meant to be checkable.

---

*The Second Row · Website Plan v1 — the house, the rows, the sweep.*
*One row back. Full view.*
