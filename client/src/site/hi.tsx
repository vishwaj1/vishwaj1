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
  looksProfane,
  ordinal,
  readMine,
  removeAnswer,
  submitAnswer,
  track,
  updateAnswer,
  type MyAnswer,
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
  const givenName = person.name.split(" ")[0];
  const cardUrl = `${SITE_ORIGIN}/hi${card ? `/${cardLabel}` : ""}`;

  const [scan, setScan] = useState<ScanResult | null>(null);
  const [scanFailed, setScanFailed] = useState(false);
  const [mine, setMine] = useState<MyAnswer | null>(null); // this browser's own saved answer
  const [editing, setEditing] = useState(false); // changing an existing answer
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null); // the chip text (or "__remove") in flight
  const [error, setError] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [wall, setWall] = useState<WallEntry[] | null>(null);
  const [shareNote, setShareNote] = useState("");
  const [connectInView, setConnectInView] = useState(false);
  const [typing, setTyping] = useState(false);

  const connectRef = useRef<HTMLDivElement>(null);
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
    setScanFailed(false);
    setWall(null);
    setError("");
    setCustomOpen(false);
    setEditing(false);
    setNotice("");
    trackedWall.current = false;
    setMine(card ? readMine(card) : null);
    if (card) {
      loadScan(card).then((result) => {
        if (cancelled) return;
        setScan(result);
        setScanFailed(result === null);
      });
    }
    return () => {
      cancelled = true;
      document.title = previous;
    };
  }, [card, cardLabel]);

  // Reveal the wall once answered (this visit or an earlier one); refresh it when the answer changes.
  const mineSignature = mine ? `${mine.answer}|${mine.firstName}` : "";
  useEffect(() => {
    if (!mineSignature || !backendEnabled) return;
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
  }, [mineSignature, question.id, cardLabel]);

  // Sticky bar is always available, except while the inline connect button is on screen
  // (so there is only ever one amber action in view) or while a text field is focused.
  useEffect(() => {
    const node = connectRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setConnectInView(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setConnectInView(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [mine, editing]);

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

  /** CREATE a new answer, or UPDATE the one this browser already saved. */
  const send = useCallback(
    async (text: string, kind: "chip_answer" | "custom_answer") => {
      if (!card || busy) return;
      setError("");
      setNotice("");
      setBusy(text);
      const name = kind === "custom_answer" ? firstName : mine?.firstName ?? "";
      let saved: MyAnswer | null = null;
      if (mine) {
        const result = await updateAnswer(card, mine, text, name);
        if (result === "ok") saved = { ...mine, answer: text, firstName: name.trim() };
        // Row vanished (e.g. moderated): re-create it under the same token.
        else if (result === "missing") {
          saved = await submitAnswer({ card, questionId: question.id, answer: text, firstName: name }, mine.token);
        }
      } else {
        saved = await submitAnswer({
          card,
          questionId: question.id,
          answer: text,
          firstName: kind === "custom_answer" ? firstName : undefined,
          email: kind === "custom_answer" ? email : undefined,
        });
      }
      setBusy(null);
      if (!saved) {
        setError("That didn't save. Check your connection and tap again.");
        return;
      }
      track(mine ? "answer_changed" : kind, { card: cardLabel, question: question.id });
      setMine(saved);
      setEditing(false);
      setCustomOpen(false);
      setCustom("");
    },
    [card, busy, mine, question.id, cardLabel, firstName, email],
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
    // The input mounts with autoFocus inside this tap, which is what iOS needs to open the keyboard.
    setError("");
    setCustomOpen(true);
    setTimeout(() => {
      customRef.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    }, 60);
  }

  /** Close the "Something else" form without saving anything. */
  function closeCustom() {
    setCustomOpen(false);
    setError("");
    if (!mine) setCustom("");
  }

  /** Reopen the choices to change a saved answer. Nothing changes until they pick again. */
  function startEditing() {
    if (!mine) return;
    const wasChip = question.chips.includes(mine.answer as never);
    setCustom(wasChip ? "" : mine.answer);
    setFirstName(mine.firstName);
    setError("");
    setNotice("");
    setCustomOpen(false);
    setEditing(true);
  }

  /** Back out of editing: keep the saved answer exactly as it was. */
  function cancelEditing() {
    setEditing(false);
    setCustomOpen(false);
    setError("");
  }

  /** DELETE the saved answer and return to the choices. */
  async function onRemove() {
    if (!card || !mine || busy) return;
    setError("");
    setBusy("__remove");
    const ok = await removeAnswer(card, mine);
    setBusy(null);
    if (!ok) {
      setError("That didn't go through. Check your connection and try again.");
      return;
    }
    track("answer_removed", { card: cardLabel, question: question.id });
    setMine(null);
    setEditing(false);
    setCustomOpen(false);
    setCustom("");
    setFirstName("");
    setWall(null);
    setNotice("Removed. You can answer again anytime.");
  }

  async function onShare() {
    track("share_clicked", { card: cardLabel });
    const text = `I got a card from ${givenName}. It asks: "${question.text}"`;
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

  const textLink =
    "inline-flex min-h-[44px] items-center text-[12px] uppercase tracking-[0.16em] underline underline-offset-4 opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]";
  const chipClass =
    "min-h-[56px] w-full border px-4 py-3 text-left text-lg leading-snug transition-colors duration-150 active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a] disabled:opacity-60";
  const connectLink =
    "flex min-h-[52px] w-full items-center justify-center bg-[#e2a15a] px-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#1c1917] active:bg-[#efb56e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3eee6]";
  const onLinkedIn = () => track("linkedin_clicked", { card: cardLabel });
  const showAnswered = Boolean(mine) && !editing;

  return (
    <div style={{ ...sans, color: "#f3eee6" }} className="min-h-[100svh] overflow-x-clip bg-[#13110f]">
      <main className="mx-auto w-full max-w-[640px] px-[max(1.25rem,env(safe-area-inset-left))] pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-12">
        {/* Who is this from: one quiet line, enough context for a secondhand card */}
        <motion.header {...fade(0)} className="flex items-center gap-3 text-[13px] leading-none">
          <img
            src={photoSmall}
            width={32}
            height={32}
            alt=""
            decoding="async"
            fetchPriority="high"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <p className="min-w-0 truncate opacity-90">
            From {givenName} <span className="opacity-60">·</span> Software Engineer
          </p>
        </motion.header>

        {/* The card moment: number, scan line, question */}
        <motion.section {...fade(0.08)} className="mt-6" aria-labelledby="card-q">
          {cardLabel ? (
            <>
              <p className={`${label} opacity-70`}>Card no.</p>
              <p
                aria-label={`Card number ${cardLabel}`}
                className="mt-3 text-[clamp(3.5rem,min(22vw,9.5svh),7.5rem)] leading-[1] tracking-[-0.03em] text-[#f3eee6]/40 sm:text-[7.5rem]"
                style={display}
              >
                {cardLabel}
              </p>
            </>
          ) : (
            <p className={`${label} opacity-70`}>Hi, nice to meet you</p>
          )}
          {backendEnabled && card && !scanFailed && (
            <p className="mt-3 min-h-[1.5rem] text-[15px] leading-6 opacity-70" aria-live="polite">
              {scan && <CountUp to={scan.count} reduced={reduced} render={(n) => scanCopy(scan, n)} />}
            </p>
          )}
          <h1 id="card-q" className="mt-4 text-[1.875rem] font-medium leading-[1.1] tracking-[-0.01em] text-[#f3eee6] sm:text-5xl" style={display}>
            {question.text}
          </h1>
        </motion.section>

        {/* Answer: chips, then confirmation */}
        <section className="mt-6" aria-label="Answer">
          <AnimatePresence mode="wait" initial={false}>
            {showAnswered && mine ? (
              <motion.div
                key="thanks"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border border-[#f3eee6] px-4 py-5"
              >
                <div role="status">
                  <p className="text-2xl leading-snug" style={display}>
                    That's in. Thank you.
                  </p>
                  <p className="mt-2 break-words opacity-70">You said: “{mine.answer}”</p>
                </div>
                <button type="button" onClick={startEditing} className={`${textLink} mt-2`}>
                  Change my answer
                </button>
              </motion.div>
            ) : (
              <motion.div key="chips" exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: 0.15 }}>
                {notice && (
                  <p role="status" className="mb-4 text-base leading-snug opacity-80">
                    {notice}
                  </p>
                )}
                {editing && mine && (
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className={`${label} opacity-70`}>Changing your answer</p>
                    <button type="button" onClick={cancelEditing} className={textLink}>
                      Keep mine
                    </button>
                  </div>
                )}
                <ul className="space-y-3">
                  {question.chips.map((chip) => {
                    const current = editing && mine?.answer === chip;
                    return (
                      <li key={chip}>
                        {backendEnabled && card ? (
                          <button
                            type="button"
                            disabled={busy !== null}
                            aria-pressed={current || undefined}
                            onClick={() => void send(chip, "chip_answer")}
                            className={`${chipClass} ${busy === chip || current ? "border-[#f3eee6] bg-white/15" : "border-white/35 bg-white/[0.06]"}`}
                            style={display}
                          >
                            {chip}
                            {busy === chip && <span className={`ml-3 ${label} opacity-70`}>Sending…</span>}
                            {current && busy !== chip && <span className={`ml-3 ${label} opacity-70`}>Your answer</span>}
                          </button>
                        ) : (
                          <a href={mailto(chip)} className={`${chipClass} flex items-center border-white/35 bg-white/[0.06]`} style={display}>
                            {chip}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {backendEnabled && card ? (
                  customOpen ? (
                    <form
                      onSubmit={onCustomSubmit}
                      onKeyDown={(e) => e.key === "Escape" && closeCustom()}
                      className="mt-3 space-y-4 border border-white/25 p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="hi-custom" className={`${label} opacity-70`}>
                            Your answer
                          </label>
                          <span className={`${label} tabular-nums opacity-60`}>{custom.length}/140</span>
                        </div>
                        <input
                          id="hi-custom"
                          ref={customRef}
                          autoFocus
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
                          enterKeyHint={mine ? "send" : "next"}
                          className={field}
                        />
                      </div>
                      {!mine && (
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
                      )}
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <button
                          type="submit"
                          disabled={busy !== null || !custom.trim()}
                          className="min-h-[52px] w-full bg-[#f3eee6] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#13110f] active:bg-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2a15a]"
                        >
                          {busy ? "Sending…" : mine ? "Save" : "Send"}
                        </button>
                        <button
                          type="button"
                          onClick={closeCustom}
                          disabled={busy !== null}
                          className="min-h-[52px] border border-white/25 px-5 text-[12px] uppercase tracking-[0.16em] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button type="button" onClick={openCustom} className={`${textLink} mt-2`}>
                      Or write your own
                    </button>
                  )
                ) : (
                  <a href={mailto()} className={`${textLink} mt-2`}>
                    Or write your own
                  </a>
                )}

                {error && (
                  <div role="alert" className="mt-3 text-base leading-snug">
                    <p style={display}>{error}</p>
                    <a href={mailto(custom)} className={`${textLink} mt-1`}>
                      Or email your answer
                    </a>
                  </div>
                )}
                {editing && mine && (
                  <button
                    type="button"
                    onClick={() => void onRemove()}
                    disabled={busy !== null}
                    className={`${textLink} mt-3 w-full justify-center opacity-60 disabled:opacity-40`}
                  >
                    {busy === "__remove" ? "Removing…" : "Remove my answer instead"}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Convert: your line is the reason to connect. Only one amber action is ever on screen. */}
        <AnimatePresence>
          {showAnswered && (
            <motion.div
              key="connect"
              ref={connectRef}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: reduced ? 0 : 0.1 }}
              className="mt-8"
            >
              <p className="text-[1.5rem] leading-[1.2]" style={display}>
                {person.line}
              </p>
              <a href={person.linkedin} target="_blank" rel="noreferrer" onClick={onLinkedIn} className={`${connectLink} mt-4`}>
                Connect on LinkedIn
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The wall, once answered */}
        <AnimatePresence>
          {mine && backendEnabled && wall && wall.length > 0 && (
            <motion.section
              key="wall"
              aria-label="On the wall"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-10">
                <p className={`${label} opacity-60`}>On the wall</p>
                <ul className="mt-3 divide-y divide-white/10">
                  {wall.map((entry, index) => (
                    <li key={`${entry.created_at}-${index}`} className="py-4">
                      <p className="break-words text-xl leading-snug" style={display}>
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
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Spread */}
        <section className="mt-12 border-t border-white/15 pt-6" aria-label="Pass it on">
          <p className={`${label} opacity-60`}>Pass it on</p>
          <p className="mt-3 text-xl leading-snug" style={display}>
            Know someone building something hard? Send them this.
          </p>
          <button type="button" onClick={onShare} className={`${outlined} mt-4`}>
            Share this card
          </button>
          {shareNote && (
            <p role="status" className="mt-3 break-words text-sm leading-snug opacity-75">
              {shareNote}
            </p>
          )}
        </section>

        {/* Who I am: three short beats from copy.ts */}
        <section className="mt-12 border-t border-white/15 pt-6" aria-label="Who I am">
          <p className={`${label} opacity-60`}>Who I am</p>
          <dl className="mt-4 space-y-5">
            {lexsyBeats.slice(0, 3).map((beat) => (
              <div key={beat.kicker}>
                <dt className={`${label} opacity-60`}>{beat.kicker}</dt>
                <dd className="mt-1 text-2xl leading-[1.15]" style={display}>
                  {beat.title}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Quiet links */}
        <nav className="mt-10 flex flex-wrap gap-x-6" aria-label="More ways to reach me">
          <a
            className={textLink}
            href={person.calendly}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("calendly_clicked", { card: cardLabel })}
          >
            Book a call
          </a>
          <a className={textLink} href={person.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a className={textLink} href={`mailto:${person.email}`}>
            Email
          </a>
          <a className={textLink} href={person.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        {/* TODO: "where this card has been" travel map. The scans table is ready for it
            (add a nullable city / lat / lng captured at scan time, expose via a view). */}

        <footer className="mt-6 border-t border-white/10 pt-2">
          <Link href="/" className={`inline-flex min-h-[44px] items-center ${label} opacity-70 hover:opacity-100`}>
            See the main site
          </Link>
        </footer>
      </main>

      {/* Sticky bar: exactly one action, hidden while typing or while the inline connect is on screen. */}
      <AnimatePresence>
        {!typing && !customOpen && !connectInView && (
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
              onClick={onLinkedIn}
              className={`${connectLink} mx-auto max-w-[640px]`}
            >
              Connect on LinkedIn
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
