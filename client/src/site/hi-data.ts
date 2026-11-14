/**
 * Data layer for the /hi pages: Supabase (anon key, client-side only),
 * analytics, and small helpers. Every function degrades to a harmless no-op
 * or null so the page never shows a broken state.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True only when both env vars are set. Gate the counter and the wall on this. */
export const backendEnabled = Boolean(url && anonKey);

let clientPromise: Promise<SupabaseClient> | null = null;

/** Lazy-loaded so the supabase bundle never blocks first paint on a weak connection. */
function getClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url as string, anonKey as string, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }),
    );
  }
  return clientPromise;
}

/** Reject after `ms` so nothing on the page can spin forever on bad wifi. */
function withTimeout<T>(promise: PromiseLike<T>, ms = 5000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// ---------------------------------------------------------------- local flags
const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* private mode: fine, we just lose de-duplication */
    }
  },
};

export const localFlags = {
  scanKey: (card: number) => `hi:scan:${card}`,
  get: safeStorage.get,
  set: safeStorage.set,
};

// ---------------------------------------------------------------- scans
export type ScanResult = { count: number; isNew: boolean };

/**
 * Counts this browser once per card (localStorage), but always returns the live
 * count. Returns null on any failure.
 */
export async function loadScan(card: number): Promise<ScanResult | null> {
  if (!backendEnabled) return null;
  const isNew = !localFlags.get(localFlags.scanKey(card));
  try {
    const supabase = await getClient();
    const { data, error } = await withTimeout(
      supabase.rpc("register_scan", { card, record: isNew }),
    );
    if (error || typeof data !== "number") return null;
    // A remembered scan that the server no longer has (e.g. data was reset): count this visit again.
    if (!isNew && data < 1) {
      const retry = await withTimeout(supabase.rpc("register_scan", { card, record: true }));
      if (retry.error || typeof retry.data !== "number") return null;
      return { count: retry.data, isNew: true };
    }
    if (isNew) localFlags.set(localFlags.scanKey(card), String(data));
    return { count: data, isNew };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- answers
/** What this browser remembers about its own answer to a card. */
export type MyAnswer = { token: string; answer: string; firstName: string };

const mineKey = (card: number) => `hi:mine:${card}`;

export function readMine(card: number): MyAnswer | null {
  try {
    const raw = localFlags.get(mineKey(card));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MyAnswer>;
    if (typeof parsed.token === "string" && typeof parsed.answer === "string") {
      return { token: parsed.token, answer: parsed.answer, firstName: parsed.firstName ?? "" };
    }
  } catch {
    /* corrupt value: treat as no answer */
  }
  return null;
}

function writeMine(card: number, value: MyAnswer | null) {
  try {
    if (value) window.localStorage.setItem(mineKey(card), JSON.stringify(value));
    else window.localStorage.removeItem(mineKey(card));
  } catch {
    /* private mode: edits still work this visit */
  }
}

/** Random secret that proves ownership of an answer. Never displayed, never readable back. */
function newToken(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c?.randomUUID) return c.randomUUID();
  const b = new Uint8Array(16);
  c?.getRandomValues ? c.getRandomValues(b) : b.forEach((_, i) => (b[i] = Math.floor(Math.random() * 256)));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export type NewAnswer = {
  card: number;
  questionId: string;
  answer: string;
  firstName?: string;
  email?: string;
};

/** CREATE. Returns the saved record, or null on failure. */
export async function submitAnswer(input: NewAnswer, existingToken?: string): Promise<MyAnswer | null> {
  if (!backendEnabled) return null;
  const token = existingToken ?? newToken();
  try {
    const supabase = await getClient();
    // No .select(): anon cannot read the answers table, and must not try.
    const { error } = await withTimeout(
      supabase.from("answers").insert({
        card_number: input.card,
        question_id: input.questionId,
        answer: input.answer.slice(0, 140),
        first_name: input.firstName?.trim().slice(0, 40) || null,
        email: input.email?.trim().slice(0, 120) || null,
        is_public: true,
        owner_token: token,
      }),
    );
    if (error) return null;
    const mine = { token, answer: input.answer.slice(0, 140), firstName: input.firstName?.trim().slice(0, 40) ?? "" };
    writeMine(input.card, mine);
    return mine;
  } catch {
    return null;
  }
}

/** UPDATE own answer. "missing" means the row is gone (e.g. moderated), so the caller can re-create it. */
export async function updateAnswer(
  card: number,
  mine: MyAnswer,
  answer: string,
  firstName = "",
): Promise<"ok" | "missing" | "error"> {
  if (!backendEnabled) return "error";
  try {
    const supabase = await getClient();
    const { data, error } = await withTimeout(
      supabase.rpc("update_my_answer", {
        token: mine.token,
        new_answer: answer.slice(0, 140),
        new_first_name: firstName.trim().slice(0, 40) || null,
      }),
    );
    if (error) return "error";
    if (data !== true) return "missing";
    writeMine(card, { token: mine.token, answer: answer.slice(0, 140), firstName: firstName.trim().slice(0, 40) });
    return "ok";
  } catch {
    return "error";
  }
}

/** DELETE own answer. Clears the local copy once the server confirms (or the row was already gone). */
export async function removeAnswer(card: number, mine: MyAnswer): Promise<boolean> {
  if (!backendEnabled) return false;
  try {
    const supabase = await getClient();
    const { error } = await withTimeout(supabase.rpc("delete_my_answer", { token: mine.token }));
    if (error) return false;
    writeMine(card, null);
    return true;
  } catch {
    return false;
  }
}

export type WallEntry = { first_name: string | null; answer: string; city: string | null; created_at: string };

/** Latest public answers for a question, from the safe view. Never touches email. */
export async function loadWall(questionId: string, limit = 8): Promise<WallEntry[] | null> {
  if (!backendEnabled) return null;
  try {
    const supabase = await getClient();
    const { data, error } = await withTimeout(
      supabase
        .from("answers_public")
        .select("first_name, answer, city, created_at")
        .eq("question_id", questionId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );
    if (error || !data) return null;
    return data as WallEntry[];
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- profanity
// Deliberately small. It only has to stop the obvious; `hidden` handles the rest.
const blocked = [
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt", "piss", "slut", "whore",
  "nigg", "fag", "retard", "porn", "nazi",
];

export function looksProfane(text: string): boolean {
  const flat = text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[^a-z]/g, "");
  return blocked.some((word) => flat.includes(word));
}

// ---------------------------------------------------------------- analytics
type Umami = { track: (event: string, data?: Record<string, unknown>) => void };

export function track(event: string, data?: Record<string, unknown>) {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch {
    /* analytics must never break the page */
  }
}

// ---------------------------------------------------------------- misc
export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

// ---------------------------------------------------------------- card content
export type CardContent = {
  question_id: string;
  sort_order: number;
  question: string;
  chips: string[];
  mine: string;
};

/**
 * The 25 questions as they currently stand in Supabase, so chips and answers
 * can be edited without a deploy. Returns null when the backend is off, slow
 * or empty: callers keep the copy baked into cards.ts, which always renders
 * first so the question never waits on the network.
 */
export async function loadCardContent(): Promise<CardContent[] | null> {
  if (!backendEnabled) return null;
  try {
    const supabase = await getClient();
    const { data, error } = await withTimeout(
      supabase
        .from("card_content")
        .select("question_id,sort_order,question,chips,mine")
        .order("sort_order"),
    );
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return data as CardContent[];
  } catch {
    return null;
  }
}
