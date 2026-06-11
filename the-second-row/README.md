# THE SECOND ROW — The Wire

*One row back. Full view.*

A live civic news board that re-ranks itself every 60 seconds and **shows its work on every
rank**. The interface is the brand mark: the top story takes the Stage, every other story is a
row that recedes — wider and bolder near the stage, narrower and quieter toward the back of the
house. Orange appears for FLASH and for nothing else, ever.

Built with Next.js (App Router) for Vercel. **Zero required configuration** — it runs on free
RSS detection out of the box and gains a layer with each key you add.

---

## Launch on Vercel (5 minutes)

1. **Import the repo** at [vercel.com/new](https://vercel.com/new).
2. **Set Root Directory to `the-second-row`** (Project Settings → General → Root Directory).
   Framework preset: Next.js (auto-detected). Deploy.
3. That's it — the Wire is live, sweeping real feeds. Then, when ready, add layers:

| Add | Get |
|---|---|
| Upstash Redis (Vercel Marketplace → Storage) — env vars auto-attach | Persistent board, story biographies, sweep log, email list, desk overrides |
| `DESK_PASSWORD` | The Control Room at `/desk` — pin, force-tier, kill, confirm/stand-down FLASH |
| `FIRECRAWL_API_KEY` | Clean excerpts for top-of-house stories |
| `PARALLEL_API_KEY` | Web corroboration counts for stories in motion |
| `ANTHROPIC_API_KEY` | LLM triage: normalized headlines + civic-gravity scoring |
| Per-minute cron (Pro plan — see below) | Sweeps even with zero readers |

All env vars are documented in [.env.example](.env.example).

### Per-minute cron (optional, Vercel Pro)

Without cron the board **self-sweeps from traffic**: any request that finds the board older
than 60s runs the sweep under a lock, so one reader keeps it live for everyone. On a Pro plan,
add to `vercel.json` to make it tireless:

```json
"crons": [{ "path": "/api/sweep", "schedule": "* * * * *" }]
```

Set `CRON_SECRET` in env to protect the endpoint (Vercel sends it automatically).

---

## What's inside

| Piece | Where |
|---|---|
| **The Wire** (the House: Stage + receding rows, ink that cools, sweep clock, Reading Rule, While-You-Were-Away, FLASH protocol, Ticker drawer, desk keys J/K/T/H/`.`/?) | `/` · `components/Board.tsx`, `components/House.tsx` |
| **The engine** (60s loop: detect → resolve → triage → seat → publish; hysteresis, bump budget, owner-counted corroboration) | `lib/sweep.ts`, `lib/score.ts`, `lib/cluster.ts`, `lib/rss.ts` |
| **Enrichment** (Firecrawl / Parallel / Claude triage — optional, budgeted, non-fatal, injection-hardened) | `lib/enrich.ts` |
| **The roster + beats** (the desk edits these — sources, owners, weights, charter) | `lib/sources.ts` |
| **The Control Room** (every intervention disclosed in the story's public biography) | `/desk` |
| **Story biographies** (every rank a story held, logged — no quiet edits) | `/wire/[id]` |
| **The rooms** (Briefing, Spin Room, Ledger, The Seat, Method, Standards) | `/briefing` `/spin` `/ledger` `/about` `/method` `/standards` |

### Design-review mode

`/?sample=1` renders a watermarked **sample board** with fictional headlines across every tier —
including a FLASH, so the full protocol (house lights dim, orange takes the stage, clock turns)
can be reviewed on demand. The same board serves automatically if the wire is unreachable and
the engine has no memory, clearly labeled.

### Honesty under failure

- A late sweep says so on the page: `LAST SWEEP 4 MIN AGO — RETRYING`.
- Dead sources are noted in the sweep log; the sweep continues on the rest.
- No database? The board still runs; biographies are short-lived and the masthead never pretends otherwise.

## Local development

```bash
cd the-second-row
npm install
npm run dev   # http://localhost:3000   (/?sample=1 for the design-review board)
```

## The desk owns

- `lib/sources.ts` — the roster (add/remove/re-weight sources; owners power corroboration) and the beats charter.
- `lib/score.ts` — thresholds, weights, hysteresis. Bump `METHOD_VERSION` and the `/method` changelog when you change them: the algorithm keeps a ledger of itself.
- `app/api/subscribe/route.ts` — swap in your ESP when the briefing email launches.
