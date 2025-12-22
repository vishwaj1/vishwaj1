import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const experiences = [
  {
    title: "Software Engineer",
    company: "Lexsy.ai",
    period: "July 2025 - Present",
    description: [
      "Building and scaling a legal-tech automation platform with a microservices architecture (Node.js, Express, PostgreSQL, Docker, Temporal).",
      "Developed secure, role-based client and lawyer workflows, enabling automated compliance document generation (Stripe, DocuSign, Dropbox integrations).",
      "Designed RESTful APIs and inter-service communication protocols to streamline onboarding, engagement agreements, and regulatory filings.",
      "Improved front-end experience by implementing responsive React/Next.js components with real-time workflow tracking."
    ]
  },
  {
    title: "Software Engineer",
    company: "University of Maryland Baltimore County",
    period: "Aug 2024 - May 2025",
    description: [
      "Delivered Campus Pantry, a real-time meal-reservation site that lowers food waste and aids food-insecure students.",
      "Built React and TypeScript front end with Redux and Google Maps, mobile loads under one second for more than two thousand users.",
      "Designed REST and GraphQL APIs with Node.js, Express, PostgreSQL, implemented JWT role-based auth, and sustained about 3000 reservation requests per day with an error rate under one percent.",
      "Containerised services in Docker and wired a GitHub Actions CI/CD pipeline for blue-green deployments on AWS EC2 and RDS, added OpenTelemetry and Grafana monitoring that cut average API latency from 450 ms to 180 ms."
    ]
  },
  {
    title: "Full Stack Developer",
    company: "Polycom Inc",
    period: "April 2022 - May 2023",
    description: [
      "Helped rebuild a hospital dashboard using React + TypeScript, cutting load time by 35% and improving overall user experience.",
      "Developed secure APIs in Node.js for patient scheduling and reports, using JWT/OAuth for login and data protection.",
      "Containerized the app using Docker, and worked on Kubernetes deployment with auto-scaling and smooth updates.",
      "Added an AI-powered feature that suggests diagnosis codes using a BERT model, reducing manual work for doctors by 22%."
    ]
  }
];

export function ExperienceSection() {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section id="experience" className="py-24 px-6 bg-secondary/20" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey in software engineering and cloud architecture
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-border md:left-1/2 md:-ml-[1px]"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                initial={{ opacity: 0, y: 30 }}
                animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full border-[3px] border-background bg-primary z-10 md:left-1/2 md:-ml-5 flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Content Card */}
                <div className="ml-16 md:ml-0 md:w-[calc(50%-40px)]">
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-base font-medium text-muted-foreground mb-4">
                      {exp.company}
                    </p>
                    <ul className="space-y-3">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-foreground/80 leading-relaxed">
                          <span className="mr-2.5 mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-[calc(50%-40px)]"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}