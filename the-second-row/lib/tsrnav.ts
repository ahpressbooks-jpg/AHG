// THE REDESIGN SITE MAP — the two halves + company, for the shell, the Sections
// overlay, and the footer. One source of truth so the structure teaches itself.

export interface NavLink { label: string; href: string }

export const WIRE_NAV: NavLink[] = [
  { label: "The Wire", href: "/wire" },
  { label: "Dispatches", href: "/dispatches" },
  { label: "The Ledger", href: "/ledger" },
  { label: "The Spin Room", href: "/spin" },
  { label: "Investigations", href: "/investigations" },
  { label: "The Assignment Desk", href: "/assignment-desk" },
  { label: "Documents", href: "/documents" },
  { label: "Toolkit", href: "/toolkit" },
  { label: "Civic Weather", href: "/weather" },
  { label: "Election Lens", href: "/election-lens" },
];

export const FLOOR_NAV: NavLink[] = [
  { label: "The Floor", href: "/floor" },
  { label: "The Drafting Table", href: "/drafting-table" },
  { label: "The Docket", href: "/docket" },
  { label: "Floor Votes", href: "/floor-votes" },
  { label: "The Well", href: "/well" },
  { label: "The Fight Ledger", href: "/fight-ledger" },
  { label: "The Aisle", href: "/aisle" },
];

export const COMPANY_NAV: NavLink[] = [
  { label: "The Thesis", href: "/company" },
  { label: "Method", href: "/method" },
  { label: "Standards", href: "/standards" },
  { label: "Corrections", href: "/corrections" },
  { label: "Masthead", href: "/masthead" },
  { label: "The Glass Desk", href: "/glass" },
  { label: "Contact", href: "/contact" },
  { label: "Tips", href: "/tips" },
  { label: "Press", href: "/press" },
  { label: "Subscribe", href: "/subscribe" },
];
