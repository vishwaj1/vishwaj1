import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { person, proofs, projects, tones } from "./content";

type Mode = "short" | "voice" | "expand";

export function PromptTheme() {
  const [tone, setTone] = useState(0);
  const [mode, setMode] = useState<Mode>("voice");
  const voice = tones[tone];

  function retone() {
    setMode("voice");
    setTone((n) => (n + 1) % tones.length);
  }

  return (
    <div
      className="relative h-full overflow-y-auto text-[#f3efe6]"
      style={{
        background:
          "radial-gradient(900px 480px at 80% 20%, rgba(212,132,90,0.16), transparent 60%), #0c0b09",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#a39e93]">
          <span>{person.mark}</span>
          <span className="hidden sm:inline">{person.role}</span>
          <span>{person.place}</span>
        </header>

        <div className="mt-10 grid flex-1 items-end gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p
              className="mb-5 text-[13px] uppercase tracking-[0.28em] text-[#d4845a]"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              {mode === "short" ? "One line" : voice.kicker}
            </p>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`${mode}-${voice.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl text-[3.1rem] leading-[0.92] text-[#f6f1e7] sm:text-7xl lg:text-[5.4rem]"
                style={{ fontFamily: '"Instrument Serif", serif' }}
              >
                {mode === "short" ? (
                  <>
                    I ship the <span className="italic text-[#d4845a]">system.</span>
                  </>
                ) : (
                  <>
                    {voice.line}{" "}
                    <span className="italic text-[#d4845a]">{voice.rest}</span>
                  </>
                )}
              </motion.h1>
            </AnimatePresence>

            <div className="mt-6 h-px w-16 bg-[#d4845a]" />

            <AnimatePresence mode="wait">
              {mode !== "short" && (
                <motion.p
                  key={mode === "expand" ? "expand" : voice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 max-w-xl text-lg leading-relaxed text-[#c9c2b5]"
                >
                  {mode === "expand"
                    ? "Lexsy is the long version. Pantry and Polycom are the proof that this was true before the title."
                    : voice.body}
                </motion.p>
              )}
            </AnimatePresence>

            <div
              className="mt-8 flex flex-wrap gap-2"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              <Control active={mode === "short"} onClick={() => setMode("short")}>
                Shorten
              </Control>
              <Control active={mode === "voice"} onClick={retone}>
                Retone · {voice.label}
              </Control>
              <Control active={mode === "expand"} onClick={() => setMode("expand")}>
                Expand
              </Control>
            </div>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="absolute -left-3 top-8 hidden h-2/3 w-px bg-[#d4845a] lg:block" />
            <img
              src={person.photo}
              alt={person.name}
              className="aspect-[4/5] w-full object-cover object-[center_20%] grayscale-[20%]"
            />
            <figcaption
              className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.18em] text-[#a39e93]"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              <span>{person.short}</span>
              <span>Portrait</span>
            </figcaption>
          </motion.figure>
        </div>

        <AnimatePresence>
          {mode === "expand" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 grid gap-px bg-[#2a2622] sm:grid-cols-3"
            >
              {proofs.map((proof) => (
                <article key={proof.org} className="bg-[#0c0b09] p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4845a]">{proof.org}</p>
                  <p
                    className="mt-3 text-4xl text-[#f6f1e7]"
                    style={{ fontFamily: '"Instrument Serif", serif' }}
                  >
                    {proof.stat}
                  </p>
                  <p className="text-sm text-[#a39e93]">{proof.unit}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#c9c2b5]">{proof.line}</p>
                </article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-10 flex flex-col gap-6 border-t border-[#2a2622] pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-4">
            {projects.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className="group block w-36">
                <img src={project.image} alt="" className="h-20 w-full object-cover opacity-80 transition group-hover:opacity-100" />
                <p className="mt-2 text-sm">{project.name}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#a39e93]">{project.stack}</p>
              </a>
            ))}
          </div>
          <div
            className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.16em] text-[#c9c2b5]"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            <a className="hover:text-[#d4845a]" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="hover:text-[#d4845a]" href={person.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="hover:text-[#d4845a]" href={person.calendly} target="_blank" rel="noreferrer">Book a call</a>
            <a className="hover:text-[#d4845a]" href={`mailto:${person.email}`}>Email</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Control({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
        active
          ? "border-[#d4845a] bg-[#d4845a] text-[#1a120b]"
          : "border-[#3a342c] text-[#f3efe6] hover:border-[#d4845a]"
      }`}
    >
      {children}
    </button>
  );
}
