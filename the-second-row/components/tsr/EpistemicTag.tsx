// EPISTEMIC TAG — the markers that say what KIND of claim a thing is. Two
// families: confidence (Certain / Likely / Guessing) and speech-act (Fact /
// Opinion / Question / Policy Update / Thinking Out Loud). Each carries a
// tinted ground derived only by opacity over the four locked colors.

export type Epistemic =
  | "certain" | "likely" | "guessing"
  | "fact" | "opinion" | "question" | "policy" | "thinking";

const MAP: Record<Epistemic, { label: string; cls: string; italic?: boolean }> = {
  certain: { label: "Certain", cls: "text-cream border-hairline-strong bg-cream-6" },
  likely: { label: "Likely", cls: "text-cream-70 border-hairline-strong" },
  guessing: { label: "Guessing", cls: "text-cream-55 border-hairline-strong border-dashed" },
  fact: { label: "Fact", cls: "text-cream border-hairline-strong bg-cream-6" },
  opinion: { label: "Opinion", cls: "text-oxblood border-oxblood bg-oxblood-12" },
  question: { label: "Question", cls: "text-cream-70 border-hairline-strong" },
  policy: { label: "Policy Update", cls: "text-oxblood border-oxblood" },
  thinking: { label: "Thinking Out Loud", cls: "text-cream-55 border-hairline-strong border-dashed", italic: true },
};

export default function EpistemicTag({ kind }: { kind: Epistemic }) {
  const e = MAP[kind];
  return (
    <span
      className={`mono-label inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[0.55rem] ${e.cls} ${e.italic ? "not-italic" : ""}`}
      aria-label={e.label}
    >
      {e.label}
    </span>
  );
}
