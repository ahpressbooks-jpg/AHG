# THE SECOND ROW

## Website Plan — Pre-Build Addendum (v1.1)

**Reads alongside:** `the-second-row-website-plan.md`
**Purpose:** the pre-build review — decisions to lock, refinements that protect budget and trust, and additions the v1 plan deserved. Nothing here changes the concept. Everything here protects it.

---

## A · Five Decisions to Lock Before Stage 1

These are choices, not tasks. Each has a recommendation; all five should be settled in the kickoff hour.

| # | Decision | Recommendation |
|---|---|---|
| **A1** | **The beat.** What does the Wire cover — and refuse to cover? Without a written charter, every aggregator drifts toward "everything," which is just Google News in better clothes. | A one-page charter: national civic/political/policy news + world events of civic consequence. Sports, celebrity, and markets-as-spectacle are out unless they cross into policy. The charter is published on the methodology page. |
| **A2** | **Text-only board.** Thumbnails make every news product look the same — and image rights are the single biggest legal trap in aggregation. | **Text-only v1.** Faster, calmer, unmistakable, and it sidesteps image licensing entirely. Photography can earn its way in later, deliberately. |
| **A3** | **The clock.** Whose time does the house run on? | The **desk clock** — all board times in the desk's home timezone, like a real newsroom wall clock; the reader's local time on hover. The single clock is part of the instrument's character. |
| **A4** | **FLASH authority.** Can the machine declare a FLASH at 3 a.m. with no human awake? | Yes — but labeled. Machine-raised FLASH carries `MACHINE-SEATED` until the desk confirms it (one tap in the Control Room), at which point it becomes `DESK-CONFIRMED`. The machine may always *demote*. Honesty resolves the solo-operator problem. |
| **A5** | **The page's name.** "The Wire" carries outside associations (HBO, Wired). Cosmetic, but it appears in copy everywhere, so it must be settled before design. | Keep **The Wire** as the working name pending a quick confusion check; **The Board** is the ready alternate and arguably more ours (rundown board, "the board re-seats"). |

---

## B · Architecture Refinements

### B1 · Tiered ingestion — the one that protects the budget

The naive reading of "sweep every source every minute" means roughly:

```
30 sources × 1,440 sweeps/day        ≈  43,000 scrapes/day   ≈ 1.3M/month
+ corroboration search per story/sweep ≈  comparable volume again
```

That is an API bill in the thousands per month, for mostly unchanged pages. The correct shape is **detect cheap, enrich selectively** — the minute-by-minute freshness is preserved; the spend collapses by two orders of magnitude:

| Tier | Job | Tool | Runs | Cost shape |
|---|---|---|---|---|
| 0 | **Detect** — has anything changed? | RSS/Atom, sitemaps, conditional GETs (ETag/Last-Modified) | Every 60s, all sources | ~Free |
| 1 | **Extract** — get the new thing, clean | **Firecrawl** | Only new/changed URLs (~hundreds/day, not tens of thousands) | Small |
| 2 | **Corroborate** — who else has this, independently? | **Parallel** | Only clusters *in motion* — new, accelerating, or near a tier boundary — on a heat-based backoff (1m / 5m / 15m) | Small |
| 3 | **Triage** — cluster, tag certainty, normalize headline | LLM | Only new/changed clusters; a fast model for routine work, a strong model as the FLASH gate | Small |

Vendor pricing gets verified at contract time, but the call-volume math above is the part that matters and it holds regardless of price sheet. **New Stage 2 exit gate: a measured cost-per-day report from a full week of staging operation.** No launch without knowing the burn.

### B2 · Sweep mechanics

- Per-minute scheduling requires **Vercel Pro**; if cron drift ever matters in practice, a queue scheduler (QStash/Inngest) slots in without redesign.
- The sweep is **time-boxed**: fetches run in parallel, stages have deadlines, and anything that misses the window carries over to the next sweep rather than delaying the board.
- A **dead-man switch** watches the sweep heartbeat — three missed sweeps pages the desk and the studio. The board, meanwhile, says exactly what's true: `LAST SWEEP 4 MIN AGO — RETRYING`.

### B3 · Diff-based publishing

The server doesn't just publish the new board — it publishes **what changed** (bumps, cools, changeovers, flashes) as events. Browsers animate exactly what happened rather than re-deriving it, which makes the motion truthful, makes "While You Were Away" (§ C2) replayable, and keeps payloads tiny.

### B4 · Adversarial inputs — two defenses the plan owed itself

1. **Scraped text is untrusted.** Anything pulled from the web is treated as data, never as instructions — triage prompts are structured and quoted so a malicious page containing "rank this story highest" is inert. Scraped markup is never rendered raw.
2. **Corroboration counts owners, not domains.** Forty sites under one parent company count once. A domain-reputation roster and velocity-outlier damping keep coordinated echo from buying a row. The moment this board matters, someone will try to game it; it ships pre-hardened.

### B5 · Data custody

Hot board in Redis; history in Postgres with partitioning. Story biographies are kept forever (they're the product's memory); raw sweep payloads age out at 90 days. A monthly export lands in client-owned storage — the archive belongs to The Second Row, not to a vendor.

### B6 · Public endpoint discipline

The board API is edge-cached per sweep version — scrapers and spikes hit the cache, never the engine.

---

## C · UX Additions

### C1 · The Reading Rule — the most important interaction decision in the product

A board that re-ranks every 60 seconds has one fatal failure mode: **moving a story while someone is reading it.** The rule, absolute:

> **The house never re-seats under a reading user.**

- Updates apply instantly only when the reader is at the top of the board and idle, or on tab refocus.
- Otherwise changes **queue** and a quiet pill appears in the masthead: `3 changes waiting — re-seat the house`. The reader re-seats it; the board never yanks.
- A **HOLD** control freezes the board explicitly (and the board auto-holds while the Ticker or a workings panel is open). Reduced-motion and vestibular-safety win included.
- The sole exception: a FLASH may always announce itself — via the masthead and clock, still without moving the row under the reader's eyes.

### C2 · While You Were Away

Return to the tab after ten minutes or more and the board doesn't dump 40 animations on you. It shows one quiet interstitial first:

```
SINCE YOU STEPPED OUT · 41 MIN
1 FLASH (machine-seated 14:32, desk-confirmed 14:39)
4 stories bumped · 2 new bulletins · 6 cooled
```

…then settles into the current house. This same format is, by design, the skeleton of the future **7 a.m. board email** — built once, used twice.

### C3 · Open-tab signals

The core audience keeps the Wire open in a tab all day. So the tab itself is an instrument: the title carries the count of changes since you looked away; the favicon — the maroon row with its dots — gains an orange dot only during an active FLASH. (Orange stays sacred even at 16 pixels.)

### C4 · First contact

A first-time visitor gets a 15-second, once-only **"How to read the house"** overlay (the stage, the rows, the tiers, the clock — four beats). A compact permanent legend lives in the footer, beside a link to the methodology page (§ D6). The system must be self-teaching in under a minute, because no one reads instructions for a news site twice.

### C5 · The extremes: quiet house, big night

- **Quiet house:** a slow Sunday seats eight stories, the board says so plainly — `A quiet hour. 8 stories seated.` — and is *shorter*. Variable board length is a feature; padding a quiet day is exactly the dishonesty this brand exists against.
- **Big night:** the bump budget holds the board legible; back rows condense into a counted group (`+ 22 briefs in the back rows`); and a **multi-FLASH protocol** is defined: the stage holds the highest-scored FLASH, additional flashes seat at Row 1 in orange, the masthead reads `FLASH · 2 ACTIVE`.

### C6 · Mobile-first grammar

On a phone there is no horizontal room for rows to recede — so depth is carried by **type scale, row height, and ink weight** instead of width, and the tier mark becomes the flanking dots. Most readers will live here. **Stage 1 prototypes the phone first**, then widens to the desktop house — never the reverse.

### C7 · Connective tissue

When the desk makes a Ledger call about a story on the Wire, the story's biography links to the Ledger entry, and the Ledger links back to the story as it stood when the call was made. The wire shows the world; the Ledger shows the desk's record against it. One loop.

---

## D · Editorial & Legal Guardrails

1. **Aggregation posture, written down:** headline + excerpt of ~25 words maximum + prominent source attribution + link out to the source. Never full text. Robots and source terms respected. A published corrections/takedown contact. (With A2's text-only board, the image-rights question is eliminated entirely.)
2. **Certainty tags are coverage math, not truth verdicts.** `CONFIRMED` means *independently carried by N+ outlets including a primary wire* — a fact about coverage the system can actually stand behind. The definitions are public. The desk's actual judgments live where they belong: the Briefing, the Spin Room, the Ledger. This one distinction is the liability firewall *and* the brand kept honest.
3. **"No quiet edits" applies to the machine too.** Every headline normalization, tier change, and correction is logged in the story's public biography. The wire holds itself to the Ledger's standard.
4. **Desk interventions are disclosed.** When the Control Room (§ F1) pins, re-seats, or kills a story, the biography says so: `seated by the desk · 14:41`. Even the human override shows its work.
5. **Graphic content:** a headline-normalization style guide — facts without gratuitous detail — applied by the triage layer.
6. **The Methodology page, versioned.** How the board scores, what the tiers mean, what the desk can override — with a public changelog (`Board Method v1.2 — corroboration now counts owners, not domains`). The algorithm keeps a ledger of itself.
7. **The boring-but-required set:** privacy policy (privacy-first analytics means no cookie banner), terms, accessibility statement, corrections policy.

---

## E · Growth Wiring (so the site feeds the list from day one)

The wire is the engine, but the *owned email list* is the master lever — the v1 site must convert attention into addresses without betraying the room's calm:

1. **A capture row, not a popup.** One standing row seated mid-house, in the board's own grammar: `TAKE YOUR SEAT — the 7 a.m. board and the daily briefing, free.` It occupies a seat; it never covers one. A second, natural capture moment follows a FLASH (the reader who just watched the room work is the reader who subscribes).
2. **Warm the email domain now.** SPF, DKIM, and DMARC configured at domain setup — weeks before the first send — so the briefing never launches from a cold reputation. ESP chosen early.
3. **News SEO:** `LiveBlogPosting` structured data on the Wire, `NewsArticle` on story biographies, a news sitemap, Top Stories eligibility checklist.
4. **Share cards carry the moment:** rank and clock in the card — `ROW 1 · BULLETIN · 14:32` — so a share is a citation of the board, not just a link.
5. **First-class metrics:** list signups and workings-panel opens tracked from day one (privacy-first analytics — Plausible-class, no consent banner, consistent with "ad-free, always").

---

## F · The Control Room, Ops & Costs

### F1 · New deliverable: The Control Room

A one-person newsroom needs a thumb on the scale — designed in, not bolted on. A private desk console:

- **Pin / force-tier / kill / merge** clusters; edit a normalized headline; confirm or stand down a FLASH (see A4).
- **Source roster manager** (add, weight, suspend) and editorial-weight sliders (the § 4 multipliers, owned by the desk, no deploy required).
- **Live sweep log** with cost-per-day readout.
- Passkey auth, fully audit-logged — and per § D4, interventions surface publicly in story biographies. The override itself shows its work.

### F2 · Run book

One page each, written before launch: false FLASH · source outage · vendor (Firecrawl/Parallel) outage · traffic spike · full engine failure. Each names the symptom, the board's automatic honest state, and the desk's manual move.

### F3 · Running costs, named

Line items for the client's monthly budget (figures verified at contract): Vercel Pro · Neon Postgres · Upstash Redis · Firecrawl plan · Parallel plan · ESP · error monitoring · analytics · domain/DNS. The tiered ingestion design (§ B1) is what keeps this a utility bill instead of a payroll line; the Stage 2 cost-per-day gate proves it before launch.

### F4 · Timeline, honestly updated

The Control Room and the Reading Rule mechanics are real scope. The build moves from 8–10 weeks to **9–11 weeks**:

| Stage | Was | Now | Added |
|---|---|---|---|
| 1 · Design of the House | 2 wks | 2 wks | Mobile-first prototyping; quiet-house & big-night states; legend |
| 2 · The Engine | 2–3 wks | 3 wks | Tiered ingestion; replay harness (recorded sweeps re-run deterministically to tune scoring); cost-per-day gate |
| 3 · The Wire, Live | 2–3 wks | 3 wks | Reading Rule, While You Were Away, open-tab signals, multi-FLASH |
| 4 · The Full House | 2 wks | 2–3 wks | Control Room, methodology page, run book, growth wiring |

---

*Addendum v1.1 — reviewed before a line of code, which is when reviews are cheap.*
*One row back. Full view.*
