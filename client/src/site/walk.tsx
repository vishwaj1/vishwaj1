import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "wouter";
import { cases, chapters, doors, lexsyBeats, person, type ChapterId } from "./copy";

const display = { fontFamily: '"Instrument Serif", serif' } as const;
const sans = { fontFamily: '"Inter Tight", sans-serif' } as const;

function useMediaMatch(queryText: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(queryText);
    const apply = () => setMatches(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [queryText]);
  return matches;
}

export default function Walk() {
  const reduced = useMediaMatch("(prefers-reduced-motion: reduce)");
  const narrow = useMediaMatch("(max-width: 767px)");
  const { scrollYProgress } = useScroll();
  const background = useTransform(
    scrollYProgress,
    [0, 0.28, 0.55, 0.82, 1],
    ["#14110e", "#1b1612", "#4a3d32", "#e6dccb", "#f6f3ee"],
  );
  const foreground = useTransform(
    scrollYProgress,
    [0, 0.5, 0.68, 1],
    ["#f6f1e8", "#f6f1e8", "#1c1917", "#1c1917"],
  );
  const [active, setActive] = useState<ChapterId>("open");

  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, [reduced]);

  useEffect(() => {
    const mark = () => {
      const line = window.innerHeight * 0.42;
      let current: ChapterId = "open";
      for (const chapter of chapters) {
        const node = document.getElementById(chapter.id);
        if (!node) continue;
        const box = node.getBoundingClientRect();
        if (box.top <= line && box.bottom >= line) current = chapter.id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", mark);
    return () => {
      window.removeEventListener("scroll", mark);
      window.removeEventListener("resize", mark);
    };
  }, []);

  return (
    <motion.div style={{ ...sans, color: foreground }} className="relative min-h-screen">
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: background }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 top-0 z-50 w-[3px] origin-top bg-[#e2a15a]"
        style={{ scaleY: reduced ? 1 : scrollYProgress }}
      />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-between gap-1 border-t border-white/10 bg-[#14110e]/85 px-2 py-2 text-[11px] uppercase tracking-[0.14em] text-[#f6f1e8] backdrop-blur md:bottom-auto md:left-5 md:right-auto md:top-1/2 md:w-28 md:-translate-y-1/2 md:flex-col md:gap-3 md:border-0 md:bg-transparent md:p-0 md:text-inherit md:backdrop-blur-none"
        style={sans}
      >
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={active === chapter.id ? "page" : undefined}
            className={`rounded-sm px-1 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a] ${
              active === chapter.id ? "text-[#e2a15a]" : "opacity-70 hover:opacity-100"
            }`}
          >
            {chapter.label}
          </a>
        ))}
      </nav>

      <div className="fixed right-4 top-4 z-40 flex items-center gap-3 text-[12px] uppercase tracking-[0.16em]" style={sans}>
        <a className="opacity-80 hover:opacity-100" href={person.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
        <a className="bg-[#e2a15a] px-3 py-2 text-[#1c1917] hover:bg-[#efb56e]" href={person.calendly} target="_blank" rel="noreferrer">
          Book a call
        </a>
      </div>

      <main className="px-5 pb-24 md:pb-16 md:pl-40 md:pr-10">
        <OpenScene reduced={reduced} />
        <LexsyScene reduced={reduced || narrow} />
        <PantryScene reduced={reduced} />
        <PolycomScene reduced={reduced} />
        <WorkScene />
      </main>
    </motion.div>
  );
}

function OpenScene({ reduced }: { reduced: boolean }) {
  return (
    <section id="open" className="flex min-h-[100svh] scroll-mt-6 flex-col justify-start pb-16 pt-24 lg:justify-end">
      <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
        <div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7.4rem)] leading-[0.86] tracking-[-0.03em]"
            style={display}
          >
            Vishwanth
            <br />
            Reddy Jakka
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-8 max-w-xl text-2xl leading-snug sm:text-3xl"
            style={display}
          >
            {person.line}
          </motion.p>
          <p className="mt-5 text-sm uppercase tracking-[0.18em] opacity-70">{person.role}</p>
        </div>
        <motion.img
          src={person.photo}
          alt={person.name}
          initial={reduced ? false : { opacity: 0, filter: "blur(16px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="aspect-[4/5] w-full max-w-[220px] object-cover object-[center_18%] sm:max-w-xs lg:aspect-[3/4] lg:max-w-sm lg:justify-self-end"
        />
      </div>
      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-[#e2a15a]">Scroll the room</p>
    </section>
  );
}

function LexsyScene({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [beat, setBeat] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduced) return;
    const next = value < 0.25 ? 0 : value < 0.5 ? 1 : value < 0.75 ? 2 : 3;
    setBeat((current) => (current === next ? current : next));
  });

  const copy = lexsyBeats[beat];

  if (reduced) {
    return (
      <section id="lexsy" className="scroll-mt-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#e2a15a]">Lexsy · founding team</p>
        <div className="mt-8 space-y-10">
          {lexsyBeats.map((item) => (
            <article key={item.kicker} className="border-t border-[#e2a15a] pt-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#e2a15a]">{item.kicker}</p>
              <h2 className="mt-3 text-4xl leading-[0.95]" style={display}>
                {item.title}
              </h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed opacity-80">{item.body}</p>
            </article>
          ))}
        </div>
        <Link href="/work/lexsy" className="mt-10 inline-block text-sm uppercase tracking-[0.16em] text-[#e2a15a]">
          Stay with Lexsy
        </Link>
      </section>
    );
  }

  return (
    <section id="lexsy" ref={ref} className="h-[320vh] scroll-mt-6">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#e2a15a]">Lexsy · founding team</p>
        <div className="mt-6 grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={copy.kicker}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-5xl leading-[0.95] sm:text-6xl" style={display}>
                  {copy.title}
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed opacity-80">{copy.body}</p>
              </motion.div>
            </AnimatePresence>
            <Link href="/work/lexsy" className="mt-8 inline-block text-sm uppercase tracking-[0.16em] text-[#e2a15a] hover:underline">
              Stay with Lexsy
            </Link>
          </div>
          <ol className="grid gap-4 lg:grid-cols-4">
            {lexsyBeats.map((item, index) => {
              const on = index <= beat;
              return (
                <li key={item.kicker} className={`border-t pt-3 transition ${on ? "border-[#e2a15a]" : "border-current/25"}`}>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#e2a15a]">{item.kicker}</span>
                  <p className="mt-3 text-sm leading-relaxed">{item.title}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PantryScene({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const [requests, setRequests] = useState(reduced ? 3000 : 0);
  const [latency, setLatency] = useState(reduced ? 180 : 450);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setRequests(Math.round(eased * 3000));
      setLatency(Math.round(450 - eased * 270));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced]);

  return (
    <section id="pantry" ref={ref} className="flex min-h-[100svh] scroll-mt-6 flex-col justify-center py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">Campus Pantry · UMBC</p>
      <p className="mt-4 max-w-xl text-3xl leading-snug sm:text-4xl" style={display}>
        The staff already knew the constraints. I built the line around them.
      </p>
      <div className="mt-10 flex flex-wrap items-end gap-12">
        <p>
          <span className="block text-7xl leading-none sm:text-8xl" style={display}>
            {requests.toLocaleString()}
          </span>
          <span className="mt-2 block text-sm uppercase tracking-[0.16em] opacity-70">requests a day</span>
        </p>
        <p>
          <span className="block text-7xl leading-none text-[#e2a15a] sm:text-8xl" style={display}>
            {latency}
            <span className="ml-2 text-2xl">ms</span>
          </span>
          <span className="mt-2 block text-sm uppercase tracking-[0.16em] opacity-70">from 450</span>
        </p>
      </div>
      <Link href="/work/pantry" className="mt-10 text-sm uppercase tracking-[0.16em] text-[#e2a15a] hover:underline">
        Stay with the pantry
      </Link>
    </section>
  );
}

function PolycomScene({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.55, once: true });
  const play = inView || reduced;

  return (
    <section id="polycom" ref={ref} className="flex min-h-[90svh] scroll-mt-6 flex-col justify-center py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">Polycom · India</p>
      <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-5xl leading-[0.95] sm:text-6xl" style={display}>
            The pages got out of the way.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed opacity-80">
            Scheduling, reporting, records. Load time down 35%. A classifier cut the repetitive review by 22%.
          </p>
          <Link href="/work/polycom" className="mt-8 inline-block text-sm uppercase tracking-[0.16em] text-[#e2a15a] hover:underline">
            Stay with Polycom
          </Link>
        </div>
        <div className="space-y-3" aria-hidden>
          {[100, 78, 46].map((width, index) => (
            <motion.div
              key={width}
              className="h-3 bg-current/80"
              initial={false}
              animate={{ width: play ? `${width * 0.65}%` : "100%", opacity: play ? 1 - index * 0.2 : 0.35 }}
              transition={{ duration: reduced ? 0 : 0.9, delay: index * 0.08 }}
            />
          ))}
          <p className="pt-4 text-4xl" style={display}>
            35% faster
          </p>
        </div>
      </div>
    </section>
  );
}

function WorkScene() {
  return (
    <section id="work" className="scroll-mt-6 pb-20 pt-16">
      <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">Things you can open</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {doors.map((door) => (
          <a key={door.name} href={door.href} target="_blank" rel="noreferrer" className="group block">
            <span className="block overflow-hidden">
              <img
                src={door.image}
                alt=""
                className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-80"
              />
            </span>
            <span className="mt-4 block text-4xl" style={display}>
              {door.name}
            </span>
            <span className="mt-2 block max-w-sm opacity-75">{door.line}</span>
          </a>
        ))}
      </div>

      <div className="mt-24 max-w-xl">
        <p className="text-3xl leading-snug" style={display}>
          MS in Computer Science, UMBC, 2025. BE from Vasavi, 2023.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase tracking-[0.16em]">
          <a className="hover:text-[#e2a15a]" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-[#e2a15a]" href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-[#e2a15a]" href={`mailto:${person.email}`}>Email</a>
          <a className="hover:text-[#e2a15a]" href={person.calendly} target="_blank" rel="noreferrer">Book a call</a>
          <a className="hover:text-[#e2a15a]" href={person.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
    </section>
  );
}

export function CasePage({ slug }: { slug: string }) {
  const key = slug as keyof typeof cases;
  const story = cases[key];

  if (!story) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-6 py-16 text-[#1c1917]" style={sans}>
        <p>That page is not on this walk.</p>
        <Link href="/" className="mt-4 inline-block text-[#9a3412]">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-16 text-[#1c1917] md:px-10" style={sans}>
      <div className="mx-auto max-w-2xl">
        <a href={`/#${key}`} className="text-[12px] uppercase tracking-[0.18em] text-[#9a3412]">
          Back to the walk
        </a>
        <p className="mt-10 text-[12px] uppercase tracking-[0.18em] opacity-60">{story.role}</p>
        <h1 className="mt-3 text-6xl leading-[0.92] sm:text-7xl" style={display}>
          {story.title}
        </h1>
        <p className="mt-4 opacity-70">{story.when}</p>
        <div className="mt-12 space-y-10">
          {story.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl" style={display}>
                {section.heading}
              </h2>
              <p className="mt-3 text-lg leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-14 text-sm uppercase tracking-[0.14em] opacity-60">{story.stack}</p>
      </div>
    </main>
  );
}
