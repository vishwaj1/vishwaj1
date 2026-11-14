/**
 * Questions printed on the back of the 100 business cards, each with three
 * tap-to-answer chips. Card n gets questions[(n - 1) % questions.length]:
 * deterministic, and with 25 questions every one appears on exactly 4 cards.
 * Work-leaning and human questions are interleaved (every third is work).
 */
export type Question = {
  /** Stable id stored with each answer. Never rename once cards are printed. */
  id: string;
  text: string;
  chips: readonly [string, string, string];
};

const work: Question[] = [
  { id: "team-building", text: "What is your team building right now?", chips: ["Something customers asked for", "A scary rewrite", "Still figuring it out"] },
  { id: "manual-process", text: "What is the most annoying manual process at your job?", chips: ["Copy-pasting between tabs", "Chasing approvals", "Reports nobody reads"] },
  { id: "fix-workflow", text: "What is a workflow you wish someone would just fix?", chips: ["Onboarding new people", "Anything in a spreadsheet", "Handoffs between teams"] },
  { id: "hardest-thing", text: "What is the hardest thing you are working on this month?", chips: ["Getting people to agree", "A deadline that won't move", "Finding the real problem"] },
  { id: "tool-wish", text: "What tool do you wish existed at work?", chips: ["One search for everything", "Meeting notes that act", "Undo for everything"] },
  { id: "spreadsheet", text: "What does your team do in a spreadsheet that it should not?", chips: ["Run the whole company", "Track customers", "Plan the roadmap"] },
  { id: "shipped-lately", text: "What is the best thing you have shipped lately?", chips: ["A tiny fix that mattered", "A feature nobody asked for", "The thing I almost didn't ship"] },
  { id: "day-one", text: "What would you hand a new hire on day one?", chips: ["The scary legacy code", "One small, real win", "The docs I never wrote"] },
  { id: "keeps-returning", text: "What problem keeps coming back no matter how often you fix it?", chips: ["Flaky anything", "Unclear ownership", "Same bug, new costume"] },
];

const human: Question[] = [
  { id: "free-week", text: "What would you build with one free week?", chips: ["Something useless and beautiful", "The thing at work nobody will fund", "Finally finish an old project"] },
  { id: "recently-learned", text: "What is something you learned recently that surprised you?", chips: ["Sleep beats caffeine", "Asking beats guessing", "I need less than I think"] },
  { id: "small-win-week", text: "What is a small thing that made your week better?", chips: ["A really good coffee", "A walk outside", "A friend's random text"] },
  { id: "taught-me-work", text: "Who taught you the most about how to work?", chips: ["A tough manager", "A patient teammate", "My parents"] },
  { id: "outside-skill", text: "What is a skill you picked up outside of work?", chips: ["Cooking for crowds", "Something with my hands", "Another language"] },
  { id: "ignored-advice", text: "What is the best advice you have ignored?", chips: ["Take more breaks", "Slow down", "Don't take it personally"] },
  { id: "looking-forward", text: "What are you looking forward to this year?", chips: ["One big trip", "Shipping something big", "Honestly, rest"] },
  { id: "comfort-media", text: "What is a book, show or song you keep coming back to?", chips: ["A comfort show", "One album on repeat", "A book I reread"] },
  { id: "age-ten", text: "What did you want to be when you were ten?", chips: ["An astronaut", "A pro athlete", "A game designer"] },
  { id: "quiet-pride", text: "What is something you are proud of that nobody asked about?", chips: ["A hard thing I finished", "How I handled a bad day", "A quiet personal win"] },
  { id: "best-meal", text: "What is the best meal you have had this year?", chips: ["Something my family made", "Street food", "A random Tuesday dinner"] },
  { id: "go-back", text: "What is a place you would go back to tomorrow?", chips: ["A beach, any beach", "Somewhere with mountains", "My hometown"] },
  { id: "ask-me-more", text: "What is a question you wish people asked you more?", chips: ["How are you, really?", "What are you building?", "What's next for you?"] },
  { id: "changed-mind", text: "What is something you changed your mind about?", chips: ["Remote work", "Meetings", "What success means"] },
  { id: "quiet-habit", text: "What is a habit that has quietly helped you?", chips: ["Writing things down", "Morning walks", "Saying no more"] },
  { id: "kindest-work", text: "What is the kindest thing someone did for you at work?", chips: ["Gave me a chance", "Covered for me", "Said it was okay to ask"] },
];

// Every third slot is a work question (9 work + 16 human = 25).
export const questions: readonly Question[] = Array.from({ length: work.length + human.length }, (_, i) =>
  i % 3 === 0 ? work[i / 3] : human[i - Math.floor(i / 3) - 1],
);

/** Shown on /hi, and for any card number that is missing or out of range. */
export const genericQuestion: Question = {
  id: "generic",
  text: "What is something you are working on that you wish went faster?",
  chips: ["A side project", "Something at work", "My own habits"],
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
