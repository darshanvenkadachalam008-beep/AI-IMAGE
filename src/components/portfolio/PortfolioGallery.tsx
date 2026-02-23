import { useState } from "react";
import { Download, X, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PortfolioImage {
  id: string;
  src: string;
  prompt: string;
  category: string;
  tag: string;
}

const CATEGORIES = ["All", "Alien Forms", "Futuristic Heroes", "Sci-Fi Landscapes", "Cyber Creatures"] as const;

const TAG_COLORS: Record<string, string> = {
  Alien: "border-neon/50 text-neon bg-neon/10",
  "Sci-Fi": "border-sky-400/50 text-sky-400 bg-sky-400/10",
  Neon: "border-fuchsia-400/50 text-fuchsia-400 bg-fuchsia-400/10",
  Cinematic: "border-amber-400/50 text-amber-400 bg-amber-400/10",
};

// Showcase images with prompts users can recreate
const SHOWCASE_IMAGES: PortfolioImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&q=80",
    prompt: "A towering alien warrior with translucent crystal armor standing on a volcanic moon, bioluminescent markings pulsing across its body",
    category: "Alien Forms",
    tag: "Alien",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    prompt: "Futuristic hero in sleek nano-fiber suit overlooking a neon-lit megacity at dusk, holographic shield activated",
    category: "Futuristic Heroes",
    tag: "Sci-Fi",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    prompt: "Alien planet landscape with floating crystalline islands, twin suns casting prismatic light through a nebula sky",
    category: "Sci-Fi Landscapes",
    tag: "Cinematic",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80",
    prompt: "Biomechanical cyber creature with neon-green energy veins, standing in a dark alien forest emitting bioluminescent spores",
    category: "Cyber Creatures",
    tag: "Neon",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&q=80",
    prompt: "Shape-shifting alien entity made of pure cosmic energy, fractal patterns forming its humanoid silhouette",
    category: "Alien Forms",
    tag: "Alien",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80",
    prompt: "Armored space explorer on an asteroid belt, jetpack flames illuminating ancient alien ruins carved into rock",
    category: "Futuristic Heroes",
    tag: "Cinematic",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80",
    prompt: "Vast alien ocean world with colossal bioluminescent jellyfish floating above a submerged crystal city",
    category: "Sci-Fi Landscapes",
    tag: "Sci-Fi",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    prompt: "Swarm of nano-mechanical insects forming a protective shield around their organic alien queen",
    category: "Cyber Creatures",
    tag: "Neon",
  },
];

const PortfolioGallery = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [showPrompts, setShowPrompts] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = activeCategory === "All"
    ? SHOWCASE_IMAGES
    : SHOWCASE_IMAGES.filter((img) => img.category === activeCategory);

  const togglePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPrompts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const downloadImage = async (src: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aureavision-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download");
    }
  };

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-neon drop-shadow-[0_0_10px_hsl(120_100%_50%/0.3)]">
          Gallery
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Browse by category — click any image for full view
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-neon/20 border-neon text-neon shadow-neon-sm"
                  : "border-border text-muted-foreground hover:border-neon/40 hover:text-neon"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative rounded-xl overflow-hidden border border-border bg-card cursor-pointer hover:border-neon/50 hover:shadow-neon-md transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                {!loadedImages.has(img.id) && <Skeleton className="absolute inset-0" />}
                <img
                  src={img.src}
                  alt={img.prompt}
                  loading="lazy"
                  onLoad={() => setLoadedImages((p) => new Set(p).add(img.id))}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                    loadedImages.has(img.id) ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* Scan-line overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-neon/5" />
                  <div className="absolute w-full h-1/3 bg-gradient-to-b from-neon/10 to-transparent animate-scan-line" />
                </div>
                {/* View icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-8 h-8 text-neon drop-shadow-[0_0_10px_hsl(120_100%_50%/0.6)]" />
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={TAG_COLORS[img.tag] || "border-border text-foreground"}>
                    {img.tag}
                  </Badge>
                  <button
                    onClick={(e) => togglePrompt(img.id, e)}
                    className="text-xs text-muted-foreground hover:text-neon transition-colors"
                  >
                    {showPrompts.has(img.id) ? "Hide prompt" : "Show prompt"}
                  </button>
                </div>
                {showPrompts.has(img.id) && (
                  <p className="text-xs text-muted-foreground leading-relaxed animate-fade-in">
                    {img.prompt}
                  </p>
                )}
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/generate");
                  }}
                  className="w-full bg-neon/10 border border-neon/30 text-neon hover:bg-neon/20 hover:shadow-neon-sm transition-all"
                  variant="outline"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate Similar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-neon hover:bg-neon/10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="max-w-4xl max-h-[90vh] flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.prompt}
              className="max-w-full max-h-[70vh] object-contain rounded-xl border border-neon/30 shadow-neon-md"
            />
            <div className="bg-card border border-neon/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={TAG_COLORS[selectedImage.tag]}>
                  {selectedImage.tag}
                </Badge>
                <span className="text-xs text-muted-foreground">{selectedImage.category}</span>
              </div>
              <p className="text-sm text-foreground">{selectedImage.prompt}</p>
              <Button
                onClick={(e) => downloadImage(selectedImage.src, e)}
                variant="outline"
                size="sm"
                className="w-full border-neon/40 text-neon hover:bg-neon/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGallery;