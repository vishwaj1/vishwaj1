/**
 * Questions printed on the back of the 100 business cards.
 * Card n gets questions[(n - 1) % questions.length]: deterministic, and with
 * 25 questions every one appears on exactly 4 cards. Neighbouring cards always
 * differ, so people handing out a few in a row show different questions.
 */
export const questions = [
  // Work-leaning (9)
  "What is your team building right now?",
  "What is the most annoying manual process at your job?",
  "What is a workflow you wish someone would just fix?",
  "What is the hardest thing you are working on this month?",
  "What tool do you wish existed at work?",
  "What is something your team does in a spreadsheet that it should not?",
  "What is the best thing you have shipped lately?",
  "What would you hand off to a new hire on day one?",
  "What problem keeps coming back no matter how many times you fix it?",
  // Curious / human (16)
  "What is something you learned recently that surprised you?",
  "What is a small thing that made your week better?",
  "Who taught you the most about how to work?",
  "What is a skill you picked up outside of work?",
  "What is the best advice you have ignored?",
  "What are you looking forward to this year?",
  "What is a book, show or song you keep coming back to?",
  "What did you want to be when you were ten?",
  "What is something you are proud of that nobody asked about?",
  "What is the best meal you have had this year?",
  "What is a place you would go back to tomorrow?",
  "What is a question you wish people asked you more?",
  "What is something you changed your mind about?",
  "What is one thing you would do with an extra free hour a day?",
  "What is a habit that has quietly helped you?",
  "What is the kindest thing someone did for you at work?",
] as const;

/** Shown on /hi, and for any card number that is missing or out of range. */
export const genericQuestion = "What is something you are working on that you wish went faster?";

export const CARD_COUNT = 100;

/** Parse the :n route param. Returns 1..CARD_COUNT, or null for anything else. */
export function parseCardNumber(raw: string | undefined | null): number | null {
  if (!raw || !/^\d{1,3}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 && n <= CARD_COUNT ? n : null;
}

export function questionForCard(n: number): string {
  return questions[(n - 1) % questions.length];
}

/** 47 -> "047" */
export function formatCardNumber(n: number): string {
  return String(n).padStart(3, "0");
}
