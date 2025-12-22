import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const education = [
  {
    school: "University of Maryland Baltimore County",
    degree: "Master of Science in Computer Science",
    period: "Aug 2023 - May 2025",
    gpa: "3.81/4.0"
  },
  {
    school: "Vasavi College of Engineering",
    degree: "Bachelor of Science in Computer Science",
    period: "Aug 2019 - May 2023",
    gpa: "3.6/4.0"
  }
];

export function EducationSection() {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section id="education" className="py-24 px-6 bg-background" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic background and achievements
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-border md:left-1/2 md:-ml-[1px]"></div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                initial={{ opacity: 0, y: 30 }}
                animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full border-[3px] border-background bg-secondary z-10 md:left-1/2 md:-ml-5 flex items-center justify-center">
                  <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                </div>

                {/* Content Card */}
                <div className="ml-16 md:ml-0 md:w-[calc(50%-40px)]">
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold mb-3">
                      {edu.period}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {edu.school}
                    </h3>
                    <p className="text-base font-medium text-primary mb-2">
                      {edu.degree}
                    </p>
                    <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                  </div>
                </div>

                {/* Empty place holder for alignment */}
                <div className="hidden md:block md:w-[calc(50%-40px)]"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}