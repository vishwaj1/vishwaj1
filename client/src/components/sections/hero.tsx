import { motion } from "framer-motion";
import profileImage from '@/assets/profile.jpeg';
import { FaFileAlt, FaLinkedin, FaGithub, FaCalendarAlt } from 'react-icons/fa';

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function HeroSection() {
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Let's Connect! 👋",
        description: "Schedule a chat with me!",
        action: (
          <a
            href="https://calendly.com/vishwanthreddyjakka/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Book Call
          </a>
        ),
        duration: 8000,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center py-20 bg-background relative overflow-hidden">
      {/* Background Gradient Spot - subtle */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-lg text-muted-foreground mb-4 font-medium tracking-wide">Hello, I'm</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight">
                Vishwanth <span className="text-primary">Reddy</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-medium text-foreground/80 mb-6">
                Software Engineer
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Focused on building scalable web applications and integrating AI to create smarter, more intuitive user experiences. Skilled across the full stack — from crafting responsive frontends to designing robust backend systems and deploying them in the cloud.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <a
                href={`${import.meta.env.BASE_URL}VishwanthReddyJakka_SoftwareEngineer.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <FaFileAlt />
                <span>Resume</span>
              </a>

              <a
                href="http://linkedin.com/in/jvvr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-accent hover:text-accent-foreground text-foreground text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://calendly.com/vishwanthreddyjakka/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <FaCalendarAlt />
                <span>Connect</span>
              </a>

              <a
                href="https://github.com/vishwaj1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-accent hover:text-accent-foreground text-foreground text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md group">
              {/* Abstract decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/50">
                <img
                  src={profileImage}
                  alt="Vishwanth Reddy Jakka"
                  className="w-full aspect-square object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
