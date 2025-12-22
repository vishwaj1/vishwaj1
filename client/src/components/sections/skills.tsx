import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export function AboutSection() {
  const { ref, isIntersecting } = useIntersectionObserver();

  const skills = {
    "Programming Languages": ["Python", "Java", "JavaScript", "TypeScript", "Bash", "SQL"],
    "Frontend Technologies": ["Next.js", "React.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Vuetify"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB"],
    "Backend Technologies": ["Node.js", "FastAPI", "Flask", "Django", "Spring", "Celery", "gRPC", "RESTful APIs", "GraphQL", "Redis", "Nginx"],
    "Cloud & Infrastructure": ["AWS", "EC2", "S3", "RDS", "Lambda", "CloudFormation", "Amplify", "Cognito", "API Gateway", "SQS", "Microsoft Azure", "GCP"],
    "CI/CD & DevOps": ["Docker", "Kubernetes", "Docker Compose", "GitHub Actions", "Jenkins", "GitLab CI", "Terraform"],
    "System Design": ["Microservices", "High Availability", "Scalability", "Fault Tolerance", "API Design"],
    "Other Tools": ["Prisma", "OpenTelemetry", "Grafana", "NextAuth", "Vercel", "Render"]
  };

  return (
    <section id="about" className="py-24 px-6 bg-background" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building scalable, high-performance applications
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div
              key={category}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-foreground pb-2 border-b border-border/50">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
