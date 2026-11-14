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

export const cases = {
  lexsy: {
    title: "Lexsy",
    when: "Jul 2025 — present · Remote",
    role: "Founding engineer, AI platform",
    sections: [
      {
        heading: "The room",
        body: "Lexsy is a legal workspace where startup founders and their lawyers run every matter: incorporation, hiring, SAFEs, equity grants, cofounder stock, NDAs, and offboarding. I joined as the founding engineer and built most of the product before the team grew.",
      },
      {
        heading: "What shipped",
        body: "A founder portal to run the company and a lawyer portal to run the whole practice, on one shared company record now serving about 50 clients. Two role-scoped agents: Ask Lexsy, which knows the founder's company, collects missing facts in conversation, and drafts documents; and a lawyer agent that works across every company that lawyer is assigned.",
      },
      {
        heading: "The gate",
        body: "Behind both agents, a 106-tool internal MCP server and a 13-tool public server unlock actions by role. Agents prepare the work, but only a lawyer can approve, send for signature, or message the client. Models suggest, rules decide, people approve.",
      },
      {
        heading: "What is running",
        body: "Incorporation runs end to end, from state and trademark name checks to the charter, 83(b), option plan, and SS-4. Drafting runs on Word templates with redlines, so lawyers review a diff instead of a full reread. When the last signature lands in Dropbox Sign, the file is filed to the data room and the cap table updates itself. RAG over client data rooms reaches founders only after a lawyer publishes the findings.",
      },
    ],
    stack: "React · TypeScript · Node.js · NestJS · PostgreSQL / Supabase · MCP · RAG · Dropbox Sign · Stripe",
  },
  umbc: {
    title: "UMBC",
    when: "Aug 2023 — May 2025 · Baltimore",
    role: "Software engineer, campus systems",
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
    when: "Apr 2021 — May 2023 · India",
    role: "Software engineer",
    sections: [
      {
        heading: "The room",
        body: "Enterprise scheduling, reporting, and workflow systems. Internal tools for people who already had a way of working and needed it to stop fighting them.",
      },
      {
        heading: "What shipped",
        body: "REST services, data models, and interfaces for scheduling, reporting, and workflow features, with RBAC. I also contributed to a BERT-assisted document classification workflow that suggested categories to reviewers.",
      },
      {
        heading: "What is running",
        body: "Reporting dashboards got 35% faster through query and data-flow work. The classification workflow cut repetitive manual review by 22%.",
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
  "At Lexsy, I built most of the legal workspace founders and their lawyers use, now serving about 50 clients. At UMBC, the pantry staff knew the constraints; it now handles 3,000 requests a day. At Polycom, reporting got 35% faster. Listen first, ship second.";

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
    stat: "106",
    unit: "MCP tools behind two agents",
    line: "Most of a legal workspace for founders and their lawyers, serving about 50 clients. Agents prepare the work; only a lawyer can approve, sign, or message the client.",
    note: "models suggest, rules decide, people approve",
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
    when: "2021 — 2023",
    stat: "35%",
    unit: "faster reporting dashboards",
    line: "Scheduling, reporting, and workflow systems with RBAC. A BERT-assisted classification workflow cut repetitive manual review by 22%.",
    note: "the pages got out of the way",
  },
] as const;
