import profile from "@/assets/profile.jpeg";
import prettyPrompt from "@/assets/projects/pretty-prompt.png";
import webTalk from "@/assets/projects/web-talk.png";

export const person = {
  name: "Vishwanth Reddy Jakka",
  role: "Forward-Deployed Engineer, Charlotte",
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
  pantry: {
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
  },
  {
    name: "Web Talk",
    line: "Say what you want. The browser does the next thing.",
    href: "https://github.com/vishwaj1/Web-Talk",
    image: webTalk,
  },
];
