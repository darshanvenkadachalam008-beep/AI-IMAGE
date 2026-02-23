import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface CustomizationOptions {
  style: string;
  mood: string;
  lighting: string;
  aspectRatio: string;
}

interface CustomizationControlsProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

const STYLES = [
  { value: "none", label: "No specific style" },
  { value: "photorealistic", label: "Photorealistic" },
  { value: "digital-art", label: "Digital Art" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "anime", label: "Anime / Manga" },
  { value: "3d-render", label: "3D Render" },
  { value: "concept-art", label: "Concept Art" },
  { value: "art-deco", label: "Art Deco" },
  { value: "minimalist", label: "Minimalist" },
  { value: "surreal", label: "Surrealist" },
  { value: "pop-art", label: "Pop Art" },
];

const MOODS = [
  { value: "none", label: "No specific mood" },
  { value: "dramatic", label: "Dramatic" },
  { value: "peaceful", label: "Peaceful & Calm" },
  { value: "mysterious", label: "Mysterious" },
  { value: "energetic", label: "Energetic & Vibrant" },
  { value: "melancholic", label: "Melancholic" },
  { value: "romantic", label: "Romantic" },
  { value: "epic", label: "Epic & Grand" },
  { value: "whimsical", label: "Whimsical & Playful" },
  { value: "dark", label: "Dark & Moody" },
  { value: "ethereal", label: "Ethereal & Dreamy" },
];

const LIGHTING = [
  { value: "none", label: "No specific lighting" },
  { value: "golden-hour", label: "Golden Hour" },
  { value: "blue-hour", label: "Blue Hour" },
  { value: "studio", label: "Studio Lighting" },
  { value: "dramatic-shadows", label: "Dramatic Shadows" },
  { value: "soft-diffused", label: "Soft & Diffused" },
  { value: "neon", label: "Neon Glow" },
  { value: "candlelight", label: "Candlelight" },
  { value: "moonlight", label: "Moonlight" },
  { value: "backlighting", label: "Backlighting / Silhouette" },
  { value: "volumetric", label: "Volumetric / God Rays" },
];

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1 (Square)" },
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "9:16", label: "9:16 (Portrait)" },
  { value: "4:3", label: "4:3 (Standard)" },
  { value: "3:2", label: "3:2 (Photo)" },
];

const CustomizationControls = ({ options, onChange }: CustomizationControlsProps) => {
  const handleChange = (key: keyof CustomizationOptions, value: string) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Style</Label>
        <Select value={options.style} onValueChange={(v) => handleChange("style", v)}>
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value} className="text-foreground hover:bg-secondary">
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Mood</Label>
        <Select value={options.mood} onValueChange={(v) => handleChange("mood", v)}>
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {MOODS.map((mood) => (
              <SelectItem key={mood.value} value={mood.value} className="text-foreground hover:bg-secondary">
                {mood.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Lighting</Label>
        <Select value={options.lighting} onValueChange={(v) => handleChange("lighting", v)}>
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select lighting" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {LIGHTING.map((light) => (
              <SelectItem key={light.value} value={light.value} className="text-foreground hover:bg-secondary">
                {light.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
        <Select value={options.aspectRatio} onValueChange={(v) => handleChange("aspectRatio", v)}>
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select ratio" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {ASPECT_RATIOS.map((ratio) => (
              <SelectItem key={ratio.value} value={ratio.value} className="text-foreground hover:bg-secondary">
                {ratio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomizationControls;
