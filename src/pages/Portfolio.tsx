import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import AboutSection from "@/components/portfolio/AboutSection";
import CreatorSection from "@/components/portfolio/CreatorSection";
import ContactPanel from "@/components/portfolio/ContactPanel";

const Portfolio = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "AUREAVISION | AI Image Generator";
    const meta = document.querySelector('meta[name="description"]');
    const content = "AUREAVISION — a next-generation AI Image Generator. Create stunning, cinematic visuals powered by elemental AI energy.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = content;
      document.head.appendChild(newMeta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-ember">
      {/* Navbar */}
      <nav className="border-b border-ember/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-ember animate-ember-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-flame to-ember bg-clip-text text-transparent">
              AureaVision
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/generate")}
              className="bg-ember/10 border border-ember/40 text-ember hover:bg-ember/20 hover:shadow-ember-sm transition-all"
              variant="outline"
            >
              <Flame className="w-4 h-4 mr-2" />
              Generate Images
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <PortfolioHero />
        <AboutSection />
        <CreatorSection />
        <ContactPanel />
      </main>

      {/* Footer */}
      <footer className="border-t border-ember/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AureaVision — AI Image Generation Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
