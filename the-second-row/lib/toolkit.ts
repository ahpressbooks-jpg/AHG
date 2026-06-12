// THE TOOLKIT — the method, one page at a time. Free forever; the on-ramp
// to "Think for Yourself." The desk owns this file: edit, add, ship.

export interface Primer {
  slug: string;
  title: string;
  tease: string;
  minutes: number;
  sections: { h: string; body: string[] }[];
  drill: string;
}

export const PRIMERS: Primer[] = [
  {
    slug: "how-to-read-a-poll",
    title: "How to read a poll",
    tease: "Margin of error is per-candidate, the sample matters more than the size, and 'likely voters' is a model, not a fact.",
    minutes: 5,
    sections: [
      {
        h: "The margin of error is bigger than they told you",
        body: [
          "A poll says 48–45 with a margin of error of ±3. Sounds like a 3-point lead with a 3-point cushion — basically safe, right? Wrong twice. The ±3 applies to EACH number separately: the 48 could really be 45, and the 45 could really be 48. The gap between two candidates can swing roughly double the stated margin. A 3-point lead inside ±3 is a coin flip wearing a suit.",
          "Rule: when the lead is smaller than twice the margin of error, the honest headline is 'too close to call' — which is exactly why you'll rarely see that headline.",
        ],
      },
      {
        h: "Who they asked beats how many they asked",
        body: [
          "A sloppy sample of 10,000 loses to a careful sample of 800. What matters is whether the people polled look like the people who will actually show up. Check three things in the fine print: registered voters or likely voters or all adults (these are different universes); how it was conducted (live calls, online panel, text); and who paid for it.",
          "'Likely voters' deserves special suspicion: it's not a fact about the world, it's the pollster's MODEL of who turns up. Two pollsters with identical raw data and different turnout models will publish different races.",
        ],
      },
      {
        h: "One poll is an anecdote",
        body: [
          "Polls are weather readings, not prophecies. Any single poll — especially a surprising one — is most useful as a data point inside an average. The surprising poll gets the headlines precisely because it's surprising, which is to say: unrepresentative, until corroborated.",
          "This is the wire's corroboration rule wearing a different hat: one source is a rumor; one poll is a vibe.",
        ],
      },
    ],
    drill: "Next poll you see, find the margin of error and double it. If the lead fits inside, say out loud: 'coin flip.' Notice how different that feels from the headline.",
  },
  {
    slug: "spotting-a-frame",
    title: "Spotting a frame",
    tease: "Same fact, two headlines. The verb, the actor, and what got left out — the frame is the story about the story.",
    minutes: 5,
    sections: [
      {
        h: "The verb is doing the work",
        body: [
          "'Spending bill passes' vs. 'Blank check rolls on.' Same vote, same numbers, same night. The first verb is neutral machinery; the second is a moral judgment in motion. Verbs smuggle verdicts: 'admits' vs. 'says,' 'slams' vs. 'criticizes,' 'caves' vs. 'compromises.'",
          "Drill the headline down to its verb and ask: could a sworn witness say this? 'Passed' — yes. 'Rolls on' — that's an editorial in a trench coat.",
        ],
      },
      {
        h: "Who got to be the actor?",
        body: [
          "'Police shoot protester' and 'Protester shot in clash with police' describe one event with two different physics. The first has an actor doing a thing; the second has a thing mysteriously happening. Passive voice is how responsibility leaves the room.",
          "Ask of any headline: who is the subject of this sentence — and who benefits from that choice?",
        ],
      },
      {
        h: "The frame is also what's missing",
        body: [
          "Every story is a crop. The tax bill story framed around 'families saving $400' and the same story framed around 'deficit growing $300B' are both true and both incomplete — the frame is the choice of which true thing leads.",
          "This is why the Wire shows you the Lens: the same story through left, center, and right headlines, side by side. Once you've watched a frame change in real time, frames stop working on you unannounced.",
        ],
      },
    ],
    drill: "Take today's top story and rewrite its headline twice: once to flatter each side. Now you know the frame's full range — and where the original sits inside it.",
  },
  {
    slug: "confidence-vs-certainty",
    title: "Confidence vs. certainty",
    tease: "Strong opinions are fine; unlabeled ones aren't. The discipline of saying 'certain / likely / guessing' out loud.",
    minutes: 4,
    sections: [
      {
        h: "The tag changes the thinker",
        body: [
          "Forcing yourself to label every claim — CERTAIN, LIKELY, or GUESSING — does something sneaky: it makes you notice which one you're actually doing. Most takes you hear (and give) are guesses wearing certainty's clothes, because certainty performs better in a room.",
          "The desk lives by this: every prediction on the Ledger carries its confidence the day it's made, and reality grades it later. You can run the same ledger on yourself.",
        ],
      },
      {
        h: "Calibration beats brilliance",
        body: [
          "A person who says 'likely' and is right 70% of the time is more useful than a person who says 'definitely' and is right 80% of the time — because you can BUILD on the first person's words. Being well-calibrated means your 'certains' almost never miss, your 'likelies' usually land, and your 'guesses' are honestly coin-flippy.",
          "The goal isn't fewer opinions. It's opinions you can price.",
        ],
      },
      {
        h: "Changing your mind is the feature",
        body: [
          "If your confidence labels never move when evidence arrives, they were decorations. The whole point of tagging a belief 'LIKELY' is that it has somewhere to go — up to certain, or down to wrong — without your identity going with it.",
          "Tribes can't do this; their certainty is load-bearing. Independents can. It's the entire competitive advantage of thinking alone.",
        ],
      },
    ],
    drill: "For one day, end every opinion you voice with one word: certain, likely, or guessing. Count how often 'guessing' surprises you.",
  },
  {
    slug: "one-source-is-a-rumor",
    title: "One source is a rumor",
    tease: "Forty sites quoting one report is one report. How to count independent confirmation in 30 seconds.",
    minutes: 4,
    sections: [
      {
        h: "Echo isn't evidence",
        body: [
          "A story 'everywhere' can still be a single source. Outlet B 'confirms' by citing outlet A; forty headlines later, the internet believes something exactly one newsroom actually reported. Volume is not corroboration — independence is.",
          "The Wire counts OWNERS, not websites: forty sites under one parent company count once. Do the same by hand: trace the links backward until you hit original reporting. Often the chain has one root.",
        ],
      },
      {
        h: "The 30-second check",
        body: [
          "Open two or three versions of the story. Do they cite the same named source, the same anonymous 'officials,' the same single document? One root = one source = a rumor with reach. Different newsrooms with different named sources saying the same thing = now you have something.",
          "Bonus tell: identical odd phrases across outlets means they're all rewriting the same wire copy, not re-reporting it.",
        ],
      },
      {
        h: "Live with 'developing'",
        body: [
          "The mature response to a single-source story isn't belief or dismissal — it's a tagged hold: 'interesting, unconfirmed, check back.' That's why every story here wears a certainty tag that's pure coverage math: CONFIRMED means 4+ independent owners. Not because corroborated stories are always true — but because uncorroborated ones aren't yet anything.",
        ],
      },
    ],
    drill: "Next viral story: find the root source before you repeat it. If you can't find it in two minutes, that IS the finding.",
  },
  {
    slug: "the-steelman",
    title: "The steelman",
    tease: "Restate the other side so well they'd sign it — then answer. The habit that upgrades every argument you'll have.",
    minutes: 5,
    sections: [
      {
        h: "The opposite of a strawman",
        body: [
          "A strawman is the other side's argument with the brain removed — easy to beat, worthless to beat. A steelman is their argument at its strongest, the version their smartest advocate would actually make. Beating THAT means something; until you can state it, you don't yet disagree with them — you disagree with your sketch of them.",
          "The test is brutal and simple: would they sign your summary of their view? If not, you haven't earned your rebuttal.",
        ],
      },
      {
        h: "Why it's selfish (in the good way)",
        body: [
          "The steelman isn't charity — it's armor. Arguments you've genuinely steelmanned can't ambush you later. And occasionally, mid-steelman, you discover the horrifying thing: they're right about part of it. That discovery is the only way minds actually improve, and tribal media is structurally incapable of providing it.",
          "That's why this site's comment section has the Steelman Gate: to rebut someone, you first restate their point in one sentence, visible above your reply. The room's tone follows the architecture.",
        ],
      },
      {
        h: "The format",
        body: [
          "1) State their claim in your words, at full strength. 2) State the best evidence FOR it — not the average evidence, the best. 3) Only then: where it breaks, and why. Saturday long-forms here run this exact format on one live argument, both directions, before any verdict.",
        ],
      },
    ],
    drill: "Pick a position you're sure is wrong. Write three sentences arguing it that its believers would applaud. Notice where your pen resisted — that's the spot worth examining.",
  },
  {
    slug: "velocity-isnt-importance",
    title: "Velocity isn't importance",
    tease: "Fast-moving isn't heavy. How to tell a story that's spreading from a story that matters.",
    minutes: 4,
    sections: [
      {
        h: "Feeds rank motion; gravity ranks mass",
        body: [
          "Engagement algorithms have one physics: speed. A story spreading fast is 'big' by definition, because spreading is the thing being measured. But a celebrity feud spreads faster than a quiet appropriations rider that reroutes billions — and only one of them touches your life.",
          "GRAVITY, this site's algorithm, deliberately splits the two: velocity is just one signal of five, capped, alongside consequence (people touched, how directly, how long) and power (is institutional power being exercised or checked). The math is public at /gravity — and tunable, so you can feel the difference yourself.",
        ],
      },
      {
        h: "The two questions",
        body: [
          "For any roaring story, ask: Will this matter in 30 days? and To how many people, how directly? A story can fail both and still be fun — fine, enjoy it in the Lobby. The mistake isn't reading light news; it's letting speed impersonate weight.",
        ],
      },
      {
        h: "Watch for the bump-down",
        body: [
          "The clearest tell of a velocity-only story: it vanishes. No resolution, no follow-up, no consequences — it just stops moving and the feed forgets it existed. Heavy stories end differently: with outcomes. (That's why this site runs the Third Act — stories here close, RESOLVED or FADED, on the record.)",
        ],
      },
    ],
    drill: "Tonight, pick the loudest story of the day and set a 30-day reminder. When it fires, check: did it matter? Keep score. Your feed never will.",
  },
];

export function getPrimer(slug: string): Primer | undefined {
  return PRIMERS.find((p) => p.slug === slug);
}
