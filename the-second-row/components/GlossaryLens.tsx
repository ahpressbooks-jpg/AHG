import { GLOSSARY } from "@/lib/glossary";

// THE GLOSSARY LENS — wraps civic jargon in an inline explainer. Zero JS:
// native title tooltip + a dotted underline. Longest terms matched first.
export default function GlossaryLens({ text }: { text: string }) {
  const terms = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length);
  const pattern = new RegExp(`\\b(${terms.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "i");

  const out: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  const seen = new Set<string>();

  while (rest.length) {
    const m = pattern.exec(rest);
    if (!m || m.index === undefined) {
      out.push(rest);
      break;
    }
    const matched = m[0];
    const lower = matched.toLowerCase();
    out.push(rest.slice(0, m.index));
    const def = GLOSSARY.find((g) => g.term === lower)?.def;
    if (def && !seen.has(lower)) {
      seen.add(lower); // gloss each term once per passage — no clutter
      out.push(
        <abbr key={key++} className="gloss" title={def}>
          {matched}
        </abbr>
      );
    } else {
      out.push(matched);
    }
    rest = rest.slice(m.index + matched.length);
  }
  return <>{out}</>;
}
