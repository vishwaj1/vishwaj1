import { useState } from "react";
import { motion } from "framer-motion";
import { person, proofs, projects } from "./content";

const instruments: {
  key: string;
  value: string;
  unit: string;
  detail: string;
  meta: string;
  href?: string;
}[] = [
  ...proofs.map((proof) => ({
    key: proof.org.split(".")[0].toUpperCase(),
    value: proof.stat,
    unit: proof.unit,
    detail: proof.line,
    meta: proof.role,
  })),
  ...projects.map((project) => ({
    key: project.name.split(" ")[0].toUpperCase(),
    value: project.name,
    unit: project.stack,
    detail: project.line,
    meta: "Public",
    href: project.href,
  })),
];

export function SignalTheme() {
  const [active, setActive] = useState(0);
  const current = instruments[active];

  return (
    <div
      className="relative h-full overflow-y-auto text-[#e7edf5]"
      style={{
        fontFamily: '"Outfit", sans-serif',
        backgroundColor: "#0e1116",
        backgroundImage:
          "linear-gradient(to right, rgba(255,176,32,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,176,32,0.07) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-8">
        <header
          className="flex flex-wrap items-center justify-between gap-3 border border-[#ffb020]/30 bg-[#0e1116]/80 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#ffb020]"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb020]" />
            {person.mark} · live
          </span>
          <span className="text-[#9aa6b2]">{person.role}</span>
          <span>{person.place}</span>
        </header>

        <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <figure className="border border-[#243041] bg-[#121820] p-3">
            <img
              src={person.photo}
              alt={person.name}
              className="aspect-[4/5] w-full object-cover object-[center_20%]"
            />
            <figcaption
              className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#9aa6b2]"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <span>Operator</span>
              <span>{person.short}</span>
            </figcaption>
          </figure>

          <div>
            <p
              className="text-[12px] uppercase tracking-[0.22em] text-[#9aa6b2]"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              Select an instrument
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {instruments.map((item, index) => {
                const on = index === active;
                return (
                  <button
                    key={item.key + item.value}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`border p-4 text-left transition ${
                      on
                        ? "border-[#ffb020] bg-[#ffb020]/10"
                        : "border-[#243041] bg-[#121820]/80 hover:border-[#ffb020]/60"
                    }`}
                  >
                    <span
                      className="text-[11px] uppercase tracking-[0.18em] text-[#ffb020]"
                      style={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {item.key}
                    </span>
                    <span
                      className="mt-3 block text-2xl font-semibold leading-none"
                      style={{ fontFamily: '"Syne", sans-serif' }}
                    >
                      {item.value}
                    </span>
                    <span className="mt-2 block text-xs text-[#9aa6b2]">{item.unit}</span>
                  </button>
                );
              })}
            </div>

            <motion.article
              key={current.key + current.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border border-[#243041] bg-[#121820] p-5"
            >
              <p
                className="text-[11px] uppercase tracking-[0.2em] text-[#ffb020]"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {current.meta}
              </p>
              <h2 className="mt-2 text-3xl" style={{ fontFamily: '"Syne", sans-serif' }}>
                {current.value} <span className="text-[#9aa6b2]">{current.unit}</span>
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-[#c5d0dc]">{current.detail}</p>
              {current.href && (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm uppercase tracking-[0.16em] text-[#ffb020]"
                >
                  Open ↗
                </a>
              )}
            </motion.article>
          </div>
        </div>

        <footer
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.16em] text-[#9aa6b2]"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          <a className="hover:text-[#ffb020]" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-[#ffb020]" href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-[#ffb020]" href={person.calendly} target="_blank" rel="noreferrer">Book a call</a>
          <a className="hover:text-[#ffb020]" href={`mailto:${person.email}`}>Email</a>
        </footer>
      </div>
    </div>
  );
}
