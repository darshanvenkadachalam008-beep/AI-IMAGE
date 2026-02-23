import { User, Code, Sparkles } from "lucide-react";

const CreatorSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-flame to-ember bg-clip-text text-transparent">
          The Creator
        </h2>

        <div className="max-w-lg mx-auto relative">
          {/* Outer energy ring */}
          <div className="absolute -inset-4 rounded-2xl border border-ember/10 animate-ember-pulse" />

          <div className="relative bg-card/90 border border-ember/30 rounded-xl p-8 shadow-ember-md text-center">
            {/* Avatar ring */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-ember/50 animate-energy-ring" />
              <div className="absolute inset-1 rounded-full border border-electric/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-ember/10 flex items-center justify-center border border-ember/30">
                  <User className="w-8 h-8 text-ember" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-flame to-ember bg-clip-text text-transparent mb-1 tracking-wide">
              DARSHAN.V
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="w-4 h-4 text-ember/70" />
              <span className="text-sm text-muted-foreground">Creator & Developer of AUREAVISION</span>
              <Sparkles className="w-4 h-4 text-ember/70" />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Passionate about merging AI with cinematic design to build tools that empower creators worldwide. AUREAVISION is the result of that vision.
            </p>

            {/* Decorative bottom bar */}
            <div className="mt-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-ember/40"
                  style={{ opacity: 1 - i * 0.15 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorSection;
