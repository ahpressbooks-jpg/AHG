import { Post } from "./types";

// ---------------------------------------------------------------------------
// THE PASTE PIPELINE — content the founder hands to Claude in chat lands
// here, gets committed, and publishes itself to the live site on the next
// sweep (once, idempotent). The Control Room at /desk is the everyday way to
// publish; this file is the "I pasted it in chat" way.
//
// Format per post:
//   slug  - url piece, lowercase-with-dashes
//   kind  - "column" | "steelman" | "note"
//   body  - paragraphs separated by blank lines; start a paragraph with
//           [FACT] [POLICY] [OPINION] [QUESTION] [THINKING] to chip it;
//           "## " starts a heading.
// ---------------------------------------------------------------------------

export const SEED_POSTS: Post[] = [
  // Example (uncomment, edit, push — it publishes once):
  // {
  //   slug: "why-the-second-row",
  //   title: "Why the second row",
  //   dek: "You don't need the front of the room to be heard clearly.",
  //   kind: "column",
  //   publishedAt: "2026-06-12T13:00:00.000Z",
  //   body:
  //     "[OPINION] The front row buys belonging. The second row keeps its judgment.\n\n" +
  //     "## The seat\n\n" +
  //     "[THINKING] A clear view and the nerve to describe it — that's the whole job.",
  // },
];

// The founder's note that tops /today (set once here, or daily from /desk).
export const SEED_NOTE: string = "";
