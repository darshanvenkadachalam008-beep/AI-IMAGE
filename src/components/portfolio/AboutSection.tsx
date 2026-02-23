import { Zap, Shield, Cpu } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Energy pulse background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-ember/20 animate-energy-ring" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-electric/30 animate-energy-ring" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-flame to-ember bg-clip-text text-transparent">
          About AUREAVISION
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A next-generation AI Image Generator built for creators who want speed, realism, and cinematic impact. Harness elemental power to create visuals that move audiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Lightning Generation",
              desc: "Create stunning AI visuals in seconds — powered by cutting-edge neural networks.",
              hue: "ember",
            },
            {
              icon: Shield,
              title: "Unlimited & Free",
              desc: "No limits, no paywalls. Generate as many images as you want, forever.",
              hue: "electric",
            },
            {
              icon: Cpu,
              title: "Cinematic Precision",
              desc: "Advanced AI models deliver cinematic quality with every prompt you craft.",
              hue: "plasma",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-card/80 border border-border rounded-xl p-6 hover:border-ember/40 hover:shadow-ember-md transition-all duration-300"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ember/30 rounded-tl-xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ember/30 rounded-br-xl" />

              <item.icon className={`w-10 h-10 mb-4 text-${item.hue} group-hover:animate-ember-pulse`} />
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
