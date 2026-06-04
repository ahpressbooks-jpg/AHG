# ALMOST HUMAN GROUP — WEBSITE DESIGN MAP

**Version 3.0 | Based on AHG Website Bible v3**
**"The next generation can't wait."**

---

## GLOBAL DESIGN SYSTEM

### Color Palette

| Token          | Hex       | Role        | Usage                                                          |
|----------------|-----------|-------------|----------------------------------------------------------------|
| AHG Red        | `#CC0000` | Action      | CTAs, accent lines, section markers, program codes, urgent data |
| Movement Black | `#0A0A0A` | Foundation  | Hero backgrounds, dominant surfaces                            |
| Off-White      | `#F4F4F4` | Relief      | Card backgrounds, light sections, breathing room               |
| Pure White     | `#FFFFFF` | Text/bg     | Body copy on dark, clean page backgrounds                      |
| Mid Gray       | `#888888` | Secondary   | Metadata, dates, labels, captions — never primary messaging    |

### Typography

| Role       | Font          | Usage                                                                 |
|------------|---------------|-----------------------------------------------------------------------|
| Display    | Bebas Neue    | Hero headlines, section titles, program names. Never below 28px. All-caps. |
| Body       | DM Sans       | All body copy, nav, buttons, captions. Weights: 300/400/500/700       |
| Monospace  | Space Mono    | Labels, codes, section IDs, 501(c)(4) designation. Max 10% of page   |

### Spacing & Grid

- **Base unit:** 8dp rhythm
- **Minimum tap target:** 48px
- **Mobile-first breakpoint:** 390px viewport, scales up
- **Max content width:** ~1200px centered
- **Section padding:** 80px–120px vertical (desktop), 48px–64px (mobile)

### Global Components

#### Sticky Navigation Bar
```
┌──────────────────────────────────────────────────────────────────────┐
│  ALMOST HUMAN GROUP            About  Programs▾  Policy             │
│  [wordmark, Bebas Neue]        Membership  Get Involved  Contact    │
│                                          ┌──────────────────────┐   │
│                                          │ JOIN THE MOVEMENT    │   │
│                                          │ #CC0000 bg, white txt│   │
│                                          └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```
- Sticky on scroll, every page
- Programs dropdown: BRIDGE / SEAT / LAUNCH / FLOOR
- Mobile: hamburger menu, but JOIN THE MOVEMENT button stays visible outside menu
- Wordmark: "ALMOST HUMAN GROUP" in Bebas Neue. "HUMAN" in #CC0000

#### Footer — Five Columns
```
┌──────────────────────────────────────────────────────────────────────┐
│  Organization    Programs    Policy           Join          Connect  │
│  About           BRIDGE      The Three        Membership    IG      │
│  Mission         SEAT        Pillars          Volunteer     FB      │
│  The Founder     LAUNCH      Policy Agenda    Partner       Contact │
│  Board           FLOOR       Accountability   Donate        Press   │
├──────────────────────────────────────────────────────────────────────┤
│  (c) 2026 Almost Human Group · 501(c)(4) Social Welfare Org        │
│  · Privacy Policy · almosthumangroup.org                           │
│  Not affiliated with any political party or campaign.              │
│  Contributions are not tax-deductible as charitable contributions. │
└──────────────────────────────────────────────────────────────────────┘
```

---

## SITEMAP & PAGE HIERARCHY

```
/                         Homepage
/about                    About AHG
/programs                 Programs Overview
  /programs/bridge        BRIDGE (Ages 14–18)
  /programs/seat          SEAT (Ages 16–24)
  /programs/launch        LAUNCH (Ages 18–26)
  /programs/floor         FLOOR (Ages 18–26, Competitive)
/policy                   Policy & Advocacy
/membership               Join the Movement
/get-involved             Volunteer · Partner · Speak
/contact                  Contact & Press
/founding-members         Pre-Launch Founding Member Campaign
/newsletter               Email Signup
/press                    Press Kit & Media
```

**Total pages: 13**

---

## PAGE-BY-PAGE DESIGN MAP

---

### 1. HOMEPAGE — `/`

**Purpose:** Emotional entry point. Understanding AHG → Taking action. Dark, high-contrast, photography-driven.

#### Section 1: Hero
```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    [FULL-BLEED HERO PHOTO]                    │  │
│  │                                                                │  │
│  │  Photo: A young person standing at a podium in a school       │  │
│  │  board chamber or legislative hearing room, mid-testimony.    │  │
│  │  Shot from behind/side — they face the decision-makers.       │  │
│  │  High contrast, dramatic light. Grain OK.                     │  │
│  │  Dark overlay gradient (60-70% opacity) for text legibility.  │  │
│  │                                                                │  │
│  │         "They've been deciding your                           │  │
│  │          future without you."                                 │  │
│  │          [Bebas Neue, 120px+, white, red accent ONE phrase]   │  │
│  │                                                                │  │
│  │         Almost Human Group fights for every young person      │  │
│  │         whose future is being decided in rooms they were      │  │
│  │         never invited into.                                   │  │
│  │         [DM Sans 400, 18–20px, white]                        │  │
│  │                                                                │  │
│  │         ┌─────────────────┐  ┌──────────────────────┐        │  │
│  │         │ JOIN THE        │  │ SEE WHAT WE          │        │  │
│  │         │ MOVEMENT        │  │ FIGHT FOR            │        │  │
│  │         │ [#CC0000 solid] │  │ [white outline]      │        │  │
│  │         └─────────────────┘  └──────────────────────┘        │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```
- Full viewport height (100vh)
- Full-bleed background photo with dark gradient overlay
- Photo direction: young person testifying, presenting, or standing in a real institutional room
- Two CTA buttons below headline
- Subheadline in DM Sans 400, white, 18–20px

#### Section 2: The Evidence (Statistics)
```
┌──────────────────────────────────────────────────────────────────────┐
│  "These are not statistics. They are children. In Texas. Right now."│
│  [DM Sans 500, Off-White]                                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│  │  [B&W PHOTO] │  │  [B&W PHOTO] │  │  [B&W PHOTO] │  │[B&W    │ │
│  │  empty desk  │  │  graduation  │  │  bus stop     │  │PHOTO]  │ │
│  │  in school   │  │  cap on      │  │  bench at     │  │job app │ │
│  │  hallway     │  │  ground      │  │  night        │  │in hand │ │
│  │──────────────│  │──────────────│  │──────────────│  │────────│ │
│  │   38,000+    │  │    1.5%      │  │     46%      │  │  50%   │ │
│  │  [#CC0000    │  │  [#CC0000    │  │  [#CC0000    │  │[#CC0000│ │
│  │   large num] │  │   large num] │  │   large num] │  │ lg num]│ │
│  │              │  │              │  │              │  │        │ │
│  │  children in │  │  earn a      │  │  experience  │  │unemploy│ │
│  │  TX foster   │  │  college     │  │  homelessness│  │-ed at  │ │
│  │  care today  │  │  degree by 24│  │  before 26   │  │24      │ │
│  │  [#888 text] │  │  [#888 text] │  │  [#888 text] │  │[#888]  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────┘ │
│                                                                     │
│  Dark background. Each stat card topped with a small B&W photo.    │
│  Mobile: 2x2 grid (NOT single column).                             │
└──────────────────────────────────────────────────────────────────────┘
```
- Presented like evidence, not selling points — "prosecutor style"
- Each stat card includes a small, square B&W documentary photo above the number
- Photos: real environments that represent each stat — not faces, not hope, just reality
- Large red numerals remain the dominant visual element

#### Section 3: What We Are (Identity Statement)
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │                     │  │                                     │  │
│  │  [PHOTO: crowd at   │  │  Not a Charity. A Movement.        │  │
│  │   a rally or town   │  │  [Bebas Neue, large, white]        │  │
│  │   hall — young      │  │                                     │  │
│  │   people standing,  │  │  AHG is organized, structured,     │  │
│  │   arms crossed or   │  │  funded, and built to outlast the   │  │
│  │   leaning forward,  │  │  resistance. We use the same legal  │  │
│  │   watching closely. │  │  structure as the NAACP and the     │  │
│  │   High contrast.    │  │  ACLU because the fight the next    │  │
│  │   Not smiling at    │  │  generation is in requires it...    │  │
│  │   camera. Focused.] │  │                                     │  │
│  │                     │  │  We serve every young person from   │  │
│  │  [Full height of    │  │  a high school freshman to age 26.  │  │
│  │   the column]       │  │                                     │  │
│  │                     │  │  We go wherever the fight is.       │  │
│  └─────────────────────┘  └─────────────────────────────────────┘  │
│                                                                     │
│  Two-column: photo left, copy right. Mobile: photo stacks on top.  │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 4: Three Pillars
```
┌──────────────────────────────────────────────────────────────────────┐
│  Dark background. Three cards with photo headers + red numbers.    │
│                                                                     │
│  ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐  │
│  │ [PHOTO: classroom │ │ [PHOTO: state     │ │ [PHOTO: young    │  │
│  │  from the back —  │ │  capitol rotunda  │ │  person seated   │  │
│  │  rows of desks,   │ │  or hearing room  │ │  at a boardroom  │  │
│  │  fluorescent      │ │  — empty witness  │ │  table among     │  │
│  │  lights, one      │ │  chairs, dramatic │ │  adults, leaning │  │
│  │  student looking  │ │  architecture]    │ │  forward]        │  │
│  │  out window]      │ │                   │ │                  │  │
│  │───────────────────│ │───────────────────│ │──────────────────│  │
│  │ 01                │ │ 02                │ │ 03               │  │
│  │ [#CC0000, large]  │ │ [#CC0000, large]  │ │ [#CC0000, large] │  │
│  │                   │ │                   │ │                  │  │
│  │ Education Beyond  │ │ Policy That       │ │ Representation   │  │
│  │ the Classroom     │ │ Protects the      │ │                  │  │
│  │                   │ │ Future            │ │                  │  │
│  │ Schools design    │ │ Mental health.    │ │ Young people are │  │
│  │ for compliance... │ │ Housing. Juvenile │ │ the subject of   │  │
│  │                   │ │ justice...        │ │ almost every...  │  │
│  │                   │ │                   │ │                  │  │
│  │ LEARN MORE →      │ │ SEE THE AGENDA →  │ │ OUR PROGRAMS →   │  │
│  └───────────────────┘ └───────────────────┘ └──────────────────┘  │
│                                                                     │
│  Each card: photo top half, content bottom half.                   │
│  Photos have subtle red tint overlay or desaturated treatment.     │
│  One link per card. No competing CTAs.                             │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 5: Programs
```
┌──────────────────────────────────────────────────────────────────────┐
│  "Four Programs. One Fight."                                       │
│  [Bebas Neue, section headline]                                    │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ [PHOTO:      │ │ [PHOTO:      │ │ [PHOTO:      │ │ [PHOTO:   │ │
│  │  students in │ │  young person │ │  young adult │ │ fellow    │ │
│  │  a workshop, │ │  at city     │ │  in profess- │ │ walking   │ │
│  │  working on  │ │  council     │ │  ional       │ │ into a    │ │
│  │  research    │ │  meeting,    │ │  setting,    │ │ capitol   │ │
│  │  together]   │ │  speaking]   │ │  interview]  │ │ building] │ │
│  │──────────────│ │──────────────│ │──────────────│ │───────────│ │
│  │ BRIDGE       │ │ SEAT         │ │ LAUNCH       │ │ FLOOR     │ │
│  │ [Space Mono  │ │ [Space Mono  │ │ [Space Mono  │ │ [Space    │ │
│  │  #CC0000]    │ │  #CC0000]    │ │  #CC0000]    │ │  Mono]    │ │
│  │ Ages 14–18   │ │ Ages 16–24   │ │ Ages 18–26   │ │ Ages      │ │
│  │              │ │              │ │              │ │ 18–26     │ │
│  │ Students     │ │ Civic        │ │ Workforce &  │ │ Flagship  │ │
│  │ learn to ID  │ │ leadership   │ │ economic     │ │ fellowship│ │
│  │ a problem... │ │ training...  │ │ empowerment..│ │ in govt...│ │
│  │              │ │              │ │              │ │           │ │
│  │ LEARN MORE → │ │ LEARN MORE → │ │ LEARN MORE → │ │ LEARN     │ │
│  │              │ │              │ │              │ │ MORE →    │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘ │
│                                                                     │
│  EXPLORE ALL PROGRAMS → /programs                                  │
│  Each card: photo top, content bottom. Photos show the program's   │
│  environment — classrooms, council chambers, offices, capitols.    │
│  Mobile: single-column stacked cards.                              │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 6: The Origin ("The Hallway")
```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   [FULL-BLEED B&W PHOTO]                      │  │
│  │                                                                │  │
│  │  Photo: An empty school hallway. Fluorescent lights. Lockers. │  │
│  │  One figure at the far end, silhouetted, walking away or      │  │
│  │  standing still. B&W. High grain. Documentary feel.           │  │
│  │  Dark overlay gradient for text legibility (70-80%).          │  │
│  │                                                                │  │
│  │  The Hallway.                                                 │  │
│  │  [Bebas Neue, small/quiet — headline is understated here]     │  │
│  │                                                                │  │
│  │  AHG exists because too many people in this country are       │  │
│  │  treated as almost human. Almost old enough to matter.        │  │
│  │  Almost ready to have a voice. Almost worth designing a       │  │
│  │  system around.                                               │  │
│  │                                                                │  │
│  │  Our founder grew up inside those systems. He was moved,      │  │
│  │  assessed, categorized, and processed. Not developed...       │  │
│  │                                                                │  │
│  │  He was not fine.                                             │  │
│  │                                                                │  │
│  │  ...That's who we build for.                                  │  │
│  │                                                                │  │
│  │  READ THE FULL STORY → /about                                 │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  EMOTIONAL CENTER OF HOMEPAGE. The photo reinforces — not           │
│  competes. Text is still king. Do not sanitize. Every line stays.  │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 7: Membership Conversion
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────┐  ┌────────────────────────────────────┐  │
│  │                       │  │                                    │  │
│  │  [PHOTO: a group of   │  │  "The Movement Needs You Before   │  │
│  │   young people in a   │  │   It Needs Anyone Else."          │  │
│  │   meeting room,       │  │  [Bebas Neue]                     │  │
│  │   planning, building, │  │                                    │  │
│  │   whiteboard behind   │  │  Become a Founding Member.        │  │
│  │   them covered in     │  │  $10/month. Your name in the      │  │
│  │   notes and strategy. │  │  first annual report. You were    │  │
│  │   Shot from the side, │  │  here before it was finished.     │  │
│  │   candid, focused.    │  │                                    │  │
│  │   Color — warm tones] │  │  ┌────────────────────────────┐   │  │
│  │                       │  │  │ BECOME A FOUNDING MEMBER   │   │  │
│  │                       │  │  │ [#CC0000 bg, white text]   │   │  │
│  │                       │  │  └────────────────────────────┘   │  │
│  │                       │  │  → /membership                    │  │
│  └───────────────────────┘  └────────────────────────────────────┘  │
│                                                                     │
│  Two-column: photo left, copy + CTA right.                         │
│  Framing: exclusivity, not charity. "You were here before it       │
│  was finished." Do NOT list tier benefits here.                     │
│  Mobile: photo stacks on top of copy.                              │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 8: Footer CTA
```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    [FULL-BLEED PHOTO]                          │  │
│  │                                                                │  │
│  │  Photo: A wide shot of young people marching, walking into    │  │
│  │  a building, or gathered on steps of a civic building.        │  │
│  │  Shot from behind — they face forward, toward the building.   │  │
│  │  Color or B&W. Red-tinted overlay for brand consistency.      │  │
│  │                                                                │  │
│  │  "The Next Generation Can't Wait."                            │  │
│  │  [Bebas Neue, large, white]                                   │  │
│  │                                                                │  │
│  │  Join AHG. Tell someone who needs to know we exist.           │  │
│  │  Show up for the fight.                                       │  │
│  │                                                                │  │
│  │  ┌─────────────────────┐                                      │  │
│  │  │ JOIN THE MOVEMENT   │                                      │  │
│  │  │ [#CC0000]           │                                      │  │
│  │  └─────────────────────┘                                      │  │
│  │  → /membership                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

→ Then the five-column footer (global component)

---

### 2. ABOUT PAGE — `/about`

**Purpose:** Full emotional story + organizational credibility. The page that converts skeptics into believers.

```
SECTION FLOW:
┌─────────────────────────────────────────────────────────┐
│ 1. Hero — "We Got Tired of Almost."                     │
│    [Bebas Neue, large]                                  │
│    PHOTO: Full-bleed B&W — wide shot of an empty        │
│    courtroom, legislative chamber, or school board       │
│    room. Chairs empty. One person standing at the        │
│    podium. Dark overlay for text.                        │
├─────────────────────────────────────────────────────────┤
│ 2. Opening — Two paragraphs + side photo                │
│    Copy left, photo right.                              │
│    PHOTO: Close-up portrait, high-contrast — young      │
│    person looking directly at camera. Not smiling.      │
│    Carrying weight. Face that tells a story.            │
├─────────────────────────────────────────────────────────┤
│ 3. The Origin — Founder Story                           │
│    CRITICAL: Full emotional weight.                     │
│    Do not sanitize. Do not put in callout box.          │
│    Let it breathe.                                      │
│    PHOTO: Documentary-style photo of Noah Dean.         │
│    Candid — speaking, thinking, building. Not posed.    │
│    Placed alongside the story, not above it. The text   │
│    still leads. B&W or desaturated color.               │
│    Pull quote: "Children are not at the will of the     │
│    education system..."                                 │
├─────────────────────────────────────────────────────────┤
│ 4. Mission Statement                                    │
│    Full-width dark band with text centered.             │
│    PHOTO: Subtle background — blurred crowd in motion   │
│    behind the text, very low opacity (15-20%).          │
├─────────────────────────────────────────────────────────┤
│ 5. Legal Structure                                      │
│    PHOTO: B&W of a government building exterior —       │
│    columns, steps, weight. Institutional but reclaimed. │
│    Photo half-width, copy beside it.                    │
├─────────────────────────────────────────────────────────┤
│ 6. Values — Five value blocks with photo accents        │
│    - Proximity over distance                            │
│      [inline photo: hands, community, closeness]        │
│    - Certainty over comfort                             │
│      [inline photo: someone mid-speech, certain]        │
│    - Structure over symbolism                           │
│      [inline photo: real boardroom seat, not ribbon]    │
│    - Urgency without panic                              │
│      [inline photo: people moving with purpose]         │
│    - Accountability by name                             │
│      [inline photo: press conference or public hearing] │
│    Values alternate: photo-left/copy-right, then flip.  │
├─────────────────────────────────────────────────────────┤
│ 7. Texas Data Block                                     │
│    Same as homepage stats but with a full-width         │
│    B&W background photo behind (low opacity) —          │
│    an institutional building, school exterior at dusk.   │
│    38,000+ / 1.5% / 46% / 50%                         │
├─────────────────────────────────────────────────────────┤
│ 8. CTA with background photo → JOIN THE MOVEMENT        │
│    PHOTO: Group walking forward, shot from behind.      │
└─────────────────────────────────────────────────────────┘
```

**Design notes:**
- Photography-rich long-form page — every section has visual weight
- Dark hero, alternating dark/off-white sections
- The founder story section gets maximum vertical space — no compression
- Values displayed as alternating two-column (photo/copy flip each row)
- Photos never compete with copy — they reinforce it

---

### 3. PROGRAMS OVERVIEW — `/programs`

**Purpose:** Navigation hub to four individual program pages.

```
┌─────────────────────────────────────────────────────────────────┐
│ Hero: "Four Programs. One Fight."                               │
│ [Bebas Neue, dark bg]                                          │
│ PHOTO: Full-bleed — a wide-angle shot of young people in a     │
│ real working environment (workshop, meeting, hearing). Movement │
│ and purpose. Dark overlay for headline legibility.              │
├─────────────────────────────────────────────────────────────────┤
│ Intro: "Every AHG program exists for the same reason..."       │
├─────────────────────────────────────────────────────────────────┤
│ Four program cards — landscape layout, alternating:             │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [PHOTO: Students in a workshop,   │ BRIDGE                 │ │
│ │  building research presentations, │ Breaking Rules In      │ │
│ │  around a table with data and     │ Decisions that Govern   │ │
│ │  laptops. Real. Focused.]         │ Education              │ │
│ │                                   │ Ages 14–18 · H.S.     │ │
│ │                                   │ [expanded description] │ │
│ │                                   │ LEARN MORE →           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SEAT                            │ [PHOTO: Young person at  │ │
│ │ Students Earning A Table        │  a council table, among  │ │
│ │ Ages 16–24                      │  adults, leaning in.     │ │
│ │ [expanded description]          │  Not decorative — they   │ │
│ │ LEARN MORE →                    │  belong there.]          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [Same alternating pattern for LAUNCH and FLOOR]                 │
│ Photo side flips: left, right, left, right.                     │
│ Mobile: photo stacks above copy in all cards.                   │
├─────────────────────────────────────────────────────────────────┤
│ CTA: JOIN THE MOVEMENT → /membership                            │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. INDIVIDUAL PROGRAM PAGES — `/programs/bridge`, `/seat`, `/launch`, `/floor`

**Shared structure for each:**

```
┌──────────────────────────────────────────────────────────────────┐
│ Hero: Full-bleed program-specific photo with dark overlay        │
│       Program code [Space Mono, #CC0000]                        │
│       Full name [Bebas Neue, white]                             │
│       Age range · Pull quote                                    │
│                                                                  │
│   BRIDGE hero photo: Students at a school board podium          │
│   SEAT hero photo: Young person taking an oath or being sworn   │
│     in to a civic position                                      │
│   LAUNCH hero photo: Young adult in a professional setting —    │
│     interview, office, first day                                │
│   FLOOR hero photo: Fellow walking through capitol corridors,   │
│     badge visible, purpose in stride                            │
├──────────────────────────────────────────────────────────────────┤
│ THE PROBLEM                                                      │
│ [2-3 paragraphs + side photo]                                    │
│ PHOTO: Documentary shot representing the failure —               │
│   BRIDGE: empty student council room, dusty suggestion box      │
│   SEAT: council chamber with no young faces                     │
│   LAUNCH: "help wanted" signs, bus stop, closed-door offices    │
│   FLOOR: government hallway — suits, no young people            │
├──────────────────────────────────────────────────────────────────┤
│ WHAT [PROGRAM] IS                                                │
│ [Program description + inline photos of the program in action]  │
│ PHOTO: Students/fellows DOING the work — presenting, meeting,   │
│   writing, debating. 2-3 candid photos throughout this section. │
├──────────────────────────────────────────────────────────────────┤
│ PROGRAM STRUCTURE                                                │
│ [Phases/structure with photo accent per phase]                   │
│ BRIDGE: 6-phase timeline, small photo per phase                 │
│ SEAT: 8-week cohort, group photo + session photos               │
│ LAUNCH: 6-week curriculum, workshop environment photos          │
│ FLOOR: Placement photos — fellow at desk, in hearing, writing   │
├──────────────────────────────────────────────────────────────────┤
│ PHOTO BANNER: Full-width candid group shot of program           │
│   participants — not posed, not smiling at camera. Working.     │
├──────────────────────────────────────────────────────────────────┤
│ CTA: JOIN THE MOVEMENT / GET INVOLVED                            │
└──────────────────────────────────────────────────────────────────┘
```

**Program-specific design elements:**
- **BRIDGE:** Six-phase visual timeline/stepper with thumbnail photos per phase. Hero: students at podium.
- **SEAT:** Eight-week cohort structure with session photos. Hero: civic swearing-in moment.
- **LAUNCH:** Six-week curriculum blocks with workshop photos. Hero: professional environment.
- **FLOOR:** Competitive selection callout (8–12 fellows) with capitol corridor photos. Hero: fellow in stride.
- **All programs:** Full-width candid group photo banner before the CTA section.

---

### 5. POLICY PAGE — `/policy`

**Purpose:** AHG's six-issue advocacy agenda. Accountability language. No hedging.

```
┌──────────────────────────────────────────────────────────────────┐
│ Hero: "AHG Does Not React to Policy. AHG Drives It."            │
│ [Bebas Neue, dark bg]                                           │
│ PHOTO: Full-bleed — Texas State Capitol rotunda, shot from      │
│ below looking up, or a hearing room mid-session. Power and      │
│ architecture. Dark overlay for text.                             │
│                                                                  │
│ Subheadline: "Six fights. Every young person between 14 and 26. │
│ DFW today. The nation by Year 3."                               │
├──────────────────────────────────────────────────────────────────┤
│ Six issue blocks — alternating photo/copy layout:                │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [PHOTO: School counselor's  │ 01 Mental Health            │   │
│ │  office door, closed,       │ Infrastructure in Schools   │   │
│ │  waiting area empty]        │ [Position + stance line]    │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ 02 Education System         │ [PHOTO: Classroom clock,    │   │
│ │ Redesign                    │  bell schedule on wall,     │   │
│ │ [Position + stance line]    │  institutional design]      │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [PHOTO: Apartment door,     │ 03 Foster Care Transition   │   │
│ │  key in lock, single bag    │ Reform                      │   │
│ │  on doorstep — aging out]   │ [Position + stance line]    │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ 04 Juvenile Justice — PHOTO: courthouse hallway, metal detector  │
│ 05 Youth Representation — PHOTO: empty chair at board table     │
│ 06 Housing Access — PHOTO: apartment complex at dusk, DFW       │
│                                                                  │
│ Photo/copy sides alternate: L/R, R/L, L/R, R/L, L/R, R/L       │
│ Each photo: documentary, no people smiling, environments only   │
│ or single figures with weight. Desaturated or B&W encouraged.   │
├──────────────────────────────────────────────────────────────────┤
│ CTA with background photo: JOIN THE MOVEMENT → /membership       │
│ PHOTO: Young people entering a civic building together.          │
└──────────────────────────────────────────────────────────────────┘
```

**Design notes:**
- Numbered issues with prominent red numbers
- Alternating photo/copy layout gives each issue visual identity
- Photos are environmental/documentary — they represent the system, not the solution
- Bold position lines formatted distinctly (larger type or red accent)
- No softening language — the design reinforces the directness

---

### 6. MEMBERSHIP PAGE — `/membership`

**Purpose:** Conversion. Five tiers presented with escalating commitment and clear value.

```
┌──────────────────────────────────────────────────────────────────┐
│ PRE-LAUNCH BANNER (top of page):                                 │
│ "AHG IS PRE-LAUNCH. We are filing. We are building.            │
│  We are not waiting."                                           │
│ [Red bar, white text, prominent]                                │
├──────────────────────────────────────────────────────────────────┤
│ Hero: "The Movement Needs Members Who Mean It."                  │
│ PHOTO: Full-bleed — crowd at an AHG event or community          │
│ gathering, shot from stage perspective looking out at faces.     │
│ High contrast. Dramatic light. Dark overlay for text.            │
│                                                                  │
│ Subheadline: "Members are not supporters. Members are not        │
│ donors. Members are the movement..."                            │
├──────────────────────────────────────────────────────────────────┤
│ FIVE TIER CARDS:                            │
│                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐ ┌─────┐ │
│ │ALLY  │ │ADVOC │ │CHAMP │ │INST│ │FOUND│ │
│ │$10/mo│ │$25/mo│ │$75/mo│ │$250│ │$1000│ │
│ │      │ │      │ │      │ │/mo │ │/mo  │ │
│ │• Card│ │+All  │ │+All  │ │+All│ │+All │ │
│ │• News│ │• Brf │ │• CEO │ │•5  │ │•Name│ │
│ │• Lib │ │• Comm│ │• Rnd │ │stf │ │•Advs│ │
│ │• Evt │ │• Town│ │• Stg │ │•Co │ │•Dnnr│ │
│ │• Name│ │• Disc│ │• 1:1 │ │•Dir│ │•Camp│ │
│ │      │ │• Bdg │ │      │ │•Pol│ │•Rsch│ │
│ │      │ │      │ │      │ │    │ │•Summ│ │
│ │ CTA  │ │ CTA  │ │ CTA  │ │CTA │ │ CTA │ │
│ └──────┘ └──────┘ └──────┘ └────┘ └─────┘ │
│                                             │
│ Each tier: Name, price (monthly + annual),  │
│ target audience description, benefit list,  │
│ single red CTA button                       │
│                                             │
│ On mobile: single-column stacked cards      │
│ Most popular/recommended tier highlighted   │
├─────────────────────────────────────────────┤
│ "Why Membership Matters" — closing copy     │
│ 501(c)(4) disclaimer above payment form     │
├─────────────────────────────────────────────┤
│ CTA: Final conversion push                  │
└─────────────────────────────────────────────┘
```

**Tier details:**
| Tier | Price | Audience |
|------|-------|----------|
| ALLY | $10/mo or $100/yr | Individual believers, educators, parents, young people |
| ADVOCATE | $25/mo or $250/yr | Professionals, educators, community leaders |
| CHAMPION | $75/mo or $750/yr | High-commitment individuals and small orgs |
| INSTITUTIONAL PARTNER | $250/mo or $2,500/yr | Nonprofits, school districts, foundations |
| FOUNDING MEMBER | $1,000/mo or $10,000/yr | Inner circle, pre-launch builders |

---

### 7. GET INVOLVED PAGE — `/get-involved`

**Purpose:** Non-monetary ways to contribute. Skills, time, platform.

```
┌──────────────────────────────────────────────────────────────────┐
│ Hero: "The Fight Needs More Than Money."                         │
│ PHOTO: Full-bleed — people setting up an event space, building  │
│ something together, hands-on work. Candid, not posed.           │
│ Dark overlay for text.                                          │
│                                                                  │
│ Sub: "It needs people. People with skills, relationships,       │
│ time, platforms, and proximity to the next generation."          │
├──────────────────────────────────────────────────────────────────┤
│ Four involvement blocks — each with photo:                       │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [PHOTO: Volunteer in an AHG │ VOLUNTEER                   │   │
│ │  shirt organizing materials, │ Program facilitation,       │   │
│ │  setting up chairs, or       │ community outreach, events  │   │
│ │  helping at a workshop]      │ APPLY TO VOLUNTEER → [form] │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ CORPORATE PARTNERSHIP        │ [PHOTO: Handshake at a     │   │
│ │ Public alignment with the    │  conference table, or       │   │
│ │ movement. Three tiers from   │  co-branded event signage]  │   │
│ │ $5,000/year.                 │                             │   │
│ │ VIEW OPTIONS → [link]        │                             │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [PHOTO: Speaker at a podium  │ SPEAK AT AHG              │   │
│ │  or panel, audience visible, │ Educators, advocates,      │   │
│ │  real event setting]         │ young leaders, officials   │   │
│ │                              │ SUBMIT INQUIRY → [form]    │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ SPREAD THE WORD              │ [PHOTO: Phone screen       │   │
│ │ Follow on IG + FB. Share     │  showing AHG social post,  │   │
│ │ with one person. Tell your   │  or someone sharing on     │   │
│ │ school/org/community.        │  their phone in real life] │   │
│ │ [Social links]               │                             │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Photo/copy sides alternate: L/R, R/L, L/R, R/L                  │
│ Mobile: photo stacks above copy in all blocks.                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8. CONTACT PAGE — `/contact`

**Purpose:** Routed inquiries. Three email destinations + structured form.

```
┌──────────────────────────────────────────────────────────────────┐
│ Hero: "Get in the Room."                                        │
│ [Bebas Neue, dark bg]                                          │
│ PHOTO: Full-bleed — an open door into a real room where         │
│ decisions happen: hearing room, office, boardroom.              │
│ Shot from outside looking in. Light pours through the door.    │
│ Dark overlay for headline. B&W or high-contrast color.          │
├──────────────────────────────────────────────────────────────────┤
│ Two-column layout:                                              │
│                                                                  │
│ ┌──────────────────────┐  ┌──────────────────────────────────┐  │
│ │                      │  │ CONTACT FORM:                    │  │
│ │  [PHOTO: Team at     │  │                                  │  │
│ │   work — real AHG    │  │ Name       [________________]    │  │
│ │   office or meeting  │  │ Email      [________________]    │  │
│ │   space. Candid.]    │  │ Org        [________________]    │  │
│ │                      │  │ Subject    [▾ dropdown      ]    │  │
│ │  Three channels:     │  │ Message    [________________]    │  │
│ │                      │  │            [________________]    │  │
│ │  General:            │  │                                  │  │
│ │  hello@ahg.org       │  │ ┌────────────────┐              │  │
│ │                      │  │ │    SEND IT     │              │  │
│ │  Press:              │  │ │  [#CC0000]     │              │  │
│ │  press@ahg.org       │  │ └────────────────┘              │  │
│ │                      │  │                                  │  │
│ │  Programs:           │  │ Min 48px tap targets on inputs   │  │
│ │  programs@ahg.org    │  │                                  │  │
│ └──────────────────────┘  └──────────────────────────────────┘  │
│                                                                  │
│ Mobile: photo + channels stack above form.                       │
└──────────────────────────────────────────────────────────────────┘
```

---

### 9. FOUNDING MEMBERS PAGE — `/founding-members`

**Purpose:** Pre-launch landing page. The ONLY page live during pre-launch. Everything else redirects here.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    [FULL-BLEED HERO PHOTO]                    │  │
│  │                                                                │  │
│  │  Photo: Construction/building metaphor — scaffolding, a       │  │
│  │  building mid-construction, or a real shot of AHG's founding  │  │
│  │  team working late, whiteboards covered in plans. Raw. Real.  │  │
│  │  Not polished. The rawness is the point.                      │  │
│  │  Dark overlay (60-70%) for text.                              │  │
│  │                                                                │  │
│  │  "We Are Building Something. The Next Generation              │  │
│  │   Can't Wait for Us to Finish."                               │  │
│  │  [Bebas Neue, full viewport]                                  │  │
│  │                                                                │  │
│  │  AHG is a 501(c)(4) movement organization fighting for the    │  │
│  │  next generation in DFW and beyond. Our programs are designed. │  │
│  │  Our mission is clear. What we are asking for is your belief  │  │
│  │  before we finish building.                                   │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────┐                             │  │
│  │  │ BECOME A FOUNDING MEMBER     │                             │  │
│  │  │ $10/month — [payment link]   │                             │  │
│  │  │ [#CC0000 bg, white text]     │                             │  │
│  │  └──────────────────────────────┘                             │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────┐                             │  │
│  │  │ JOIN THE WAITLIST            │                             │  │
│  │  │ [white outline, email capture]                             │  │
│  │  └──────────────────────────────┘                             │  │
│  │                                                                │  │
│  │  Framing: exclusivity. "You found this before everyone else." │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## INTERACTION & UX PATTERNS

### Primary Action Per Page
| Page | Primary CTA | Destination |
|------|------------|-------------|
| Homepage | JOIN THE MOVEMENT | /membership |
| About | JOIN THE MOVEMENT | /membership |
| Programs | LEARN MORE (per program) | /programs/[name] |
| Policy | JOIN THE MOVEMENT | /membership |
| Membership | BECOME A [TIER] | Payment flow |
| Get Involved | APPLY TO VOLUNTEER | Form |
| Contact | SEND IT | Form submission |
| Founding Members | BECOME A FOUNDING MEMBER | Payment |

### Mobile-Specific Rules
- Every design starts at 390px and scales up
- Hamburger nav, but JOIN THE MOVEMENT button always visible
- Stats grid: 2x2, never single-column
- Program cards: single-column stack
- Tier cards: single-column stack
- 48px minimum tap targets everywhere
- Dark mode default in hero sections

### Performance Targets
- Page load under 3 seconds
- No registration wall before value
- Progress indicators on multi-step forms
- Lazy loading for images below fold

### Animation & Motion
- Duration: 150–300ms
- Purposeful motion only — not decorative
- `prefers-reduced-motion` respected
- No layout shift on interaction feedback

---

## VISUAL IDENTITY RULES

### Photography — Core to Every Page

Photography is a primary design element across the entire website — not decoration.

**Style rules:**
- Real people in motion — testifying, organizing, presenting, debating. Not smiling at cameras.
- Real rooms — school board chambers, legislative halls, courtrooms, community centers
- High contrast, dramatic light, grain acceptable, sterile is not
- B&W encouraged for documentary contexts and emotional weight sections
- Faces that carry something — not blank-hope expressions, not diversity-brochure composition
- **NEVER:** stock photos of young people at laptops, afterschool-brochure style, step-and-repeat banners, sunset overlays, anything that could appear on any other youth nonprofit's website

**Photo treatments:**
- **Hero photos:** Full-bleed with dark gradient overlay (60-80% opacity) for text legibility
- **Section backgrounds:** Low-opacity (15-25%) behind text-heavy sections for texture
- **Two-column photos:** Full height of column, no border radius, edge-to-edge
- **Card photos:** Top half of card, consistent aspect ratio (16:9 or 3:2)
- **B&W treatment:** Used for The Origin, emotional sections, environmental/documentary shots
- **Red tint overlay:** Optional on pillar cards and CTA sections for brand consistency
- **Desaturated color:** Muted palette that doesn't compete with AHG Red accents

**Photo usage across pages:**

| Page | Photo Count | Key Shots |
|------|-------------|-----------|
| Homepage | 8+ | Hero testimony, stat B&Ws, crowd, hallway, pillar environments, program environments, group planning, march |
| About | 8+ | Empty chamber, portrait, founder candid, crowd bg, govt building, value pairs (5), data bg, group forward |
| Programs Overview | 5+ | Hero wide-angle, 4 alternating program cards |
| Each Program Page | 6-8 | Hero environment, problem documentary, 2-3 action shots, phase thumbnails, group banner |
| Policy | 8+ | Capitol hero, 6 issue environment photos, CTA group |
| Membership | 2+ | Hero crowd, background textures |
| Get Involved | 5+ | Hero setup, 4 involvement block photos |
| Contact | 2+ | Hero door, team candid |
| Founding Members | 1+ | Hero construction/building |

**Estimated total unique photos needed: 55-70**

### Icons
- SVG only. No emoji as icons.
- Consistent family and stroke width throughout
- Icon style matches the weight of the brand — not playful, not decorative

### Logo
- "ALMOST HUMAN GROUP" in Bebas Neue
- "HUMAN" highlighted in #CC0000
- Min size: 120px wide digital
- Clear space: cap height of "A" on all sides
- Approved backgrounds: black (white text), white (black text), red (white text)
- Tagline NEVER appears in the logo lockup — they live separately

---

## DARK/LIGHT SECTION RHYTHM

```
Homepage:
  [DARK]  Hero
  [DARK]  Evidence/Stats
  [DARK]  What We Are (two-col)
  [DARK]  Three Pillars (cards)
  [LIGHT] Programs (grid)
  [DARK]  The Origin
  [DARK]  Membership Conversion
  [DARK]  Footer CTA
  [DARK]  Footer

About:
  [DARK]  Hero/Headline
  [LIGHT] Opening + Origin Story
  [DARK]  Mission
  [LIGHT] Legal Structure
  [DARK]  Values
  [LIGHT] Texas Data
  [DARK]  CTA + Footer

Pattern: Predominantly dark. Off-white sections provide
breathing room. The brand lives in darkness — it signals
urgency and works on mobile in ambient light.
```

---

## FILES NEEDED (vs. Current Codebase)

### Current files (to be rebuilt):
- `index.html` — Homepage (complete rewrite)
- `about.html` — About page (complete rewrite)
- `contact.html` — Contact page (rewrite)
- `services.html` → DELETE, replaced by `/programs`
- `impact.html` → DELETE, replaced by `/policy`
- `css/style.css` — Complete rewrite
- `js/main.js` — Rewrite (mobile nav, scroll, forms)

### New files needed:
- `programs.html` — Programs overview
- `programs/bridge.html`
- `programs/seat.html`
- `programs/launch.html`
- `programs/floor.html`
- `policy.html`
- `membership.html`
- `get-involved.html`
- `founding-members.html`
- `newsletter.html`
- `press.html`

### Font changes:
- **Remove:** Playfair Display, Inter
- **Add:** Bebas Neue, DM Sans, Space Mono

### Total pages: 13 (up from 5)

---

*"The next generation can't wait."*
