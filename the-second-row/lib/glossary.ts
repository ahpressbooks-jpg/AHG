// THE GLOSSARY — civic jargon, one honest line each. The desk owns this file.
export const GLOSSARY: { term: string; def: string }[] = [
  { term: "filibuster", def: "A Senate stall: unlimited debate that blocks a vote unless 60 senators agree to end it. Power without a majority." },
  { term: "cloture", def: "The 60-vote motion that ends a filibuster. When you hear 'failed cloture,' read 'blocked.'" },
  { term: "continuing resolution", def: "A stopgap that funds the government at current levels because Congress missed its own deadline. A snooze button, not a budget." },
  { term: "appropriations", def: "The actual spending bills — where policy fights hide inside dollar amounts." },
  { term: "rider", def: "An unrelated provision attached to a must-pass bill so it can't be voted on alone. The legislative stowaway." },
  { term: "reconciliation", def: "A budget shortcut that dodges the filibuster — majority-only, but limited to fiscal matters. How big things pass narrow Senates." },
  { term: "executive order", def: "A presidential directive to the executive branch. Real force, no new law — and the next president can erase it." },
  { term: "injunction", def: "A court order to stop (or compel) an action while the case proceeds. 'Nationwide injunction' = one judge pausing a policy everywhere." },
  { term: "certiorari", def: "The Supreme Court agreeing to hear a case ('granting cert'). Four justices must want in." },
  { term: "indictment", def: "A grand jury's formal accusation — the start of a case, not a verdict." },
  { term: "subpoena", def: "A legal demand for testimony or documents. Ignoring one is contempt; fighting one takes months." },
  { term: "gerrymander", def: "Drawing district lines so politicians choose their voters instead of the reverse." },
  { term: "margin of error", def: "A poll's stated uncertainty — per candidate, so a gap can swing about double it. See the Toolkit lesson." },
  { term: "likely voters", def: "Not a fact — a pollster's model of who shows up. Different models, different 'races.'" },
  { term: "tariff", def: "A tax on imports, paid at the border and usually passed to buyers. A tax with better branding." },
  { term: "deficit", def: "One year's gap between spending and revenue. The debt is all the deficits stacked up." },
  { term: "ceasefire", def: "An agreed pause in fighting — not peace, and the terms decide whether it holds." },
  { term: "sanctions", def: "Economic punishment between states: frozen assets, banned trade, blocked banking. War's paperwork sibling." },
];

export function matchGlossary(text: string): { term: string; def: string }[] {
  const t = " " + text.toLowerCase() + " ";
  return GLOSSARY.filter((g) => t.includes(g.term));
}
