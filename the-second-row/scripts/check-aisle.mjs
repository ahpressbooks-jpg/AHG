// check-aisle.mjs — enforce the Aisle wall (redesign brief §aisle) in CI.
// The GRAVITY news-scoring modules must not import ANY advocacy/Floor module.
// Fails the build if they do, so "the news half does not campaign" is a fact
// the build checks, not a promise. Run: node scripts/check-aisle.mjs
import { readFileSync } from "node:fs";

const GUARDED = ["lib/score.ts", "lib/scoring/gravity.ts"];
const FORBIDDEN = /(import|export)[^\n]*?from\s*["'](?:\.\.?\/)*(floor|aisle|drafts|fights|floorvotes|well|intake\/[a-z]+|scoring\/stakes)["']/;

const violations = [];
for (const file of GUARDED) {
  let src;
  try { src = readFileSync(new URL("../" + file, import.meta.url), "utf8"); }
  catch { console.error(`! could not read ${file}`); continue; }
  src.split("\n").forEach((line, i) => {
    if (FORBIDDEN.test(line)) violations.push(`${file}:${i + 1}  ${line.trim()}`);
  });
}

if (violations.length) {
  console.error("❌  Aisle wall breached — GRAVITY scoring imports advocacy code:\n" + violations.map((v) => "   " + v).join("\n"));
  process.exit(1);
}
console.log(`✓  Aisle wall intact — GRAVITY (${GUARDED.join(", ")}) imports no advocacy/Floor code.`);
