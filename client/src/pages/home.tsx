import { Navigation } from "@/components/navigation";
import { CustomCursor } from "@/components/ui/cursor";
import { LoadingBar } from "@/components/ui/loading-bar";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { EducationSection } from "@/components/sections/education";
import { useCustomCursor } from "@/hooks/use-custom-cursor";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";

export default function Home() {
  useCustomCursor();

  return (
    <div className="custom-cursor">
      <LoadingBar />
      <CustomCursor />
      <Navigation />
      <VisitorTracker />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
