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
  { id: "surprised", text: "What's the last thing that genuinely surprised you?", chips: ["A person", "A machine", "Myself"], mine: "How often the right fix turned out to be a conversation, not code." },
  { id: "hardest-problem", text: "What's the hardest problem on your plate this month?", chips: ["People, not the work", "Scope", "Knowing what matters"], mine: "Explaining in one sentence what a forward-deployed engineer actually does." },
  { id: "lost-time", text: "When did you last lose track of time?", chips: ["Debugging", "A conversation", "A book"], mine: "Wiring up the twentieth tool and watching the agent finally use it right." },
  // NEEDS-VERIFY
  { id: "small-improvement", text: "What's the smallest thing that improved your week?", chips: ["Deleting an app", "A real lunch", "A walk"], mine: "Writing the day's three things on paper before opening the laptop." },
  { id: "free-week", text: "What would you build with one free week?", chips: ["Useless and beautiful", "What nobody will fund", "An old unfinished thing"], mine: "Something that reads a contract and tells you only what changed." },
  { id: "overrated", text: "What's overrated in your field?", chips: ["Meetings about meetings", "The newest tool", "Moving fast"], mine: "Demos. Anyone can demo. Fifty real users is the hard part." },
  { id: "skill-if-free", text: "What's a skill you'd learn if time were free?", chips: ["An instrument", "A language", "Something with my hands"], mine: "To dance." },
  { id: "unreasonably-good", text: "What's a small thing you're unreasonably good at?", chips: ["Parallel parking", "Remembering names", "Packing light"], mine: "Finding the one line in a four-hundred-line log that actually matters." },
  { id: "cant-stop", text: "What are you working on that you can't stop thinking about?", chips: ["Something at work", "A side project", "Nothing, and that's fine"], mine: "How to let an agent act without ever letting it act alone." },
  // NEEDS-VERIFY
  { id: "curious-outside-work", text: "What are you curious about that has nothing to do with work?", chips: ["Space", "How cities work", "Fermentation"], mine: "How cities decide where to put things." },
  { id: "worth-slowly", text: "What's worth doing slowly?", chips: ["Hiring", "Writing", "Cooking"], mine: "Deciding what the first version is. Everything after that can be fast." },
  // NEEDS-VERIFY
  { id: "made-by-hand", text: "What's the last thing you made with your hands?", chips: ["Food", "Furniture", "Nothing lately"], mine: "Dinner, badly." },
  { id: "job-misunderstood", text: "What do people get wrong about your job?", chips: ["That it's typing", "That it's solitary", "That it's logical"], mine: "They think it's building software. Most of it is working out what's actually being asked." },
  { id: "taught-me-most", text: "Who taught you the most, and didn't know it?", chips: ["A colleague", "A stranger", "Someone I argued with"], mine: "A lawyer who kept saying “that's not how it works” until I understood why." },
  // NEEDS-VERIFY
  { id: "nobody-uses", text: "What's the best thing you've made that nobody uses?", chips: ["A tool for one", "A script I still use", "Several, honestly"], mine: "A small tool I built for one person, who then changed jobs." },
  { id: "five-years-ago", text: "What do you wish someone had told you five years ago?", chips: ["Ask sooner", "Nobody's watching", "It compounds"], mine: "You can just go and talk to the people who use the thing." },
  { id: "automate-forever", text: "What's one thing you'd automate forever?", chips: ["Status updates", "Expenses", "Scheduling"], mine: "Chasing signatures." },
  { id: "changed-mind", text: "What's a belief you've changed your mind about?", chips: ["How teams work", "What good work is", "Remote vs in person"], mine: "I used to think good specs came first. They come from sitting with the work." },
  { id: "better-than-last-year", text: "What are you better at than you were a year ago?", chips: ["Saying no", "Shipping early", "Listening"], mine: "Asking the dumb question early instead of the smart one late." },
  { id: "remembered-for", text: "What would you want to be remembered for at work?", chips: ["Made things easier", "One thing that lasted", "Being the calm one"], mine: "That what I built was still standing after I left." },
  { id: "decade-problem", text: "What's a problem you'd happily spend a decade on?", chips: ["Making something less awful", "Teaching", "Something small and deep"], mine: "Making legal work feel less like paperwork and more like progress." },
  { id: "if-nobody-judged", text: "What would you do differently if nobody judged it?", chips: ["Start over", "Say the obvious thing", "Work less, think more"], mine: "Ship the rough version on day one and let people argue with it." },
  { id: "ignored-advice", text: "What's the best advice you ignored?", chips: ["Play it safe", "Specialize", "Wait your turn"], mine: "Pick one stack and stay in it." },
  // NEEDS-VERIFY
  { id: "bad-job", text: "What's the most useful thing you learned from a bad job?", chips: ["What not to do", "How to leave", "Who I am under pressure"], mine: "A process nobody questions is usually the real bug." },
  { id: "this-year", text: "What are you hoping happens this year?", chips: ["A change", "Something steady", "No idea yet"], mine: "Landing somewhere I get to sit with customers again." },
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
