import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PromptEnhancerProps {
  prompt: string;
  onEnhanced: (enhancedPrompt: string) => void;
  style?: string;
  mood?: string;
  lighting?: string;
  disabled?: boolean;
}

const PromptEnhancer = ({ 
  prompt, 
  onEnhanced, 
  style, 
  mood, 
  lighting,
  disabled 
}: PromptEnhancerProps) => {
  const [loading, setLoading] = useState(false);

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-prompt", {
        body: { prompt, style, mood, lighting },
      });

      if (error) throw error;

      if (data.enhancedPrompt) {
        onEnhanced(data.enhancedPrompt);
        toast.success("Prompt enhanced!");
      }
    } catch (error: any) {
      console.error("Enhancement error:", error);
      toast.error(error.message || "Failed to enhance prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={enhancePrompt}
      disabled={loading || disabled || !prompt.trim()}
      variant="outline"
      size="sm"
      className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enhancing...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4 mr-2" />
          Enhance Prompt
        </>
      )}
    </Button>
  );
};

export default PromptEnhancer;
