# The Second Row — Design & Product Audit

**Reviewed by:** Brand & Product Design (acting newsroom design team)
**Scope:** Public-facing tsrmovement.com, design system, IA, brand coherence
**Verdict in one line:** *A genuinely original idea buried under a startup's worth of features, an unsettled brand, and a design system that has fragmented into fifteen card styles and a 1,586-line stylesheet. The concept is fundable; the execution is over-built and under-published.*

---

## Executive summary

The Second Row has a real, ownable idea — *rank the news by what carries weight, and show your work* — that most newsrooms would kill for. But the site currently fails the five-second test a first-time visitor applies, for three reasons we can measure:

1. **It does too much.** ~50 public destinations and 25+ separately-branded "products." A visitor cannot tell what TSR *is*.
2. **It hasn't published.** 32 files ship sample/demo/placeholder content. The trust machinery displays zeros and fixtures — which actively undermines the trust it's selling.
3. **The system has come apart.** 15 distinct card patterns, 6 section-header patterns, and a single CSS file of 1,586 lines assembled by appending overrides. This is not a design system; it's sediment.

None of this is fatal. All of it is fixable, and most of the fix is *subtraction*.

---

## CRITICAL — fix before any marketing push

### C1 · Product sprawl with no hierarchy of importance
The site offers, as co-equal destinations: the Wire, the Ledger, the Spin Room, the Toolkit, the Assignment Desk, Documents, the Rewind, the Third Act, Civic Weather, the Board Read, GRAVITY, the Tilt Meter, the Glass Desk, Judgment Seasons, Predictions Night, Classroom, the Glossary, the Action Center, Investigations, Dispatches, the Room, Trending, Editions, and more. That's a **decade of roadmap shipped as a launch.** A major newsroom ships *one* flagship and earns the rest. **Recommendation:** pick **two** front-door products (the brief says Ledger + Wire). Demote everything else into "Explore" — present, not promoted. A newsroom homepage should answer "what is this?" before "what are all the things it can do?"

### C2 · Proprietary-name overload (the jargon wall)
Nearly every feature has an insider name: the Pulse Rail, the Lobby, the Velvet Rope, House Lights, the Second Seat, Steelman Saturday, the Third Act, GRAVITY, the Glass Desk, Sealed Takes, the Founding 500. Inventing a private vocabulary is a power move *once you have an audience.* On day one it reads as a club a newcomer isn't in. **Recommendation:** keep 2–3 signature names (GRAVITY, the Ledger, the Glass Desk). Rename the rest to plain English ("the Lobby" → "More news," "the Velvet Rope" → it shouldn't exist now that everything's free).

### C3 · The empty-newsroom paradox
The entire brand promise is *accountability you can verify.* But the Ledger has no real scored calls, Investigations shows demo files, Dispatches is empty, and the Glass Desk shows `$0` and placeholder metrics. **A scoreboard with no games played doesn't build trust — it signals vaporware.** This is the single most damaging issue. **Recommendation:** do not launch the trust pages until there is a *real* track record, even a small one. Five honest, dated, scored calls beat fifty empty modules. Until then, those pages should say "starting [date]" rather than render zeros.

### C4 · Brand identity is visibly unsettled
The palette has changed (white + electric blue → warm bone + teal), yet the theme tokens are still named `daylight`/`evening` from the prior identity. Positioning has shifted (Wire-first → Ledger+Wire). The voice oscillates between "founded at 21" and "civic institution." **The seams show.** **Recommendation:** lock one brand statement, one palette, one voice, and one positioning sentence, and rename tokens to match. A news brand's credibility is partly its *consistency*; ours changes between sessions.

---

## HIGH — design system & information architecture

### H1 · There is no single card system — there are fifteen
Measured in the CSS: `.card`, `.deskcard`, `.campaign`, `.movedcard`, `.hubcard`, `.takecard`, `.rescard`, `.file`, `.ad-item`, `.band-card`, `.spin-col`, `.stack`, `.tier`, `.wiremod-row`, `.mo`. Each was added in a different build wave with its own radius, padding, border, and hover. The result is a page that feels *assembled* rather than *designed*. **Recommendation:** collapse to **one** card primitive with 3–4 documented variants (lead, standard, compact, data). Every other card becomes a variant or dies.

### H2 · The stylesheet is sediment, not a system
1,586 lines in one `globals.css`, grown by appending override blocks ("v2," "v3," "v4," "hardening," "rebrand") that fight earlier rules via cascade order. This is why the homepage **shipped visibly broken last week** (overlapping headlines) — fragile overrides are a structural risk, not a one-off bug. **Recommendation:** refactor into tokens + components (CSS modules or a documented layer order), delete dead rules, and reconcile the duplicated header/spacing patterns (6 section-header styles should be 1).

### H3 · IA redundancy and collisions
- **"Stories" and "The Wire" are the same destination** (both → `/wire`) under two names.
- `/documents` and `/document`, `/briefing` and `/today`, `/company` and `/about`, `/assignment-desk` and `/investigations` all overlap in purpose.
- **Two control rooms** (`/desk` and `/admin`) do similar jobs.
- Topics (12) and many desks are mostly empty on a normal news day.
**Recommendation:** one name per destination; merge the overlaps; retire `/desk` into `/admin`. Every nav label should map to exactly one clear thing.

### H4 · Choice overload in navigation
Between the section bar, the mega-menu, and the footer, the site exposes ~50 links. Even with the (good) decision to keep a clean top bar, the mega-menu lists everything flat. **Recommendation:** the expanded menu should lead with the 5–6 things that matter and tuck the long tail under a clearly-secondary "More." Hierarchy is an editorial act; right now the menu abdicates it.

---

## MEDIUM — craft, states, accessibility, performance

- **M1 · Art direction is thin.** Text-led is a defensible choice, but for a "broadcasting company" feel it currently reads flat. The generative cover images are a clever rights-safe patch, not art direction. Needs a real photography/illustration point of view, or a much more expressive typographic system, to feel premium.
- **M2 · Motion promises more than it delivers.** The Wire is sold as "alive," but the liveness is subtle (a pulse dot, a 60s poll). Either commit to a real, tasteful motion language for rank changes, or stop over-promising it in copy.
- **M3 · Accessibility is unaudited at scale.** Good foundations (keyboard, reduced-motion, labels) but the *new* warm palette's status colors (amber/plum/crimson on bone) have not been contrast-verified to WCAG AA across all surfaces and both themes. Needs a formal pass.
- **M4 · Performance surface.** 29 client components, per-minute polling, and a large single stylesheet. Not alarming, but uninterrogated. Needs a Lighthouse pass and a check that the heavy interactive board isn't loaded on pages that don't need it.
- **M5 · Empty/loading/error states are inconsistent.** Some pages have elegant sample fallbacks; others (search, topic fronts on a quiet day) can read as broken-empty rather than intentionally-empty.
- **M6 · Mobile is fixed in places, unproven across the whole.** The recent overlap fix and responsive passes were targeted; the *full* set of ~50 pages has not been walked at 360px.

---

## What is genuinely working (so we keep it)

- **The core thesis is strong and ownable.** "Rank by weight, show the work" is a real wedge against engagement-optimized feeds.
- **The trust DNA is the right instinct** — the Ledger, the published algorithm, the Glass Desk, the visible certainty labels. These are differentiators *once they have content.*
- **The reporting↔advocacy firewall** in the Action Center is handled with unusual maturity.
- **Accessibility and "free for everyone"** are correct, values-aligned defaults.
- **The breadth proves capability** — it's over-built, but it demonstrates the team can build. The task now is editing, not adding.

---

## Prioritized remediation (what we'd do, in order)

1. **Cut the surface area.** Choose 2 flagship products; demote the other ~20 into a single "Explore" area. (Biggest single win.)
2. **Don't launch empty trust pages.** Gate the Ledger/Glass Desk/Investigations behind real content, or label them "begins [date]."
3. **Lock the brand.** One palette, one voice, one positioning line; rename `daylight/evening` tokens.
4. **Rebuild the card + header system** into one primitive with variants; refactor the 1,586-line stylesheet into layers; delete dead CSS.
5. **De-dupe the IA.** One name per destination; merge Stories/Wire, the two control rooms, the doc routes.
6. **Thin the menu;** lead with 6, tuck the rest.
7. **Run the audits** — WCAG AA on the new palette, Lighthouse, and a 360px walk of all pages.
8. **Add an art-direction layer** — photography/illustration policy or a bolder type system — so it reads broadcast-grade, not template-grade.

*The honest summary: the problem isn't that TSR did too little. It's that it did too much, too fast, before it had a newsroom to fill it or a brand settled enough to hold it. The redesign that matters now is mostly an act of editing.*
