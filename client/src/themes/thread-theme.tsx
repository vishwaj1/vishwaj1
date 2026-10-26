import { useRef } from "react";
import { person, proofs, projects } from "./content";

const frames = [
  { id: "name" },
  ...proofs.map((proof) => ({ id: proof.org, proof })),
  { id: "work" },
];

export function ThreadTheme() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative h-full text-[#1a120b]"
      style={{ background: "#f3ecdf", fontFamily: '"Outfit", sans-serif' }}
    >
      <div
        ref={scroller}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        <section className="relative flex h-full w-full min-w-full shrink-0 snap-start flex-col justify-between px-5 py-8 sm:px-10">
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7364]">Drag sideways · the line continues</p>
          <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-[#d6341a]">Vishwanth</p>
              <h1
                className="text-[18vw] leading-[0.78] tracking-[-0.04em] lg:text-[11rem]"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                Re<span className="text-[#d6341a]">d</span>dy
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[#4a3b32]">
                One name. One line through legal workflows, a campus pantry, and the systems before them.
              </p>
            </div>
            <img
              src={person.photo}
              alt={person.name}
              className="ml-auto aspect-[3/4] w-full max-w-xs object-cover object-[center_18%] shadow-[12px_12px_0_#d6341a] lg:max-w-sm"
            />
          </div>
          <ThreadRule label="01  Name" />
        </section>

        {proofs.map((proof, index) => (
          <section
            key={proof.org}
            className="flex h-full w-full min-w-full shrink-0 snap-start flex-col justify-between px-5 py-8 sm:px-12"
          >
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7364]">
              {String(index + 2).padStart(2, "0")} · {proof.when}
            </p>
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[#d6341a]">{proof.role}</p>
              <h2
                className="mt-3 text-6xl leading-none sm:text-8xl"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                {proof.org}
              </h2>
              <p
                className="mt-8 text-6xl text-[#d6341a] sm:text-7xl"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                {proof.stat}
                <span className="ml-3 text-xl text-[#1a120b] sm:text-2xl">{proof.unit}</span>
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a3b32]">{proof.line}</p>
            </div>
            <ThreadRule label={`${String(index + 2).padStart(2, "0")}  ${proof.org}`} />
          </section>
        ))}

        <section className="flex h-full w-full min-w-full shrink-0 snap-start flex-col justify-between px-5 py-8 sm:px-12">
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7364]">05 · Public work</p>
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className="group">
                <img src={project.image} alt="" className="h-52 w-full object-cover" />
                <h3 className="mt-4 text-4xl" style={{ fontFamily: '"Fraunces", serif' }}>
                  {project.name}
                </h3>
                <p className="mt-2 max-w-md text-[#4a3b32]">{project.line}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#d6341a]">{project.stack}</p>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex gap-5 text-sm uppercase tracking-[0.16em]">
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#d6341a]">LinkedIn</a>
              <a href={person.github} target="_blank" rel="noreferrer" className="hover:text-[#d6341a]">GitHub</a>
              <a href={person.calendly} target="_blank" rel="noreferrer" className="hover:text-[#d6341a]">Book a call</a>
              <a href={`mailto:${person.email}`} className="hover:text-[#d6341a]">Email</a>
            </div>
            <ThreadRule label="05  Open work" />
          </div>
        </section>
      </div>
      <span className="sr-only">{frames.length} frames</span>
    </div>
  );
}

function ThreadRule({ label }: { label: string }) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <span className="h-[3px] w-24 bg-[#d6341a] sm:w-40" />
      <span className="text-[11px] uppercase tracking-[0.22em] text-[#8a7364]">{label}</span>
      <span className="h-px flex-1 bg-[#e2d3c3]" />
    </div>
  );
}
