import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import PromptEnhancer from "./PromptEnhancer";
import CustomizationControls, { CustomizationOptions } from "./CustomizationControls";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TextToImageGeneratorProps {
  userId: string;
}

const TextToImageGenerator = ({ userId }: TextToImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    style: "none",
    mood: "none",
    lighting: "none",
    aspectRatio: "1:1",
  });

  const buildEnhancedPrompt = (basePrompt: string): string => {
    const parts = [basePrompt];
    
    if (customization.style !== "none") {
      parts.push(`in ${customization.style.replace("-", " ")} style`);
    }
    if (customization.mood !== "none") {
      parts.push(`with ${customization.mood.replace("-", " ")} mood`);
    }
    if (customization.lighting !== "none") {
      parts.push(`${customization.lighting.replace("-", " ")} lighting`);
    }
    
    return parts.join(", ");
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const finalPrompt = buildEnhancedPrompt(prompt);
      
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { 
          prompt: finalPrompt, 
          type: "text-to-image",
          aspectRatio: customization.aspectRatio,
        },
      });

      if (error) throw error;

      setGeneratedImage(data.imageUrl);

      // Save to database
      await supabase.from("generated_images").insert({
        user_id: userId,
        prompt: finalPrompt,
        image_url: data.imageUrl,
        generation_type: "text-to-image",
      });

      toast.success("Image generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aurea-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevated">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Describe your image
              </label>
              <PromptEnhancer
                prompt={prompt}
                onEnhanced={setPrompt}
                style={customization.style !== "none" ? customization.style : undefined}
                mood={customization.mood !== "none" ? customization.mood : undefined}
                lighting={customization.lighting !== "none" ? customization.lighting : undefined}
                disabled={loading}
              />
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A majestic golden phoenix rising from flames in a luxury art deco style..."
              className="min-h-32 bg-secondary border-border text-foreground resize-none"
            />
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
              >
                <span>Advanced Customization</span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <CustomizationControls
                options={customization}
                onChange={setCustomization}
              />
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-gold text-primary-foreground font-semibold hover:shadow-glow-md transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </div>

      {generatedImage && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevated animate-fade-in">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border bg-secondary">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              onClick={downloadImage}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToImageGenerator;
