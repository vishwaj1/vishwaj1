import { useEffect, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { person } from "./copy";
import { formatCardNumber, genericQuestion, parseCardNumber, questionForCard } from "./cards";

const display = { fontFamily: '"Newsreader", "Iowan Old Style", Georgia, serif' } as const;
const sans = { fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", sans-serif' } as const;

/*
 * Form endpoint. Any provider that accepts a JSON POST works.
 * TODO (setup with Formspree, ~2 min):
 *   1. Create a free form at https://formspree.io and copy its endpoint,
 *      e.g. https://formspree.io/f/abcdwxyz
 *   2. Set VITE_CARD_FORM_ENDPOINT=https://formspree.io/f/abcdwxyz in client/.env.local
 *      (Vite's root is client/, so a .env in the repo root is NOT read), and add the
 *      same variable to the host's build env (Vercel / GitHub Actions secrets).
 *   3. Rebuild. Without it, the page shows an "email me" fallback instead.
 */
const endpoint = import.meta.env.VITE_CARD_FORM_ENDPOINT as string | undefined;

const label = "text-[11px] uppercase tracking-[0.22em]";
const field =
  "mt-2 block w-full rounded-none border border-white/20 bg-transparent px-4 py-3 text-base text-[#f3eee6] placeholder:text-[#f3eee6]/40 focus:border-[#e2a15a] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a15a]";
const secondaryBtn =
  "flex min-h-[48px] items-center justify-center border border-white/25 px-4 py-3 text-[12px] uppercase tracking-[0.16em] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]";

type Status = "idle" | "sending" | "done" | "error";

export default function Hi({ params }: { params?: { n?: string } }) {
  const reduced = useReducedMotion() ?? false;
  const card = parseCardNumber(params?.n);
  const question = card ? questionForCard(card) : genericQuestion;
  const cardLabel = card ? formatCardNumber(card) : null;

  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [share, setShare] = useState(false);
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const previous = document.title;
    document.title = cardLabel ? `Card ${cardLabel} · Vishwanth Reddy` : "Hi · Vishwanth Reddy";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      document.title = previous;
    };
  }, [cardLabel]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!endpoint || status === "sending" || !answer.trim()) return;
    if (honey) {
      // Bot filled the hidden field: pretend success, send nothing.
      setStatus("done");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          card: cardLabel ?? "none",
          question,
          answer: answer.trim(),
          name: name.trim(),
          email: email.trim(),
          shareFirstNamePublicly: share,
          submittedAt: new Date().toISOString(),
        }),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const fade = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div style={{ ...sans, color: "#f3eee6" }} className="min-h-[100svh] bg-[#13110f]">
      <main className="mx-auto w-full max-w-xl overflow-x-hidden px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-16">
        {/* a. Who I am */}
        <motion.header {...fade(0)}>
          <h1 className="text-[clamp(2.5rem,12vw,4rem)] leading-[0.9] tracking-[-0.03em]" style={display}>
            {person.name}
          </h1>
          <p className={`mt-3 ${label} opacity-70`}>Software Engineer</p>
          <p className="mt-4 text-xl leading-snug opacity-90" style={display}>
            {person.line}
          </p>
        </motion.header>

        {/* b. The card and its question */}
        <motion.section {...fade(0.15)} className="mt-8 border-t border-[#e2a15a] pt-5" aria-labelledby="card-q">
          <p className={`${label} text-[#e2a15a]`}>{cardLabel ? `You have card no. ${cardLabel}` : "Hi, nice to meet you"}</p>
          <h2 id="card-q" className="mt-3 text-[1.75rem] leading-[1.15] sm:text-4xl" style={display}>
            {question}
          </h2>
        </motion.section>

        {/* c. Answer box */}
        <section className="mt-6" aria-label="Your answer">
          {status === "done" ? (
            <div role="status" className="border border-[#e2a15a] px-4 py-6">
              <p className="text-2xl leading-snug" style={display}>
                Got it. Thank you.
              </p>
              <p className="mt-2 opacity-75">
                {email.trim() ? "I'll write back." : "If you want a reply, email me anytime."} Pass the card on to someone building something hard.
              </p>
            </div>
          ) : !endpoint ? (
            <div role="note" className="border border-white/20 px-4 py-5">
              <p className="leading-relaxed opacity-85">
                The answer box isn't live yet. Email your answer to{" "}
                <a className="text-[#e2a15a] underline underline-offset-4" href={`mailto:${person.email}?subject=${encodeURIComponent(cardLabel ? `Card ${cardLabel}` : "Hi")}`}>
                  {person.email}
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate={false} className="space-y-5">
              <div>
                <label htmlFor="hi-answer" className={`${label} opacity-70`}>
                  Your answer
                </label>
                <textarea
                  id="hi-answer"
                  name="answer"
                  required
                  rows={4}
                  maxLength={1500}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="One line is plenty."
                  autoCapitalize="sentences"
                  className={`${field} resize-none`}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="hi-name" className={`${label} opacity-70`}>
                    Name (optional)
                  </label>
                  <input
                    id="hi-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="hi-email" className={`${label} opacity-70`}>
                    Email (optional)
                  </label>
                  <input
                    id="hi-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="send"
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                  />
                </div>
              </div>
              {/* Honeypot: hidden from people, tempting to bots. */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honey}
                onChange={(e) => setHoney(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <label htmlFor="hi-share" className="flex min-h-[48px] cursor-pointer items-start gap-3 py-1">
                <input
                  id="hi-share"
                  type="checkbox"
                  checked={share}
                  onChange={(e) => setShare(e.target.checked)}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-[#e2a15a]"
                />
                <span className="text-base leading-snug opacity-85">OK to share my answer publicly (first name only)</span>
              </label>
              <button
                type="submit"
                disabled={status === "sending" || !answer.trim()}
                className="min-h-[52px] w-full bg-[#e2a15a] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#1c1917] active:bg-[#efb56e] disabled:opacity-50 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3eee6]"
              >
                {status === "sending" ? "Sending…" : "Send"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-base leading-snug">
                  That didn't go through. Try again, or email{" "}
                  <a className="text-[#e2a15a] underline underline-offset-4" href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </section>

        {/* d. Primary actions. Amber is reserved for the answer button above. */}
        <nav className="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Contact">
          <a className={secondaryBtn} href={person.calendly} target="_blank" rel="noreferrer">
            Book a call
          </a>
          <a className={secondaryBtn} href={person.linkedin} target="_blank" rel="noreferrer">
            Connect on LinkedIn
          </a>
          <a className={secondaryBtn} href={person.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a className={secondaryBtn} href={`mailto:${person.email}`}>
            Email
          </a>
        </nav>

        {/* e. Low-key note */}
        <p className="mt-8 text-base leading-relaxed opacity-75">
          I'm open to forward-deployed and product engineering roles, especially where engineers work next to the people using the thing.
        </p>

        {/* TODO: "where this card has been" travel map / counter slots in here.
            Needs persistent storage (e.g. a per-card visit count), so it is out of scope for now. */}

        {/* f. Footer */}
        <footer className="mt-12 border-t border-white/10 pt-5">
          <Link href="/" className={`inline-flex min-h-[44px] items-center ${label} text-[#e2a15a] hover:underline`}>
            See the main site
          </Link>
        </footer>
      </main>
    </div>
  );
}
