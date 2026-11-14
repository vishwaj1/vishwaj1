import profile from "@/assets/profile-hero.jpg";
import prettyPrompt from "@/assets/projects/pretty-prompt.jpg";
import webTalk from "@/assets/projects/web-talk.png";

export const person = {
  name: "Vishwanth Reddy Jakka",
  role: "Forward-Deployed Engineer",
  line: "I sit with the people doing the work. Then I ship the system.",
  photo: profile,
  email: "vishwanthreddy2601@gmail.com",
  linkedin: "https://www.linkedin.com/in/jvvr/",
  github: "https://github.com/vishwaj1",
  calendly: "https://calendly.com/vishwanthreddyjakka/30min",
  resume: `${import.meta.env.BASE_URL}VishwanthReddyJakka_SoftwareEngineer.pdf`,
};

export const chapters = [
  { id: "open", label: "Open" },
  { id: "lexsy", label: "Lexsy" },
  { id: "umbc", label: "UMBC" },
  { id: "polycom", label: "Polycom" },
  { id: "work", label: "Open work" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const lexsyBeats = [
  {
    kicker: "The room",
    title: "Lawyers, operators, founders.",
    body: "Incorporation, fundraising, equity, hiring, cap tables, signatures. None of it arrived as a clean spec.",
  },
  {
    kicker: "The workflows",
    title: "I stayed until it had a shape.",
    body: "The same people who run the work helped decide what the first version actually was.",
  },
  {
    kicker: "The tools",
    title: "About twenty tools.",
    body: "Read and write are split. CTO, COO, and Growth each get their own room. LexsyScan reads the data room and shows its sources.",
  },
  {
    kicker: "The gate",
    title: "A person still approves.",
    body: "Then it ships. Cost, audit, and tenant lines sit in the system, not in a follow-up doc.",
  },
] as const;

export const cases = {
  lexsy: {
    title: "Lexsy",
    when: "Jul 2025 — present · Remote",
    role: "Founding engineering team",
    sections: [
      {
        heading: "The room",
        body: "I was embedded with lawyers, legal operators, and founders. The work in front of us was incorporation, fundraising, equity, hiring, cap tables, and e-signature. It was a set of real workflows, not a ticket with an answer already written.",
      },
      {
        heading: "What shipped",
        body: "An internal multi-agent platform on Claude Managed Agents and OpenClaw, with Model Context Protocol. About twenty tools, read and write separated, scoped by role, with tenant isolation, approval gates, and structured outputs. Three agents sit behind that: CTO, COO, and Growth. LexsyScan classifies a client data room and answers from it, with sources. Model routing, token telemetry, rate limits, and cost-aware fallbacks keep the spend visible.",
      },
      {
        heading: "What is running",
        body: "The platform is in production for a multi-tenant legal product. RBAC, audit logs, and a human review gate are part of how it supports SOC 2. The number I stand behind on the main page is the tool surface: about twenty tools, each with a job.",
      },
    ],
    stack: "React · TypeScript · Supabase / PostgreSQL · Deno Edge Functions · MCP",
  },
  umbc: {
    title: "UMBC",
    when: "Aug 2023 — May 2025 · Baltimore",
    role: "Graduate software engineer, UMBC",
    sections: [
      {
        heading: "The room",
        body: "Pantry staff and administrators already knew where the work broke. I sat with those constraints: who can request, what is actually on the shelf, and what a bad day looks like at the counter.",
      },
      {
        heading: "What shipped",
        body: "A reservation and inventory platform. React and TypeScript on the front, Node, PostgreSQL, and GraphQL behind it, on AWS. Role-based workflows, authentication, inventory-aware requests, and AI-assisted search and demand insights.",
      },
      {
        heading: "What is running",
        body: "About 3,000 requests a day, with an error rate under 1%. Docker, GitHub Actions, monitoring, and query work brought average API latency from 450 ms to 180 ms.",
      },
    ],
    stack: "React · TypeScript · Node.js · PostgreSQL · GraphQL · AWS",
  },
  polycom: {
    title: "Polycom",
    when: "Apr 2022 — May 2024 · India",
    role: "Software engineer",
    sections: [
      {
        heading: "The room",
        body: "Scheduling, reporting, and structured records. Internal tools for people who already had a way of working and needed it to stop fighting them.",
      },
      {
        heading: "What shipped",
        body: "Features across the interface, the APIs, authentication, the data model, and the deploy. Secure REST services with RBAC, input validation, and audit-friendly requests. A BERT classifier that recommended structured codes.",
      },
      {
        heading: "What is running",
        body: "Page load dropped by 35%. The classifier cut repetitive manual review by 22%.",
      },
    ],
    stack: "React · TypeScript · Node.js · REST · Docker",
  },
} as const;

export type CaseSlug = keyof typeof cases;

export const doors = [
  {
    name: "Pretty Prompt",
    line: "A workspace that rewrites a prompt, scores it, and keeps the history.",
    href: "https://prettyprompt.vercel.app/",
    image: prettyPrompt,
    fit: "cover",
  },
  {
    name: "Web Talk",
    line: "Say what you want. The browser does the next thing.",
    href: "https://github.com/vishwaj1/Web-Talk",
    image: webTalk,
    fit: "contain",
  },
];

/* ------------------------------------------------------------------ home page */

/** The hook, in three voices. Retone cycles through them; the first is the default. */
export const voices = [
  {
    id: "precise",
    label: "precise",
    line: "I sit with the people doing the work.",
    rest: "Then I ship the system.",
    body: "I'm a forward-deployed engineer. I learn a workflow from the people who live it, then build software they actually use, in production.",
  },
  {
    id: "bold",
    label: "bold",
    line: "Messy workflow in.",
    rest: "Production software out.",
    body: "Bring me the problem nobody has written down yet.",
  },
  {
    id: "human",
    label: "human",
    line: "I learn the job",
    rest: "before I build for it.",
    body: "Most of my best ideas come from watching someone work around a tool.",
  },
] as const;

export const hookShort = { line: "I listen.", rest: "Then I ship." } as const;

export const hookExpanded =
  "At Lexsy, I sat with lawyers and founders and built the agent platform they use. At UMBC, the pantry staff knew the constraints; it now handles 3,000 requests a day. At Polycom, pages got 35% faster. Listen first, ship second.";

/** How I work: the method, with where each step showed up. */
export const method = [
  {
    step: "sit with the people",
    body: "I start where the work happens, next to the people doing it, before anything is written down.",
    seen: "lexsy · umbc",
  },
  {
    step: "map the real workflow",
    body: "What actually happens, who signs off, where it breaks. The spec comes out of that, not the other way around.",
    seen: "lexsy · polycom",
  },
  {
    step: "ship to production",
    body: "Real users, real data, and a person approving where it matters.",
    seen: "lexsy · umbc",
  },
  {
    step: "measure it",
    body: "If it didn't get faster or simpler for the people using it, it isn't done.",
    seen: "umbc · polycom",
  },
] as const;

/** Proof: one result per place, each with a field note and its full story. */
export const results = [
  {
    slug: "lexsy",
    org: "lexsy.ai",
    when: "2025 — now",
    stat: "20",
    unit: "MCP tools in production",
    line: "A multi-agent platform with CTO, COO, and Growth agents. LexsyScan reads a client's data room and answers with sources.",
    note: "none of it arrived as a clean spec",
  },
  {
    slug: "umbc",
    org: "umbc pantry",
    when: "2023 — 2025",
    stat: "3,000",
    unit: "requests a day",
    line: "Reservations and inventory for a campus pantry. Error rate under 1%. API latency from 450 ms to 180 ms.",
    note: "the staff already knew the constraints",
  },
  {
    slug: "polycom",
    org: "polycom",
    when: "2022 — 2024",
    stat: "35%",
    unit: "faster pages",
    line: "Scheduling, reporting, and structured records. A BERT classifier cut repetitive manual review by 22%.",
    note: "the pages got out of the way",
  },
] as const;
