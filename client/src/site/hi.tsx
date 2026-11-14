import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import photoSmall from "@/assets/profile-sm.jpg";
import { lexsyBeats, person } from "./copy";
import { formatCardNumber, genericQuestion, parseCardNumber, questionForCard } from "./cards";
import {
  backendEnabled,
  loadScan,
  loadWall,
  localFlags,
  looksProfane,
  ordinal,
  submitAnswer,
  track,
  type ScanResult,
  type WallEntry,
} from "./hi-data";

const display = { fontFamily: '"Newsreader", "Iowan Old Style", Georgia, serif' } as const;
const sans = { fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", sans-serif' } as const;

const SITE_ORIGIN = "https://vishwanth.dev";

// Small tracked uppercase label, same treatment as "SCROLL THE ROOM" on the homepage.
const label = "text-[11px] uppercase tracking-[0.22em]";
const field =
  "mt-2 block w-full rounded-none border border-white/20 bg-transparent px-4 py-3 text-base text-[#f3eee6] placeholder:text-[#f3eee6]/40 focus:border-[#f3eee6] focus:outline-none";
const outlined =
  "flex min-h-[52px] w-full items-center justify-center border border-white/25 px-4 py-3 text-[12px] uppercase tracking-[0.16em] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]";

/** Counts 0 -> `to` once, briefly. Static when reduced motion is on. */
function CountUp({ to, reduced, render }: { to: number; reduced: boolean; render: (n: number) => string }) {
  const [value, setValue] = useState(reduced ? to : 1);
  useEffect(() => {
    if (reduced || to <= 1) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.max(1, Math.round(eased * to)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, reduced]);
  return <span className="tabular-nums">{render(value)}</span>;
}

function scanCopy(scan: ScanResult, n: number): string {
  if (scan.isNew) {
    return scan.count === 1 && n === 1
      ? "You're the first person to open this card"
      : `You're the ${ordinal(n)} person to open this card`;
  }
  return scan.count === 1 ? "Only you have opened this card so far" : `${n} people have opened this card`;
}

export default function Hi({ params }: { params?: { n?: string } }) {
  const reduced = useReducedMotion() ?? false;
  const card = parseCardNumber(params?.n);
  const cardLabel = card ? formatCardNumber(card) : null;
  const question = card ? questionForCard(card) : genericQuestion;
  const cardUrl = `${SITE_ORIGIN}/hi${card ? `/${cardLabel}` : ""}`;

  const [scan, setScan] = useState<ScanResult | null>(null);
  const [answered, setAnswered] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // the chip text being sent
  const [error, setError] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [wall, setWall] = useState<WallEntry[] | null>(null);
  const [shareNote, setShareNote] = useState("");
  const [barVisible, setBarVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLInputElement>(null);
  const trackedWall = useRef(false);

  // Title, scroll reset, scan analytics, scan counter, remembered answer.
  useEffect(() => {
    const previous = document.title;
    document.title = cardLabel ? `Card ${cardLabel} · Vishwanth Reddy` : "Hi · Vishwanth Reddy";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (card) track("card_scan", { card: cardLabel });

    let cancelled = false;
    setScan(null);
    setWall(null);
    setError("");
    setCustomOpen(false);
    trackedWall.current = false;
    const before = card ? localFlags.get(localFlags.answeredKey(card)) : null;
    setAnswered(before && before !== "1" ? before : before ? "…" : null);
    if (card) {
      loadScan(card).then((result) => {
        if (!cancelled) setScan(result);
      });
    }
    return () => {
      cancelled = true;
      document.title = previous;
    };
  }, [card, cardLabel]);

  // Reveal the wall once answered (this visit or an earlier one).
  useEffect(() => {
    if (!answered || !backendEnabled) return;
    let cancelled = false;
    loadWall(question.id).then((entries) => {
      if (cancelled || !entries) return;
      setWall(entries);
      if (!trackedWall.current) {
        trackedWall.current = true;
        track("wall_viewed", { card: cardLabel });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [answered, question.id, cardLabel]);

  // Sticky bar: appears once the hero has scrolled out of view.
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setBarVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ...and hides while a text field is focused so it never fights the keyboard.
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const send = useCallback(
    async (text: string, kind: "chip_answer" | "custom_answer") => {
      if (!card || busy) return;
      setError("");
      setBusy(text);
      const ok = await submitAnswer({
        card,
        questionId: question.id,
        answer: text,
        firstName: kind === "custom_answer" ? firstName : undefined,
        email: kind === "custom_answer" ? email : undefined,
      });
      setBusy(null);
      if (!ok) {
        setError("That didn't save. Check your connection and tap again.");
        return;
      }
      localFlags.set(localFlags.answeredKey(card), text);
      track(kind, { card: cardLabel, question: question.id });
      setAnswered(text);
    },
    [card, busy, question.id, cardLabel, firstName, email],
  );

  function onCustomSubmit(event: FormEvent) {
    event.preventDefault();
    const text = custom.trim();
    if (!text) return;
    if (looksProfane(text) || looksProfane(firstName)) {
      setError("Let's keep it friendly. Try rewording that.");
      return;
    }
    void send(text, "custom_answer");
  }

  function openCustom() {
    setCustomOpen(true);
    setTimeout(() => {
      customRef.current?.focus();
      customRef.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    }, 60);
  }

  async function onShare() {
    track("share_clicked", { card: cardLabel });
    const text = `I got a card from Vishwanth Reddy Jakka. It asks: "${question.text}"`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: cardLabel ? `Card no. ${cardLabel}` : "Hi", text, url: cardUrl });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${cardUrl}`);
      setShareNote("Link copied. Paste it anywhere.");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return; // user closed the sheet
      setShareNote(`Copy this link: ${cardUrl}`);
    }
  }

  const mailto = (body?: string) =>
    `mailto:${person.email}?subject=${encodeURIComponent(cardLabel ? `Card ${cardLabel}` : "Hi")}&body=${encodeURIComponent(
      `${question.text}\n\n${body ?? ""}`,
    )}`;

  const fade = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.22, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div style={{ ...sans, color: "#f3eee6" }} className="min-h-[100svh] overflow-x-clip bg-[#13110f]">
      <main className="mx-auto w-full max-w-[640px] px-[max(1.25rem,env(safe-area-inset-left))] pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-12">
        {/* 1 + 2. Hero: identity strip and the card moment */}
        <div ref={heroRef}>
          <motion.header {...fade(0)} className="flex items-center gap-4">
            <img
              src={photoSmall}
              width={56}
              height={56}
              alt=""
              decoding="async"
              fetchPriority="high"
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-2xl leading-none tracking-[-0.01em]" style={display}>
                {person.name}
              </p>
              <p className={`mt-2 ${label} opacity-70`}>Software Engineer</p>
            </div>
          </motion.header>
          <motion.p {...fade(0.05)} className="mt-3 text-base leading-snug opacity-80">
            {person.line}
          </motion.p>

          <motion.section {...fade(0.1)} className="mt-7 border-t border-white/15 pt-5" aria-labelledby="card-q">
            <p className={`${label} opacity-70`}>{cardLabel ? `Card no. ${cardLabel}` : "Hi, nice to meet you"}</p>
            {backendEnabled && card && (
              <p className="mt-2 min-h-[1.5rem] text-[15px] leading-6 text-[#e2a15a]" aria-live="polite">
                {scan && (
                  <CountUp to={scan.count} reduced={reduced} render={(n) => scanCopy(scan, n)} />
                )}
              </p>
            )}
            <h1 id="card-q" className="mt-3 text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-5xl" style={display}>
              {question.text}
            </h1>
          </motion.section>
        </div>

        {/* 3. Chips, then inline confirmation */}
        <section className="mt-6" aria-label="Answer">
          <AnimatePresence mode="wait" initial={false}>
            {answered ? (
              <motion.div
                key="thanks"
                role="status"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border border-white/25 px-4 py-5"
              >
                <p className="text-2xl leading-snug" style={display}>
                  Thank you. That's in.
                </p>
                {answered !== "…" && <p className="mt-2 opacity-70">You said: “{answered}”</p>}
              </motion.div>
            ) : (
              <motion.div key="chips" exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: 0.15 }}>
                <ul className="space-y-3">
                  {question.chips.map((chip) => (
                    <li key={chip}>
                      {backendEnabled && card ? (
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => void send(chip, "chip_answer")}
                          className={`min-h-[56px] w-full border px-4 py-3 text-left text-lg leading-snug transition-colors duration-150 active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a] disabled:opacity-60 ${
                            busy === chip ? "border-[#f3eee6] bg-white/10" : "border-white/25"
                          }`}
                          style={display}
                        >
                          {chip}
                        </button>
                      ) : (
                        <a
                          href={mailto(chip)}
                          className="flex min-h-[56px] w-full items-center border border-white/25 px-4 py-3 text-lg leading-snug active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]"
                          style={display}
                        >
                          {chip}
                        </a>
                      )}
                    </li>
                  ))}
                  <li>
                    {backendEnabled && card ? (
                      customOpen ? (
                        <form onSubmit={onCustomSubmit} className="space-y-4 border border-white/25 p-4">
                          <div>
                            <label htmlFor="hi-custom" className={`${label} flex justify-between opacity-70`}>
                              <span>Your answer</span>
                              <span className="tabular-nums">{custom.length}/140</span>
                            </label>
                            <input
                              id="hi-custom"
                              ref={customRef}
                              type="text"
                              name="answer"
                              maxLength={140}
                              required
                              value={custom}
                              onChange={(e) => setCustom(e.target.value)}
                              autoComplete="off"
                              autoCapitalize="sentences"
                              enterKeyHint="send"
                              placeholder="One line"
                              className={field}
                            />
                          </div>
                          <div>
                            <label htmlFor="hi-first" className={`${label} opacity-70`}>
                              First name (optional)
                            </label>
                            <input
                              id="hi-first"
                              type="text"
                              name="first_name"
                              maxLength={40}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              autoComplete="given-name"
                              autoCapitalize="words"
                              enterKeyHint="next"
                              className={field}
                            />
                          </div>
                          <div>
                            <label htmlFor="hi-email" className={`${label} opacity-70`}>
                              Email (optional)
                            </label>
                            <input
                              id="hi-email"
                              type="email"
                              name="email"
                              maxLength={120}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              inputMode="email"
                              autoComplete="email"
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              enterKeyHint="send"
                              className={field}
                            />
                            <p className="mt-2 text-sm leading-snug opacity-60">
                              Only if you want a reply. Never shown. Your answer appears on the wall with your first name if you add one.
                            </p>
                          </div>
                          <button
                            type="submit"
                            disabled={busy !== null || !custom.trim()}
                            className="min-h-[52px] w-full bg-[#f3eee6] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#13110f] active:bg-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2a15a]"
                          >
                            {busy ? "Sending…" : "Send"}
                          </button>
                        </form>
                      ) : (
                        <button type="button" onClick={openCustom} className={outlined}>
                          Something else
                        </button>
                      )
                    ) : (
                      <a href={mailto()} className={outlined}>
                        Something else
                      </a>
                    )}
                  </li>
                </ul>
                {error && (
                  <p role="alert" className="mt-3 text-base leading-snug">
                    {error}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. The wall of answers, revealed once answered */}
        <AnimatePresence>
          {answered && backendEnabled && wall && (
            <motion.section
              key="wall"
              aria-label="What others said"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8">
                <p className={`${label} opacity-60`}>What others said</p>
                {wall.length === 0 ? (
                  <p className="mt-4 text-2xl leading-snug" style={display}>
                    Nobody's answered this one yet. You're first. Others will show up here.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-white/10">
                    {wall.map((entry, index) => (
                      <li key={`${entry.created_at}-${index}`} className="py-4">
                        <p className="text-xl leading-snug" style={display}>
                          {entry.answer}
                        </p>
                        {(entry.first_name || entry.city) && (
                          <p className={`mt-2 ${label} opacity-60`}>
                            {[entry.first_name, entry.city].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 5. Pass it on */}
        <section className="mt-12 border-t border-white/15 pt-6" aria-label="Pass it on">
          <p className={`${label} opacity-60`}>Pass it on</p>
          <p className="mt-3 text-2xl leading-snug" style={display}>
            Know someone building something hard? Send them this.
          </p>
          <button type="button" onClick={onShare} className={`${outlined} mt-5`}>
            Share this card
          </button>
          {shareNote && (
            <p role="status" className="mt-3 break-words text-sm leading-snug opacity-75">
              {shareNote}
            </p>
          )}
        </section>

        {/* 6. Who I am */}
        <section className="mt-12 border-t border-white/15 pt-6" aria-label="Who I am">
          <p className={`${label} opacity-60`}>Who I am</p>
          <div className="mt-5 space-y-7">
            {lexsyBeats.slice(0, 3).map((beat) => (
              <article key={beat.kicker}>
                <p className={`${label} text-[#f3eee6]/60`}>{beat.kicker}</p>
                <h2 className="mt-2 text-3xl leading-[1.05]" style={display}>
                  {beat.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed opacity-75">{beat.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 7. Footer actions (secondary to the sticky bar) */}
        <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label="More ways to reach me">
          <a
            className={outlined}
            href={person.calendly}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("calendly_clicked", { card: cardLabel })}
          >
            Book a call
          </a>
          <a className={outlined} href={person.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a className={outlined} href={`mailto:${person.email}`}>
            Email
          </a>
          <a className={outlined} href={person.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        {/* TODO: "where this card has been" travel map. The scans table is ready for it
            (add a nullable city / lat / lng captured at scan time, expose via a view). */}

        <footer className="mt-10 border-t border-white/10 pt-4">
          <Link href="/" className={`inline-flex min-h-[44px] items-center ${label} opacity-70 hover:opacity-100`}>
            See the main site
          </Link>
        </footer>
      </main>

      {/* Sticky bar: exactly one action. */}
      <AnimatePresence>
        {barVisible && !typing && (
          <motion.div
            key="bar"
            initial={reduced ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#13110f]/95 px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur"
          >
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("linkedin_clicked", { card: cardLabel })}
              className="mx-auto flex min-h-[52px] w-full max-w-[640px] items-center justify-center bg-[#e2a15a] px-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#1c1917] active:bg-[#efb56e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3eee6]"
            >
              Connect on LinkedIn
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
