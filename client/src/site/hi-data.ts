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
  answeredKey: (card: number) => `hi:answered:${card}`,
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
    if (isNew) localFlags.set(localFlags.scanKey(card), String(data));
    return { count: data, isNew };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- answers
export type NewAnswer = {
  card: number;
  questionId: string;
  answer: string;
  firstName?: string;
  email?: string;
};

export async function submitAnswer(input: NewAnswer): Promise<boolean> {
  if (!backendEnabled) return false;
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
      }),
    );
    if (error) return false;
    localFlags.set(localFlags.answeredKey(input.card), "1");
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
