# The Second Row — design system & architecture (v3 "Front Page")

An independent news company. Live ranking product (**The Wire**) + a curated
**Front Page** + a desk ecosystem. Next.js App Router, TypeScript, no UI library.

## The two front doors
- **`/` — The Front Page.** A curated, multi-zone publication front: Lead
  package → live Wire module → Most Moved → Analysis/Opinion → Explainers →
  Investigations → Evidence → Track-record + Civic-Weather band → Join. The
  Wire is the *signature module*, not the whole page.
- **`/wire` — The Wire.** The full immersive board: Reading Rule, sweep clock,
  FLIP bumps, Pulse Rail, ticker. `components/Board.tsx` + `House.tsx` + `Rail.tsx`.

## Non-negotiable brand rules
- **Orange (`--orange` #ff5c02) is sacred: FLASH and nothing else.** Never use
  it for accents, ranks, hovers, links. (QC has caught this twice — keep watch.)
- **Three fonts only:** Fraunces (display/headlines), Inter (humans/UI),
  IBM Plex Mono (the machine: scores, tags, timestamps, labels).
- **The news is never paywalled;** depth/archive/history is. Tiers gate depth.
- **Show the work:** every rank exposes GRAVITY + "why it ranks"; the desk
  publishes its own misses (the Ledger). Trust is proven in the UI, not claimed.

## Taxonomy (one source of truth: `lib/desks.ts`)
- **Desks** (primary nav, bold Fraunces row): Top Stories, The Wire, Analysis,
  Explainers, Investigations, Documents.
- **Topics** (utility nav, mono chips, color-accented): Politics, Courts,
  Economy, Foreign, State, Health — each maps to real beats in `lib/sources.ts`
  and gets a section front at `/topic/[slug]`.
- **Content modes** (`.mode--*`): analysis, opinion, explainer, investigation,
  evidence, wire. Reporting ≠ analysis ≠ opinion — each has its own marker and,
  for analysis/opinion, a tinted card ground (`.deskcard--analysis/--opinion`).
- **Status** (existing): certainty CONFIRMED/REPORTED/DEVELOPING; tiers
  FLASH/BULLETIN/URGENT/DEVELOPING/BRIEF.

## Type scale (front page)
Display (`--display`, lead `<h1>` only) → section-lead (`.fp-sechead h2`) →
deskcard `h3` → stacked text headlines (`.stack .st-hed`) → mono meta/labels.
Real jumps between tiers — never uniform sizes.

## Color
Daylight (light, default) / Evening (dark) via `data-theme`. Tokens in
`:root`. Topic accents live in `lib/desks.ts` (flat label colors, never
gradients). `--pulse` (blue) = live/interactive/analysis; `--maroon-row` =
brand/opinion; `--verdict` (green) = hits/explainers; orange = FLASH only.

## Shape language
Pills/chips/capsules (`border-radius: 99px`) for all labels; `--radius`
(10px) for cards/modules. The row-and-dots mark (`components/Mark.tsx`) is the
only iconography.

## Components
- Front page zones: `components/fp/zones.tsx` (server, presentational) +
  `components/fp/WireSignature.tsx` (client, polls `/api/board` every 60s).
- Shared chrome: `components/SiteHeader.tsx` → `components/NavMenus.tsx`
  (two-tier). Banners in `app/layout.tsx` (Juneteenth, Toolkit).
- Data: `lib/store.ts` (Redis/memory), `lib/records.ts`, `lib/extras.ts`,
  `lib/sweep.ts` (the 60s loop), `lib/score.ts` (GRAVITY), `lib/civic.ts`.

## Conventions
- Server components fetch + pass props to presentational components; only the
  Wire module and interactive islands are `"use client"`.
- Every desk has a **sample/empty state** so the front page reads as composed
  pre-Redis (`DEMO_ASSIGNMENTS`, `SAMPLE_DOC`, primers, founder note).
- Build (`npm run build`) and `npx tsc --noEmit` must both be clean before ship.
- Mobile: nav rows scroll horizontally; `.fp-top`, `.fp-desks`, `.fp-band`
  collapse to one column; 16px inputs (no iOS zoom).

## QA checklist (run before every ship)
1. `npx tsc --noEmit` clean · `npm run build` green.
2. No orange anywhere except FLASH. Grep `--orange` usages.
3. Only the three fonts. No new `font-family`.
4. Front page renders fully with an empty database (sample fallbacks).
5. Every nav link resolves (desks + topics + account).
6. Hierarchy survives mobile stacking; nav understandable collapsed.
7. Reporting/analysis/opinion visually distinct; labels consistent.
8. Smoke test `/`, `/wire`, `/topic/politics`, a dossier, `/?sample=1`.
