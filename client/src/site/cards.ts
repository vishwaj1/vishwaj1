/**
 * Questions printed on the back of the 100 business cards, each with three
 * tap-to-answer chips and Vishwanth's own one-line answer.
 *
 * Card n gets questions[(n - 1) % questions.length]: deterministic, and with
 * 25 questions every one appears on exactly 4 cards, while any run of 25
 * consecutive cards covers all 25 without repeating. Work-leaning questions
 * are spread through the order so cards handed out at the same event don't
 * all ask about work.
 *
 * This file is the offline fallback and the source of the printed text. The
 * same rows live in Supabase (public.card_content) so chips and answers can
 * be edited without a deploy; the page renders this instantly, then
 * reconciles. Keep the two in step when you change anything here.
 *
 * `mine` is revealed only after the visitor answers. Reciprocal disclosure is
 * what makes people willing to share (Aron's "fast friends" effect), so it
 * must be true and in his voice. Lines marked NEEDS-VERIFY are drafts.
 */
export type Question = {
  /** Stable id stored with each answer. Never rename once cards are printed. */
  id: string;
  text: string;
  chips: readonly [string, string, string];
  /** Vishwanth's answer, shown after the visitor answers. */
  mine: string;
};

export const questions: readonly Question[] = [
  { id: "surprised", text: "What's the last thing that genuinely surprised you?", chips: ["A person who did the opposite of what I expected", "A machine doing something I never built in", "How much I'd changed without noticing"], mine: "How often the right fix turned out to be a conversation, not code." },
  { id: "hardest-problem", text: "What's the hardest problem on your plate this month?", chips: ["Getting everyone to agree on what we're building", "Too much to do and no clear order", "Working out which problem actually matters"], mine: "Explaining, in one sentence, what a forward-deployed engineer actually does." },
  { id: "lost-time", text: "When did you last lose track of time?", chips: ["Chasing a bug I refused to walk away from", "A conversation that ran three hours", "A book I opened for five minutes"], mine: "Wiring up the twentieth tool and watching the agent finally use it right." },
  // NEEDS-VERIFY
  { id: "small-improvement", text: "What's the smallest thing that improved your week?", chips: ["Deleting one app from my phone", "Eating lunch away from my desk", "A walk with no podcast"], mine: "Writing the day's three things on paper before opening the laptop." },
  { id: "free-week", text: "What would you build with one free week?", chips: ["Something useless and beautiful", "The thing nobody would fund", "Finish the project I abandoned"], mine: "A tool that reads a contract and tells you only what changed." },
  { id: "overrated", text: "What's overrated in your field?", chips: ["Meetings about the meeting", "Whatever tool launched this week", "Moving fast with nothing to show"], mine: "Demos. Anyone can demo; getting fifty real people to use it is the hard part." },
  { id: "skill-if-free", text: "What's a skill you'd learn if time were free?", chips: ["An instrument, played properly", "A language, enough to joke in", "Something with my hands, like pottery"], mine: "Dancing. I'd happily be bad at it for years." },
  { id: "unreasonably-good", text: "What's a small thing you're unreasonably good at?", chips: ["Parallel parking on the first try", "Remembering a name after one meeting", "Packing for a week in one bag"], mine: "Finding the one line in a four-hundred-line log that actually matters." },
  { id: "cant-stop", text: "What are you working on that you can't stop thinking about?", chips: ["A problem at work I can't put down", "A side project, usually at 11pm", "Nothing, honestly. I switch off fine"], mine: "How to let an agent act without ever letting it act alone." },
  // NEEDS-VERIFY
  { id: "curious-outside-work", text: "What are you curious about that has nothing to do with work?", chips: ["Space, and how big it really is", "How cities decide where things go", "The chemistry of fermentation"], mine: "How cities decide where to put things." },
  { id: "worth-slowly", text: "What's worth doing slowly?", chips: ["Hiring someone you'll work with for years", "Writing something you actually mean", "Cooking a meal for people you like"], mine: "Deciding what the first version is. After that, everything can be fast." },
  // NEEDS-VERIFY
  { id: "made-by-hand", text: "What's the last thing you made with your hands?", chips: ["A proper meal, from scratch", "Something fixed with tape and optimism", "Nothing lately, and I miss it"], mine: "Dinner, badly." },
  { id: "job-misunderstood", text: "What do people get wrong about your job?", chips: ["That it's mostly typing code", "That I work alone all day", "That it's all logic and no judgment"], mine: "That it's building software. Most of it is working out what's actually being asked." },
  { id: "taught-me-most", text: "Who taught you the most, and didn't know it?", chips: ["A colleague who never meant to teach me", "A stranger who said one useful sentence", "Someone I argued with and lost to"], mine: "A lawyer who kept saying \"that's not how it works\" until I understood why." },
  // NEEDS-VERIFY
  { id: "nobody-uses", text: "What's the best thing you've made that nobody uses?", chips: ["A tool I built for exactly one person", "A script only I still run", "Several, honestly. Don't ask"], mine: "A small tool I built for one person, who then changed jobs." },
  { id: "five-years-ago", text: "What do you wish someone had told you five years ago?", chips: ["Ask the question sooner", "Nobody is watching as closely as you think", "Small habits beat raw talent"], mine: "You can just go and talk to the people who use the thing." },
  { id: "automate-forever", text: "What's one thing you'd automate forever?", chips: ["Every status update, forever", "Expense reports and receipts", "Scheduling across time zones"], mine: "Chasing signatures." },
  { id: "changed-mind", text: "What's a belief you've changed your mind about?", chips: ["I used to think more process meant better teams", "I used to think busy meant productive", "I used to think the plan comes before the work"], mine: "I used to think good specs came first. They come from sitting with the work." },
  { id: "better-than-last-year", text: "What are you better at than you were a year ago?", chips: ["Saying no without a long apology", "Shipping the rough version early", "Listening before I answer"], mine: "Asking the dumb question early instead of the smart one late." },
  { id: "remembered-for", text: "What would you want to be remembered for at work?", chips: ["Making hard things feel easy for others", "One thing I built that lasted", "Being the calm one when things broke"], mine: "That what I built was still standing after I left." },
  { id: "decade-problem", text: "What's a problem you'd happily spend a decade on?", chips: ["Making something everyone hates less awful", "Teaching people something that sticks", "One small thing, understood deeply"], mine: "Making legal work feel less like paperwork and more like progress." },
  { id: "if-nobody-judged", text: "What would you do differently if nobody judged it?", chips: ["Start the whole thing over, simpler", "Say the obvious thing out loud", "Work less and think more"], mine: "Ship the rough version on day one and let people argue with it." },
  { id: "ignored-advice", text: "What's the best advice you ignored?", chips: ["\"Play it safe.\" I didn't", "\"Pick a lane.\" I didn't", "\"Wait your turn.\" I didn't"], mine: "\"Pick one stack and stay in it.\"" },
  // NEEDS-VERIFY
  { id: "bad-job", text: "What's the most useful thing you learned from a bad job?", chips: ["What not to do, in detail", "How to leave well", "How I behave under pressure"], mine: "A process nobody questions is usually the real bug." },
  { id: "this-year", text: "What are you hoping happens this year?", chips: ["A change I've been putting off", "Something steady and good", "I honestly don't know yet"], mine: "Landing somewhere I get to sit with customers again." },
];

/** Shown on /hi, and for any card number that is missing or out of range. */
export const genericQuestion: Question = {
  id: "generic",
  text: "What is something you are working on that you wish went faster?",
  chips: ["A side project", "Something at work", "My own habits"],
  mine: "Getting software in front of the people who have to live with it.",
};

export const CARD_COUNT = 100;

/** Parse the :n route param. Returns 1..CARD_COUNT, or null for anything else. */
export function parseCardNumber(raw: string | undefined | null): number | null {
  if (!raw || !/^\d{1,3}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 && n <= CARD_COUNT ? n : null;
}

export function questionForCard(n: number): Question {
  return questions[(n - 1) % questions.length];
}

/** 47 -> "047" */
export function formatCardNumber(n: number): string {
  return String(n).padStart(3, "0");
}
