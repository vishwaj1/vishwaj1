import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import prettyPrompt from '@/assets/projects/pretty-prompt.png';
import webTalk from '@/assets/projects/web-talk.png';
import anonymousGradingSystem from '@/assets/projects/anonymous-grading-system.jpeg';
import adaptiveGenreGaming from '@/assets/projects/adaptive-genre-gaming.jpeg';
import distributedFileSystem from '@/assets/projects/Distributed-file-system.jpeg';

const projects = [
  {
    id: 1,
    title: "PrettyPrompt",
    description: "Developed a Next.js and Tailwind CSS frontend with a FastAPI backend and Groq integration to rewrite, shorten, lengthen, and re-tone prompts using multiple LLMs, with real-time scoring and comparison.",
    image: prettyPrompt,
    tags: ["Next.js", "FastAPI", "Groq", "NextAuth", "Prisma"],
    category: "web",
    link: "https://prettyprompt.vercel.app/"
  },
  {
    id: 2,
    title: "Voice-Powered Chrome Extension",
    description: "Built Web Talk at HackHound2025 a hands-free web browsing Chrome extension that converts speech to text and routes commands through Groq + Gemma2-9b-it LLMs.",
    image: webTalk,
    tags: ["Chrome Extension", "WebSpeechAPI", "Groq"],
    category: "web",
    link: "https://github.com/vishwaj1/Web-Talk"
  },
  {
    id: 3,
    title: "Anonymous Grading System",
    description: "Developed a Java-based grading system that automated exam evaluations using barcode scanning, boosting grading speed by 60%. Built with AWS Amplify, Cognito, and DynamoDB.",
    image: anonymousGradingSystem,
    tags: ["Java", "AWS Amplify", "Cognito", "GraphQL"],
    category: "mobile",
    link: "https://github.com/vishwaj1/Anonymous-Grading-System"
  },
  {
    id: 4,
    title: "Adaptive Genre Gaming",
    description: "Designed EpicTale, an AI-driven fiction game that dynamically crafts storylines across genres using player decisions for immersive, replayable narratives.",
    image: adaptiveGenreGaming,
    tags: ["React.js", "OpenAI API", "Node.js"],
    category: "web",
    link: "https://github.com/vishwaj1/EpicTale"
  },
  {
    id: 5,
    title: "Distributed File System",
    description: "Developed a secure peer-to-peer file system with AES encryption and MySQL database integration. Implemented user authentication and file sharing capabilities.",
    image: distributedFileSystem,
    tags: ["Python", "MySQL", "AES Encryption"],
    category: "system",
    link: "https://github.com/vishwaj1/Distributed-File-System"
  },
  {
    id: 6,
    title: "Weapon Detection System",
    description: "Developed a real-time weapon detection system using AlexNet deep learning architecture, achieving 95% accuracy. Reduced processing time by 40% for video stream analysis.",
    image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["AlexNet", "Deep Learning", "Python"],
    category: "ml",
    link: "https://github.com/vishwaj1/WeaponDetectionUsingAlexnet"
  },
];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { ref, isIntersecting } = useIntersectionObserver();

  const filteredProjects = projects.filter(project =>
    activeFilter === "all" || project.category === activeFilter
  );

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "ml", label: "ML" },
    { id: "system", label: "Systems" }
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-secondary/30" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my latest work in web development, AI, and system design
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={isIntersecting ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background text-muted-foreground hover:bg-muted border border-border'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
                    >
                      View Details <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-3 leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2.5 py-0.5 bg-secondary/50 text-muted-foreground rounded-md text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-auto border-t border-border flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 group/link"
                    >
                      Source Code
                      <FaGithub className="transition-transform group-hover/link:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
