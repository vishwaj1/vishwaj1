import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { Copy } from "lucide-react";
import { proofs, tones } from "@/themes/content";
import { doors, person } from "./copy";
import agentMarkdown from "./agent.md?raw";
import { track } from "./hi-data";
import { boxActive, boxSecondary, Closing, ContactButton, label, mono, sans, serif } from "./ui";

type View = "human" | "agent";
type Mode = "short" | "voice" | "expand";

const status = "currently · founding engineering at lexsy";

function readView(): View {
  try {
    return new URLSearchParams(window.location.search).get("view") === "agent" ? "agent" : "human";
  } catch {
    return "human";
  }
}

/** Two-way switch, like a radio group. Keeps ?view=agent in the URL so the agent view can be shared. */
function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const option = (v: View) => (
    <button
      type="button"
      role="radio"
      aria-checked={view === v}
      onClick={() => onChange(v)}
      className={`${mono} flex min-h-[40px] items-center gap-1.5 px-3 text-[12px] lowercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4845a] ${
        view === v ? "bg-[#1f1c18] text-[#f3efe6]" : "text-[#8a847a] hover:text-[#c9c2b5]"
      }`}
    >
      <span aria-hidden>{view === v ? "●" : "○"}</span>
      {v}
    </button>
  );
  return (
    <div role="radiogroup" aria-label="View this page as" className="flex border border-[#3a352f]">
      {option("human")}
      {option("agent")}
    </div>
  );
}

export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const [view, setView] = useState<View>(readView);
  const [tone, setTone] = useState(0);
  const [mode, setMode] = useState<Mode>("voice");
  const [copied, setCopied] = useState(false);
  const voice = tones[tone];

  useEffect(() => {
    document.title = "Vishwanth Reddy";
  }, []);

  function changeView(next: View) {
    setView(next);
    setCopied(false);
    track("view_switched", { view: next });
    try {
      const url = new URL(window.location.href);
      if (next === "agent") url.searchParams.set("view", "agent");
      else url.searchParams.delete("view");
      window.history.replaceState(null, "", url);
    } catch {
      /* URL update is a convenience only */
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(agentMarkdown);
      setCopied(true);
      track("agent_copied");
    } catch {
      setCopied(false);
    }
  }

  function retone() {
    setMode("voice");
    setTone((n) => (n + 1) % tones.length);
  }

  const onLinkedIn = () => track("linkedin_clicked", { page: "home" });
  const onCalendly = () => track("calendly_clicked", { page: "home" });
  const fade = (delay = 0) => ({
    initial: reduced ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div style={{ ...sans, color: "#f3efe6" }} className="min-h-[100svh] overflow-x-clip bg-[#0c0b09]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#2a2622] bg-[#0c0b09]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-[max(1rem,env(safe-area-inset-left))] py-2 sm:px-8">
          <div className="flex items-center gap-1.5">
            <a href="#top" className={`${boxSecondary} px-3`} aria-label="Back to top">
              vrj
            </a>
            <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Sections">
              <a href="#proof" className={`${boxSecondary} px-3`}>proof</a>
              <a href="#projects" className={`${boxSecondary} px-3`}>projects</a>
              <a href="#contact" className={`${boxSecondary} px-3`}>contact</a>
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <ViewSwitch view={view} onChange={changeView} />
            <ContactButton kind="resume" className="hidden whitespace-nowrap px-3 md:inline-flex" />
            <ContactButton kind="linkedin" primary text="connect" onClick={onLinkedIn} className="hidden whitespace-nowrap px-3 md:inline-flex" />
          </div>
        </div>
      </header>

      {view === "agent" ? (
        <main className="mx-auto max-w-3xl px-[max(1rem,env(safe-area-inset-left))] pb-[max(3rem,env(safe-area-inset-bottom))] pt-8 sm:px-8">
          <p className={label}>~/vishwanth · this page, written for an ai to read</p>
          <pre
            className={`${mono} mt-5 whitespace-pre-wrap break-words text-[14px] leading-[1.7] text-[#d9d3c7] sm:text-[15px]`}
          >
            {agentMarkdown}
          </pre>
          <div className="mt-8 flex flex-wrap gap-2">
            <button type="button" onClick={() => void copyMarkdown()} className={`${copied ? boxActive : boxSecondary} w-full sm:w-auto`}>
              <Copy className="h-4 w-4" aria-hidden />
              {copied ? "copied" : "copy for your ai"}
            </button>
            <a href={`${import.meta.env.BASE_URL}llms.txt`} target="_blank" rel="noreferrer" className={`${boxSecondary} w-full sm:w-auto`}>
              open /llms.txt ↗
            </a>
          </div>
          <p role="status" className={`${label} mt-3 min-h-[1.25rem]`}>
            {copied ? "copied. paste it into chatgpt or claude." : ""}
          </p>
        </main>
      ) : (
        <main id="top" className="mx-auto max-w-6xl px-[max(1.125rem,env(safe-area-inset-left))] pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8">
          {/* Hero */}
          <section className="grid gap-8 pb-14 pt-8 sm:grid-cols-[1.5fr_1fr] sm:items-center sm:gap-10 sm:pt-12 lg:grid-cols-[1.4fr_0.8fr] lg:gap-14 lg:pb-20 lg:pt-16">
            <div>
              <motion.p {...fade(0)} className={`${mono} inline-block border border-[#3a352f] px-2.5 py-1.5 text-[12px] lowercase text-[#c9c2b5]`}>
                {status}
              </motion.p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                  key={`${mode}-${voice.id}`}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 max-w-3xl text-[clamp(2.75rem,11.5vw,5.4rem)] leading-[0.95] sm:text-[clamp(2.75rem,6.6vw,5.4rem)] tracking-[-0.01em] text-[#f6f1e7]"
                  style={serif}
                >
                  {mode === "short" ? (
                    <>
                      I ship the <i className="text-[#d4845a]">system.</i>
                    </>
                  ) : (
                    <>
                      {voice.line} <i className="text-[#d4845a]">{voice.rest}</i>
                    </>
                  )}
                </motion.h1>
              </AnimatePresence>
              <div className="mt-6 h-px w-14 bg-[#d4845a]" />
              <AnimatePresence mode="wait" initial={false}>
                {mode !== "short" && (
                  <motion.p
                    key={mode === "expand" ? "expand" : voice.id}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#c9c2b5] sm:text-lg"
                  >
                    {mode === "expand"
                      ? "Lexsy is the long version. Pantry and Polycom are the proof that this was true before the title."
                      : voice.body}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Rewrite this introduction">
                <button type="button" onClick={() => setMode("short")} className={mode === "short" ? boxActive : boxSecondary} aria-pressed={mode === "short"}>
                  shorten
                </button>
                <button type="button" onClick={retone} className={mode === "voice" ? boxActive : boxSecondary} aria-pressed={mode === "voice"}>
                  retone · {voice.label.toLowerCase()}
                </button>
                <button type="button" onClick={() => setMode("expand")} className={mode === "expand" ? boxActive : boxSecondary} aria-pressed={mode === "expand"}>
                  expand
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <ContactButton kind="linkedin" primary onClick={onLinkedIn} className="w-full whitespace-nowrap sm:w-auto sm:px-6" />
                <ContactButton kind="resume" className="w-full sm:w-auto" />
              </div>
            </div>

            <motion.figure {...fade(0.08)} className="w-full">
              <img
                src={person.photo}
                alt={person.name}
                width={800}
                height={1000}
                decoding="async"
                className="aspect-[5/4] w-full object-cover object-[center_30%] sm:aspect-[4/5] sm:object-[center_20%]"
              />
              <figcaption className={`${label} mt-2 flex justify-between`}>
                <span>vishwanth reddy</span>
                <span>portrait</span>
              </figcaption>
            </motion.figure>
          </section>

          {/* Proof */}
          <section id="proof" className="scroll-mt-20 border-t border-[#2a2622] pt-8" aria-labelledby="proof-h">
            <h2 id="proof-h" className={label}>
              proof
            </h2>
            <div className="mt-4 grid gap-px bg-[#2a2622] md:grid-cols-3">
              {proofs.map((proof, index) => (
                <article key={proof.org} className="bg-[#0c0b09] py-6 md:px-6 md:first:pl-0">
                  <p className={`${label} flex flex-wrap justify-between gap-x-3 gap-y-1`}>
                    <span className="whitespace-nowrap text-[#d4845a]">
                      0{index + 1} · {proof.org.toLowerCase()}
                    </span>
                    <span className="whitespace-nowrap">{proof.when}</span>
                  </p>
                  <p className="mt-3 text-[3.5rem] leading-none text-[#f6f1e7]" style={serif}>
                    {proof.stat}
                  </p>
                  <p className="mt-1 text-[15px] text-[#a39e93]">{proof.unit}</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#c9c2b5]">{proof.line}</p>
                </article>
              ))}
            </div>
            <Link href="/work/lexsy" className={`${boxSecondary} mt-4`}>
              read the lexsy story →
            </Link>
          </section>

          {/* Projects */}
          <section id="projects" className="mt-14 scroll-mt-20 border-t border-[#2a2622] pt-8" aria-labelledby="projects-h">
            <h2 id="projects-h" className={label}>
              things you can open
            </h2>
            <div className="mt-5 grid gap-8 md:grid-cols-2">
              {doors.map((door) => (
                <a key={door.name} href={door.href} target="_blank" rel="noreferrer" className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4845a]">
                  <span className="block aspect-[16/10] overflow-hidden border border-[#2a2622] bg-[#16140f]">
                    <img
                      src={door.image}
                      alt={`${door.name} screenshot`}
                      width={1400}
                      height={875}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full transition duration-500 group-hover:scale-[1.02] ${
                        door.fit === "contain" ? "object-contain p-5" : "object-cover object-top"
                      }`}
                    />
                  </span>
                  <span className="mt-3 block text-[1.75rem] leading-tight" style={serif}>
                    {door.name} <span className="text-[#a39e93]">↗</span>
                  </span>
                  <span className="mt-1 block max-w-md text-[16px] leading-relaxed text-[#c9c2b5]">{door.line}</span>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-14">
            <Closing education onLinkedIn={onLinkedIn} onCalendly={onCalendly} />
          </div>

          <footer className={`${label} mt-14 flex flex-wrap justify-between gap-3 border-t border-[#2a2622] pt-5`}>
            <span>vishwanth.dev</span>
            <button type="button" onClick={() => changeView("agent")} className="min-h-[44px] underline underline-offset-4 hover:text-[#f3efe6]">
              view as agent
            </button>
          </footer>
        </main>
      )}
    </div>
  );
}
