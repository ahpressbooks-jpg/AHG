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

**Purpose:** Emotional entry point. Understanding AHG → Taking action. Dark, high-contrast, typographically dominant.

#### Section 1: Hero
```
┌──────────────────────────────────────────────────────────────────────┐
│                        [Movement Black #0A0A0A]                     │
│                     [subtle geometric grid texture]                 │
│                                                                     │
│            "They've been deciding your                              │
│             future without you."                                    │
│             [Bebas Neue, 120px+, white, red accent on ONE phrase]   │
│                                                                     │
│            Almost Human Group fights for every young person         │
│            whose future is being decided in rooms they were         │
│            never invited into.                                      │
│            [DM Sans 400, 18–20px, white]                           │
│                                                                     │
│            ┌─────────────────┐  ┌──────────────────────┐           │
│            │ JOIN THE        │  │ SEE WHAT WE          │           │
│            │ MOVEMENT        │  │ FIGHT FOR            │           │
│            │ [#CC0000 solid] │  │ [white outline]      │           │
│            └─────────────────┘  └──────────────────────┘           │
│                                                                     │
│            → /membership         → /policy                         │
└──────────────────────────────────────────────────────────────────────┘
```
- Full viewport height (100vh)
- NO photography — type carries the hero
- Two CTA buttons below headline
- Subheadline in DM Sans 400, white, 18–20px

#### Section 2: The Evidence (Statistics)
```
┌──────────────────────────────────────────────────────────────────────┐
│  "These are not statistics. They are children. In Texas. Right now."│
│  [DM Sans 500, Off-White]                                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
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
│  Dark background. Numbers are the visual. Gray descriptors below.  │
│  Mobile: 2x2 grid (NOT single column).                             │
└──────────────────────────────────────────────────────────────────────┘
```
- Presented like evidence, not selling points — "prosecutor style"
- Large red numerals are the dominant visual element
- No commentary or solution framing

#### Section 3: What We Are (Identity Statement)
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │                     │  │                                     │  │
│  │  Not a Charity.     │  │  AHG is organized, structured,     │  │
│  │  A Movement.        │  │  funded, and built to outlast the   │  │
│  │                     │  │  resistance. We use the same legal  │  │
│  │  [Bebas Neue,       │  │  structure as the NAACP and the     │  │
│  │   large, white]     │  │  ACLU because the fight the next    │  │
│  │                     │  │  generation is in requires it...    │  │
│  │                     │  │                                     │  │
│  │                     │  │  We serve every young person from   │  │
│  │                     │  │  a high school freshman to age 26.  │  │
│  │                     │  │                                     │  │
│  │                     │  │  We go wherever the fight is.       │  │
│  └─────────────────────┘  └─────────────────────────────────────┘  │
│                                                                     │
│  Two-column layout. Mobile: stacks vertically.                     │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 4: Three Pillars
```
┌──────────────────────────────────────────────────────────────────────┐
│  Dark background. Three cards with red accent numbers.             │
│                                                                     │
│  ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐  │
│  │ 01                │ │ 02                │ │ 03               │  │
│  │ [#CC0000, large]  │ │ [#CC0000, large]  │ │ [#CC0000, large] │  │
│  │                   │ │                   │ │                  │  │
│  │ Education Beyond  │ │ Policy That       │ │ Representation   │  │
│  │ the Classroom     │ │ Protects the      │ │                  │  │
│  │                   │ │ Future            │ │                  │  │
│  │ Schools design    │ │ Mental health.    │ │ Young people are │  │
│  │ for compliance.   │ │ Housing. Juvenile │ │ the subject of   │  │
│  │ Young people need │ │ justice. Foster   │ │ almost every     │  │
│  │ development...    │ │ care...           │ │ major policy...  │  │
│  │                   │ │                   │ │                  │  │
│  │ LEARN MORE →      │ │ SEE THE AGENDA →  │ │ OUR PROGRAMS →   │  │
│  │ /policy           │ │ /policy           │ │ /programs        │  │
│  └───────────────────┘ └───────────────────┘ └──────────────────┘  │
│                                                                     │
│  One link per card. No competing CTAs. Each sends somewhere diff.  │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 5: Programs
```
┌──────────────────────────────────────────────────────────────────────┐
│  "Four Programs. One Fight."                                       │
│  [Bebas Neue, section headline]                                    │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ BRIDGE       │ │ SEAT         │ │ LAUNCH       │ │ FLOOR     │ │
│  │ [Space Mono  │ │ [Space Mono  │ │ [Space Mono  │ │ [Space    │ │
│  │  #CC0000]    │ │  #CC0000]    │ │  #CC0000]    │ │  Mono]    │ │
│  │              │ │              │ │              │ │           │ │
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
│  Grid or horizontal strip. Mobile: single-column stacked cards.    │
│  Navigation, not conversion — keep tight.                          │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 6: The Origin ("The Hallway")
```
┌──────────────────────────────────────────────────────────────────────┐
│  Full-width dark section. No callout boxes. No pull quotes.        │
│  No photo. The words do the work.                                  │
│                                                                     │
│  The Hallway.                                                      │
│  [Bebas Neue, small/quiet — headline is understated here]          │
│                                                                     │
│  AHG exists because too many people in this country are treated    │
│  as almost human. Almost old enough to matter. Almost ready to     │
│  have a voice. Almost worth designing a system around.             │
│                                                                     │
│  Our founder grew up inside those systems. He was moved, assessed, │
│  categorized, and processed. Not developed. Not asked what he      │
│  needed. Not given a plan when being smart wasn't enough...        │
│                                                                     │
│  He was not fine.                                                  │
│                                                                     │
│  ...That's who we build for.                                       │
│                                                                     │
│  READ THE FULL STORY → /about                                      │
│                                                                     │
│  EMOTIONAL CENTER OF HOMEPAGE. Do not sanitize. Do not summarize.  │
│  Let it breathe. Every line stays.                                 │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 7: Membership Conversion
```
┌──────────────────────────────────────────────────────────────────────┐
│  Dark section.                                                     │
│                                                                     │
│  "The Movement Needs You Before It Needs Anyone Else."             │
│  [Bebas Neue]                                                      │
│                                                                     │
│  Become a Founding Member. $10/month. Your name in the first       │
│  annual report. You were here before it was finished.              │
│  [DM Sans]                                                         │
│                                                                     │
│  ┌────────────────────────────┐                                    │
│  │ BECOME A FOUNDING MEMBER   │                                    │
│  │ [#CC0000 bg, white text]   │                                    │
│  └────────────────────────────┘                                    │
│  → /membership                                                     │
│                                                                     │
│  Secondary: "We are pre-launch. We are building this in public."   │
│  Framing: exclusivity, not charity.                                │
│  Do NOT list tier benefits here — /membership handles that.        │
└──────────────────────────────────────────────────────────────────────┘
```

#### Section 8: Footer CTA
```
┌──────────────────────────────────────────────────────────────────────┐
│  "The Next Generation Can't Wait."                                 │
│  [Bebas Neue, large]                                               │
│                                                                     │
│  Join AHG. Tell someone who needs to know we exist.                │
│  Show up for the fight.                                            │
│                                                                     │
│  ┌─────────────────────┐                                           │
│  │ JOIN THE MOVEMENT   │                                           │
│  │ [#CC0000]           │                                           │
│  └─────────────────────┘                                           │
│  → /membership                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

→ Then the five-column footer (global component)

---

### 2. ABOUT PAGE — `/about`

**Purpose:** Full emotional story + organizational credibility. The page that converts skeptics into believers.

```
SECTION FLOW:
┌─────────────────────────────────────────────┐
│ 1. Page Headline: "We Got Tired of Almost." │
│    [Bebas Neue, large, dark bg]             │
├─────────────────────────────────────────────┤
│ 2. Opening — Two paragraphs                 │
│    "Almost Human Group exists because too   │
│    many people in this country are treated   │
│    as almost human..."                      │
├─────────────────────────────────────────────┤
│ 3. The Origin — Founder Story               │
│    CRITICAL: Full emotional weight.         │
│    Do not sanitize. Do not put in callout   │
│    box. Let it breathe.                     │
│    Noah Dean's full story — adoption,       │
│    school system, 2021 crisis, building AHG │
│    Pull quote: "Children are not at the     │
│    will of the education system..."         │
├─────────────────────────────────────────────┤
│ 4. Mission Statement                        │
│    "The organized, uncompromising voice..."  │
├─────────────────────────────────────────────┤
│ 5. Legal Structure                          │
│    501(c)(4) explanation — same structure    │
│    as NAACP, ACLU, Sierra Club. Why.        │
├─────────────────────────────────────────────┤
│ 6. Values — Five value blocks               │
│    - Proximity over distance                │
│    - Certainty over comfort                 │
│    - Structure over symbolism               │
│    - Urgency without panic                  │
│    - Accountability by name                 │
│    [Each: title + 1-2 sentence explanation] │
├─────────────────────────────────────────────┤
│ 7. Texas Data Block                         │
│    38,000+ / 1.5% / 46% / 50%             │
│    "These are children. In Texas. Right now."│
├─────────────────────────────────────────────┤
│ 8. CTA → JOIN THE MOVEMENT                  │
└─────────────────────────────────────────────┘
```

**Design notes:**
- Long-form single-column content page
- Dark hero, alternating dark/off-white sections
- The founder story section gets maximum vertical space — no compression
- Values displayed as stacked blocks or alternating two-column

---

### 3. PROGRAMS OVERVIEW — `/programs`

**Purpose:** Navigation hub to four individual program pages.

```
┌─────────────────────────────────────────────┐
│ Headline: "Four Programs. One Fight."       │
│ [Bebas Neue, dark bg hero]                  │
├─────────────────────────────────────────────┤
│ Intro: "Every AHG program exists for the    │
│ same reason: young people are the subject   │
│ of every major decision and almost never    │
│ in the room..."                             │
├─────────────────────────────────────────────┤
│ Four program cards (larger than homepage):   │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ BRIDGE                                  │ │
│ │ Breaking Rules In Decisions that        │ │
│ │ Govern Education                        │ │
│ │ Ages 14–18 · High School               │ │
│ │ [expanded description]                  │ │
│ │ LEARN MORE → /programs/bridge           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Same pattern for SEAT, LAUNCH, FLOOR]      │
│ Each with: code name, full name, age range, │
│ 2-3 sentence description, single CTA        │
├─────────────────────────────────────────────┤
│ CTA: JOIN THE MOVEMENT → /membership        │
└─────────────────────────────────────────────┘
```

---

### 4. INDIVIDUAL PROGRAM PAGES — `/programs/bridge`, `/seat`, `/launch`, `/floor`

**Shared structure for each:**

```
┌─────────────────────────────────────────────┐
│ Hero: Program code [Space Mono, #CC0000]    │
│       Full name [Bebas Neue]                │
│       Age range                              │
│       Pull quote                            │
├─────────────────────────────────────────────┤
│ THE PROBLEM                                 │
│ [2-3 paragraphs defining the systemic       │
│  failure this program addresses]            │
├─────────────────────────────────────────────┤
│ WHAT [PROGRAM] IS                           │
│ [Program description, 2-3 paragraphs]       │
├─────────────────────────────────────────────┤
│ PROGRAM STRUCTURE                           │
│ [Phases/structure specific to each program] │
│ BRIDGE: 6 phases (visual timeline)          │
│ SEAT: 8-week intensive cohort               │
│ LAUNCH: 6-week curriculum                   │
│ FLOOR: Placement + curriculum + deliverable │
├─────────────────────────────────────────────┤
│ CTA: JOIN THE MOVEMENT / GET INVOLVED       │
└─────────────────────────────────────────────┘
```

**Program-specific design elements:**
- **BRIDGE:** Six-phase visual timeline/stepper showing progression from Issue Identification → Alumni Network
- **SEAT:** Eight-week cohort structure, emphasis on "real authority, not symbolic"
- **LAUNCH:** Six-week curriculum blocks, financial literacy → career nav → alumni
- **FLOOR:** Competitive selection callout (8–12 fellows), placement + curriculum parallel tracks

---

### 5. POLICY PAGE — `/policy`

**Purpose:** AHG's six-issue advocacy agenda. Accountability language. No hedging.

```
┌─────────────────────────────────────────────┐
│ Hero headline:                              │
│ "AHG Does Not React to Policy.              │
│  AHG Drives It."                            │
│ [Bebas Neue, dark bg]                       │
│                                             │
│ Subheadline: "Six fights. Every young       │
│ person between 14 and 26. DFW today.        │
│ The nation by Year 3."                      │
├─────────────────────────────────────────────┤
│ Six issue blocks — alternating layout:      │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 01 Mental Health Infrastructure         │ │
│ │ in Schools                              │ │
│ │ [Red number, Bebas Neue title]          │ │
│ │                                         │ │
│ │ Position statement + clear stance       │ │
│ │ "Fund it like [it's true] —             │ │
│ │  not like it is optional."              │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 02 Education System Redesign                │
│ 03 Foster Care Transition Reform            │
│ 04 Juvenile Justice Reform                  │
│ 05 Youth Representation in Civic            │
│    Institutions                             │
│ 06 Housing Access for Young Adults          │
│                                             │
│ Each block: red number, title, 1-2          │
│ paragraphs of position, bold stance line    │
├─────────────────────────────────────────────┤
│ CTA: JOIN THE MOVEMENT → /membership        │
└─────────────────────────────────────────────┘
```

**Design notes:**
- Numbered issues with prominent red numbers
- Each issue gets its own visual block/card
- Bold position lines formatted distinctly (larger type or red accent)
- No softening language — the design reinforces the directness

---

### 6. MEMBERSHIP PAGE — `/membership`

**Purpose:** Conversion. Five tiers presented with escalating commitment and clear value.

```
┌─────────────────────────────────────────────┐
│ PRE-LAUNCH BANNER (top of page):            │
│ "AHG IS PRE-LAUNCH. We are filing.         │
│  We are building. We are not waiting."      │
│ [Red bar, white text, prominent]            │
├─────────────────────────────────────────────┤
│ Headline: "The Movement Needs Members       │
│ Who Mean It."                               │
│                                             │
│ Subheadline: "Members are not supporters.   │
│ Members are not donors. Members are the     │
│ movement..."                                │
├─────────────────────────────────────────────┤
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
┌─────────────────────────────────────────────┐
│ Headline: "The Fight Needs More Than Money."│
│ Sub: "It needs people. People with skills,  │
│ relationships, time, platforms, and          │
│ proximity to the next generation."          │
├─────────────────────────────────────────────┤
│ Four involvement blocks:                    │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ VOLUNTEER                               │ │
│ │ Program facilitation, community         │ │
│ │ outreach, events, admin support         │ │
│ │ APPLY TO VOLUNTEER → [form]             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ CORPORATE PARTNERSHIP                   │ │
│ │ Public alignment with the movement.     │ │
│ │ Three tiers starting at $5,000/year.    │ │
│ │ VIEW PARTNERSHIP OPTIONS → [link]       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ SPEAK AT AHG                            │ │
│ │ Educators, advocates, young leaders,    │ │
│ │ elected officials, community voices     │ │
│ │ SUBMIT A SPEAKER INQUIRY → [form]       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ SPREAD THE WORD                         │ │
│ │ Follow on IG + FB. Share with one       │ │
│ │ person. Tell your school/org/community. │ │
│ │ [Social links]                          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

### 8. CONTACT PAGE — `/contact`

**Purpose:** Routed inquiries. Three email destinations + structured form.

```
┌─────────────────────────────────────────────┐
│ Headline: "Get in the Room."                │
│ [Bebas Neue, dark bg]                       │
├─────────────────────────────────────────────┤
│ Three contact channels:                     │
│                                             │
│ General: hello@almosthumangroup.org         │
│ Press:   press@almosthumangroup.org         │
│ Programs: programs@almosthumangroup.org     │
│                                             │
│ [Each with 1-2 sentence description]        │
├─────────────────────────────────────────────┤
│ CONTACT FORM:                               │
│                                             │
│ Name         [________________]             │
│ Email        [________________]             │
│ Organization [________________] (optional)  │
│ Subject      [▾ General / Press / Programs  │
│                 / Membership / Partnership  │
│                 / Speaking ]                │
│ Message      [________________]             │
│              [________________]             │
│              [________________]             │
│                                             │
│ ┌────────────────┐                          │
│ │    SEND IT     │                          │
│ │  [#CC0000]     │                          │
│ └────────────────┘                          │
│                                             │
│ Progress indicator on multi-step if needed  │
│ Min 48px tap targets on all inputs          │
└─────────────────────────────────────────────┘
```

---

### 9. FOUNDING MEMBERS PAGE — `/founding-members`

**Purpose:** Pre-launch landing page. The ONLY page live during pre-launch. Everything else redirects here.

```
┌──────────────────────────────────────────────────────────────────────┐
│ HERO:                                                              │
│ "We Are Building Something. The Next Generation                    │
│  Can't Wait for Us to Finish."                                     │
│ [Bebas Neue, dark bg, full viewport]                               │
│                                                                     │
│ BODY:                                                              │
│ Almost Human Group is a 501(c)(4) movement organization            │
│ fighting for the next generation in DFW and beyond. Our programs   │
│ are designed. Our mission is clear. What we are asking for is      │
│ your belief before we finish building.                             │
│                                                                     │
│ ┌──────────────────────────────┐                                   │
│ │ BECOME A FOUNDING MEMBER     │                                   │
│ │ $10/month — [payment link]   │                                   │
│ │ [#CC0000 bg, white text]     │                                   │
│ └──────────────────────────────┘                                   │
│                                                                     │
│ ┌──────────────────────────────┐                                   │
│ │ JOIN THE WAITLIST            │                                   │
│ │ [white outline, email capture│                                   │
│ │  for those not ready yet]    │                                   │
│ └──────────────────────────────┘                                   │
│                                                                     │
│ Framing: exclusivity. "You found this before everyone else."       │
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

### Photography (When Used)
- Real people in motion — testifying, organizing, presenting, debating
- Real rooms — school boards, legislative halls, courtrooms
- High contrast, dramatic light, grain acceptable
- B&W encouraged for documentary contexts
- **NEVER:** stock photos, afterschool-brochure style, step-and-repeat banners, sunset overlays

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
