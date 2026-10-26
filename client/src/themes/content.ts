import profile from "@/assets/profile.jpeg";
import prettyPrompt from "@/assets/projects/pretty-prompt.png";
import webTalk from "@/assets/projects/web-talk.png";

export const person = {
  name: "Vishwanth Reddy Jakka",
  short: "Vishwanth Reddy",
  mark: "VRJ",
  role: "Forward-Deployed Engineer",
  place: "Charlotte, NC",
  email: "vishwanthreddy2601@gmail.com",
  linkedin: "https://www.linkedin.com/in/jvvr/",
  github: "https://github.com/vishwaj1",
  calendly: "https://calendly.com/vishwanthreddyjakka/30min",
  resume: `${import.meta.env.BASE_URL}VishwanthReddyJakka_SoftwareEngineer.pdf`,
  photo: profile,
};

export const tones = [
  {
    id: "precise",
    label: "Precise",
    kicker: "Forward-deployed",
    line: "Embedded with the problem.",
    rest: "Then I ship the system.",
    body: "I sit with lawyers, operators, and founders and turn an unclear workflow into software that is actually in production.",
  },
  {
    id: "bold",
    label: "Bold",
    kicker: "Founding engineer, Lexsy",
    line: "Ambiguous in.",
    rest: "Production out.",
    body: "A multi-agent legal platform. About twenty MCP tools. Three internal agents. A human still approves the gate.",
  },
  {
    id: "human",
    label: "Human",
    kicker: "Charlotte",
    line: "I stay in the room",
    rest: "until the software works.",
    body: "Five years of building next to the people who use the thing — pantry staff, lawyers, operators — not from a ticket queue.",
  },
] as const;

export const proofs = [
  {
    org: "Lexsy.ai",
    when: "2025 — now",
    role: "Founding engineering",
    stat: "20",
    unit: "MCP tools",
    line: "Multi-agent legal platform. CTO, COO, and Growth agents. LexsyScan searches the data room. Spend is routed, capped, and reviewed.",
  },
  {
    org: "UMBC",
    when: "2023 — 2025",
    role: "Campus Pantry",
    stat: "3,000",
    unit: "requests / day",
    line: "Reservation and inventory for a campus pantry. Error rate under 1%. API latency from 450 ms to 180 ms.",
  },
  {
    org: "Polycom",
    when: "2022 — 2024",
    role: "Workflow systems",
    stat: "35%",
    unit: "faster pages",
    line: "Scheduling, reporting, and structured records. A BERT classifier cut repetitive manual review by 22%.",
  },
];

export const projects = [
  {
    name: "Pretty Prompt",
    line: "Rewrite, score, and compare prompts. History and templates stay with the workspace.",
    stack: "Next.js · FastAPI · Groq",
    href: "https://prettyprompt.vercel.app/",
    image: prettyPrompt,
  },
  {
    name: "Web Talk",
    line: "Spoken commands become browser actions. Navigate, summarize, ask the page.",
    stack: "Chrome · Web Speech · Groq",
    href: "https://github.com/vishwaj1/Web-Talk",
    image: webTalk,
  },
];

export type ThemeId = "prompt" | "thread" | "signal";

export const themeMeta: { id: ThemeId; index: string; name: string; note: string }[] = [
  {
    id: "prompt",
    index: "01",
    name: "The Prompt",
    note: "The page is a sentence you can shorten, retone, and expand. Same verbs as Pretty Prompt.",
  },
  {
    id: "thread",
    index: "02",
    name: "The Red Thread",
    note: "Your name is the brand. One vermillion line runs through a sideways film of the work.",
  },
  {
    id: "signal",
    index: "03",
    name: "Signal Room",
    note: "A console of systems you have shipped. Open an instrument to read the proof.",
  },
];
