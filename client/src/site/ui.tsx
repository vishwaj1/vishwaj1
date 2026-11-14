/**
 * Shared look for the home page, case pages, 404 and /hi.
 * Prompt theme type (Instrument Serif, Outfit, IBM Plex Mono) with
 * Sycamore-style boxed, lowercase, monospace buttons. Terracotta is the one accent.
 */
import type { ComponentType } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CalendarDays, FileText, Mail } from "lucide-react";
import { person } from "./copy";

export const serif = { fontFamily: '"Instrument Serif", "Iowan Old Style", Georgia, serif' } as const;
export const sans = { fontFamily: '"Outfit", system-ui, sans-serif' } as const;

export const color = {
  ink: "#0c0b09",
  cream: "#f3efe6",
  body: "#c9c2b5",
  muted: "#a39e93",
  line: "#2a2622",
  box: "#3a352f",
  accent: "#d4845a",
  accentHover: "#e0956b",
  onAccent: "#1a120b",
} as const;

/** Monospace, as a class so Tailwind sees it. */
export const mono = "font-['IBM_Plex_Mono',ui-monospace,monospace]";

/** Small lowercase label, e.g. "01 · lexsy.ai". 12px minimum for legibility on phones. */
export const label = `${mono} text-[12px] lowercase tracking-[0.06em] text-[#a39e93]`;

const boxBase = `${mono} inline-flex min-h-[44px] items-center justify-center gap-2 border px-4 text-[13px] lowercase leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4845a]`;

/** The one filled action on a screen. */
export const boxPrimary = `${boxBase} border-[#d4845a] bg-[#d4845a] font-medium text-[#1a120b] hover:border-[#e0956b] hover:bg-[#e0956b] active:bg-[#e0956b]`;
/** Everything else. */
export const boxSecondary = `${boxBase} border-[#3a352f] text-[#f3efe6] hover:border-[#6b645a] active:bg-white/5`;
/** A selected toggle or control. */
export const boxActive = `${boxBase} border-[#f3efe6] bg-[#f3efe6] text-[#0c0b09]`;

/** Underlined mono text link for quiet actions. */
export const textLink = `${mono} inline-flex min-h-[44px] items-center text-[13px] lowercase text-[#c9c2b5] underline underline-offset-4 hover:text-[#f3efe6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4845a]`;

type Icon = ComponentType<{ className?: string; size?: number | string; "aria-hidden"?: boolean | "true" | "false" }>;

export type ContactKind = "linkedin" | "calendly" | "email" | "github" | "resume";

export const contacts: Record<ContactKind, { label: string; href: string; external: boolean; Icon: Icon }> = {
  linkedin: { label: "connect on linkedin", href: person.linkedin, external: true, Icon: FaLinkedinIn },
  calendly: { label: "book a call", href: person.calendly, external: true, Icon: CalendarDays },
  email: { label: "email", href: `mailto:${person.email}`, external: false, Icon: Mail },
  github: { label: "github", href: person.github, external: true, Icon: FaGithub },
  resume: { label: "resume", href: person.resume, external: true, Icon: FileText },
};

/** A contact as a boxed button with its logo. Labels stay visible: logos alone are harder to read. */
export function ContactButton({
  kind,
  primary = false,
  text,
  className = "",
  onClick,
}: {
  kind: ContactKind;
  primary?: boolean;
  text?: string;
  className?: string;
  onClick?: () => void;
}) {
  const c = contacts[kind];
  return (
    <a
      href={c.href}
      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={onClick}
      className={`${primary ? boxPrimary : boxSecondary} ${className}`}
    >
      <c.Icon className="h-4 w-4 shrink-0" size={16} aria-hidden />
      <span>
        {text ?? c.label}
        {c.external && kind !== "resume" ? " ↗" : ""}
      </span>
    </a>
  );
}

/** Closing block: one filled LinkedIn action, then the other contacts with logos. */
export function Closing({
  education = false,
  onLinkedIn,
  onCalendly,
}: {
  education?: boolean;
  onLinkedIn?: () => void;
  onCalendly?: () => void;
}) {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-[#2a2622] pt-10">
      <p className="text-[2.25rem] leading-[1.05] text-[#f3efe6] sm:text-5xl" style={serif}>
        Working on something hard <i className="text-[#d4845a]">with real users? Let's talk.</i>
      </p>
      <ContactButton kind="linkedin" primary onClick={onLinkedIn} className="mt-7 w-full sm:w-auto sm:px-6" />
      <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <ContactButton kind="calendly" onClick={onCalendly} className="justify-start" />
        <ContactButton kind="email" className="justify-start" />
        <ContactButton kind="github" className="justify-start" />
        <ContactButton kind="resume" className="justify-start" />
      </div>
      {education && <p className={`${label} mt-8`}>ms computer science, umbc 2025 · be, vasavi 2023</p>}
    </section>
  );
}
