import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EnergyCanvas from "./EnergyCanvas";

const PortfolioHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Canvas animation */}
      <EnergyCanvas />

      {/* Radial glow background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />

      {/* Floating ember orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-ember/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-electric/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Energy badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border border-ember/30 bg-ember/5 shadow-ember-sm animate-ember-pulse">
          <Flame className="w-4 h-4 text-ember" />
          <span className="text-sm font-medium text-ember">Elemental AI Power</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-flame via-ember to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(15_90%_55%/0.4)]">
            AUREAVISION
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
          Unleash cinematic AI imagery with elemental power
        </p>
        <p className="text-base text-muted-foreground/70 max-w-xl mx-auto mb-10">
          Create stunning, high-resolution visuals powered by next-generation AI — fast, limitless, and breathtaking.
        </p>

        <Button
          onClick={() => navigate("/generate")}
          size="lg"
          className="bg-gradient-to-r from-flame to-ember text-primary-foreground hover:shadow-ember-lg transition-all duration-300 text-lg px-8 py-6 font-semibold"
        >
          <Flame className="w-5 h-5 mr-2" />
          Generate Images
        </Button>

        {/* Decorative energy sigil */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-ember/30 animate-sigil-spin" />
            <div className="absolute inset-3 rounded-full border border-electric/20 animate-sigil-spin" style={{ animationDirection: "reverse" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-ember rounded-full shadow-ember-md animate-ember-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioHero;
