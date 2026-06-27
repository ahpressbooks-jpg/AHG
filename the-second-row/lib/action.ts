// THE ACTION CENTER — the movement layer's single source of truth. Issue hubs,
// campaigns, volunteer roles, fast actions, and resources, all seeded so the
// founder can see a living movement immediately and extend it from one file.

export interface IssueHub {
  slug: string;
  title: string;
  blurb: string;
  accent: string;
}

export interface Campaign {
  slug: string;
  hub: string; // IssueHub.slug
  title: string;
  summary: string;
  whatsHappening?: string;
  whyItMatters?: string;
  urgency: "Urgent" | "Active" | "Tracking" | "New";
  spotlight?: boolean;
  actions: { label: string; href: string }[];
  related?: { label: string; href: string }[];
}

export const ISSUE_HUBS: IssueHub[] = [
  { slug: "foster-care", title: "Foster Care Reform", accent: "#9f2a22", blurb: "Too many young people are asked to become adults without the stability, relationships, housing, or public attention they deserve. We treat foster care as a question of design, dignity, and truth." },
  { slug: "mental-health", title: "Mental Health", accent: "#0f5b54", blurb: "Real stress, real trauma, real exhaustion, real care. We will not reduce mental health to content language or wellness aesthetics." },
  { slug: "education", title: "Education", accent: "#1d4ed8", blurb: "Not only school performance — preparation for judgment, participation, adulthood, and understanding the systems people actually live inside." },
  { slug: "education-beyond", title: "Education Beyond the Classroom", accent: "#7a3f5e", blurb: "Some of the most important learning in life happens outside formal institutions. We build public resources around the missing lessons." },
  { slug: "youth", title: "Youth & the Next Generation", accent: "#a9701a", blurb: "A generation inheriting broken systems and rising pressure deserves coverage and action architecture built with seriousness — not branding." },
  { slug: "economic-dignity", title: "Economic Dignity", accent: "#1f7a4d", blurb: "Economics becomes real in the body and the home: bills, rent, debt, labor, mobility, and stress. We track whether systems make a stable life more or less possible." },
  { slug: "civic-education", title: "Civic Education", accent: "#0e7490", blurb: "People need civic fluency, not just opinions — how systems work, where power sits, and how action actually happens." },
  { slug: "justice", title: "Justice & System Harm", accent: "#8a2a2f", blurb: "Some harm is patterned, administrative, and normalized. This hub connects reporting, accountability, and response." },
  { slug: "media-accountability", title: "Media Accountability", accent: "#475569", blurb: "If public memory is weak, power gets to rewrite itself. We make media accountability legible and public." },
  { slug: "local", title: "Local Community Issues", accent: "#b45309", blurb: "National narratives miss the shape of local harm. A place where local concerns surface before they disappear." },
];

export const CAMPAIGNS: Campaign[] = [
  {
    slug: "aging-out", hub: "foster-care", urgency: "Urgent", spotlight: true,
    title: "Aging Out Should Not Mean Falling Off a Cliff",
    summary: "Too many young people leave foster care into housing instability, weak support, education barriers, and economic precarity.",
    whatsHappening: "The public should be able to track which policies actually help young people transition into adulthood — and which promises quietly fade after the headline.",
    whyItMatters: "Aging out is one of the clearest tests of whether a public system is designed to support people, or just to celebrate their survival after abandonment.",
    actions: [
      { label: "Track this issue", href: "/action/foster-care" },
      { label: "Read the explainer", href: "/toolkit" },
      { label: "Submit your story", href: "#intake" },
      { label: "See the policy watchlist", href: "/ledger" },
    ],
    related: [{ label: "Open files in Investigations", href: "/investigations" }, { label: "The Ledger watchlist", href: "/ledger" }],
  },
  {
    slug: "mental-health-aesthetic", hub: "mental-health", urgency: "Active", spotlight: true,
    title: "Mental Health Beyond the Aesthetic",
    summary: "We don't treat mental health like a trend, a vibe, or a brand. This campaign focuses on structural stress, trauma, youth systems, and care access.",
    whatsHappening: "We're building an issue file on the difference between language and actual support — who offers trained staff and stable access, and who just uses the words.",
    whyItMatters: "Commodified wellness language can become cover for institutional neglect. Naming the gap is the first act of repair.",
    actions: [
      { label: "See the issue file", href: "/action/mental-health" },
      { label: "Open resources", href: "/toolkit" },
      { label: "Join the discussion", href: "/room" },
      { label: "Follow updates", href: "#intake" },
    ],
  },
  { slug: "fostering-future-act", hub: "foster-care", urgency: "Tracking", title: "Track the Fostering the Future Act", summary: "House movement on foster-youth legislation is a chance to follow the gap between policy language and lived implementation in housing, legal services, and education.", actions: [{ label: "Track it", href: "/action/foster-care" }, { label: "Add to the Ledger", href: "/ledger" }] },
  { slug: "end-benefit-theft", hub: "foster-care", urgency: "Active", title: "End the Theft of Foster Youth Benefits", summary: "Advocates are pushing to stop governments from using children's benefits, including SSI, to offset the cost of their care. We frame it as dignity, public ethics, and material survival.", actions: [{ label: "Track it", href: "/action/foster-care" }, { label: "Submit evidence", href: "#intake" }] },
  { slug: "housing-after-care", hub: "foster-care", urgency: "Active", title: "Housing After Care", summary: "Housing instability after foster care is one of the clearest tests of whether systems are built to support young people once custody ends.", actions: [{ label: "Open the hub", href: "/action/foster-care" }, { label: "Share your experience", href: "#intake" }] },
  { slug: "youth-systems-mh", hub: "mental-health", urgency: "Tracking", title: "Mental Health in Youth Systems", summary: "Mental health inside juvenile and youth-serving systems deserves closer scrutiny, clearer reporting, and stronger public memory.", actions: [{ label: "Open the hub", href: "/action/mental-health" }, { label: "Submit a lead", href: "/tips" }] },
  { slug: "care-not-slogans", hub: "mental-health", urgency: "Active", title: "Care, Not Slogans", summary: "Track whether schools, institutions, and communities offer actual care, trained staff, and stable access — or just use mental health language as cover.", actions: [{ label: "Open the hub", href: "/action/mental-health" }, { label: "Report a gap", href: "#intake" }] },
  { slug: "education-beyond-classroom", hub: "education-beyond", urgency: "Active", title: "Education Beyond the Classroom", summary: "A serious life requires knowledge most people are never taught: money, civic systems, media literacy, emotional regulation, and self-advocacy.", actions: [{ label: "Open the toolkit", href: "/toolkit" }, { label: "Open the hub", href: "/action/education-beyond" }] },
  { slug: "not-a-branding-theme", hub: "youth", urgency: "Active", title: "The Next Generation Is Not a Branding Theme", summary: "Young people are constantly described, marketed to, and spoken over. We make a place where their conditions, pressures, and futures are treated with seriousness.", actions: [{ label: "Open the hub", href: "/action/youth" }, { label: "Add your perspective", href: "#intake" }] },
  { slug: "readiness-rights-reality", hub: "education", urgency: "Tracking", title: "Readiness, Rights, and Reality", summary: "Education policy connected to student rights, real readiness for adulthood, mental health support, and the systems young people are being prepared to enter.", actions: [{ label: "Open the hub", href: "/action/education" }, { label: "Track on the Ledger", href: "/ledger" }] },
  { slug: "cost-of-living", hub: "economic-dignity", urgency: "Active", title: "Cost of Living Is a Moral Story", summary: "Economics translated into life: rent, food, wages, debt, mobility, and the emotional stress of instability.", actions: [{ label: "Open the hub", href: "/action/economic-dignity" }, { label: "Share your experience", href: "#intake" }] },
  { slug: "economic-dignity", hub: "economic-dignity", urgency: "Tracking", title: "Economic Dignity", summary: "Track whether policy and institutions make a stable life more possible or less possible for ordinary people.", actions: [{ label: "Open the hub", href: "/action/economic-dignity" }, { label: "Track it", href: "/ledger" }] },
  { slug: "work-mobility", hub: "youth", urgency: "Tracking", title: "Work, Mobility, and Young Adulthood", summary: "Follow how work, apprenticeships, housing, and access shape whether the next generation can start adult life with traction.", actions: [{ label: "Open the hub", href: "/action/youth" }, { label: "Submit a lead", href: "/tips" }] },
];

export const TAKE_ACTION = [
  { label: "Submit a local issue", desc: "Tell us what your school, city, neighborhood, or system is dealing with.", href: "#intake" },
  { label: "Join the next Room", desc: "Take part in a live civic discussion, workshop, or issue session.", href: "/room" },
  { label: "Volunteer with TSR", desc: "Help research, organize, document, or support campaigns.", href: "#volunteer" },
  { label: "Open the toolkit", desc: "Practical guides, explainers, and action resources.", href: "/toolkit" },
  { label: "Track an issue", desc: "Follow one issue over time through campaigns, stories, and updates.", href: "/ledger" },
  { label: "Share your experience", desc: "Add lived reality to the record.", href: "#intake" },
];

export const VOLUNTEER_ROLES = [
  "Research", "Writing / documentation", "Community organizing", "Event support",
  "Local issue spotting", "Youth perspective", "Lived experience / testimony",
];

export const RESOURCES = [
  { title: "Explainers", desc: "Context for a moving story, in plain language.", href: "/toolkit" },
  { title: "Know-your-rights briefs", desc: "What you're entitled to, and how to ask for it.", href: "/toolkit" },
  { title: "Issue briefs", desc: "The shape of a problem, sourced and dated.", href: "/investigations" },
  { title: "Discussion guides", desc: "Run an honest conversation in a room or a classroom.", href: "/classroom" },
  { title: "Reading lists", desc: "Where to go deeper, chosen with care.", href: "/toolkit" },
  { title: "Family / youth / student resources", desc: "Starting points for the people closest to the issue.", href: "/toolkit" },
];

export const campaignsByHub = (hub: string) => CAMPAIGNS.filter((c) => c.hub === hub);
export const hubBySlug = (slug: string) => ISSUE_HUBS.find((h) => h.slug === slug);
export const spotlights = () => CAMPAIGNS.filter((c) => c.spotlight);
