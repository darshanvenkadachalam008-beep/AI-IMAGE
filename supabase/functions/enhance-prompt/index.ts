import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, mood, lighting } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Enhancing prompt:", prompt);

    const systemPrompt = `You are an expert prompt engineer for AI image generation. Your task is to enhance user prompts to create more detailed, vivid, and professional-quality image generation prompts.

Transform the user's simple prompt into a detailed, professional prompt by adding:
- Specific visual details (textures, materials, surfaces)
- Artistic style and technique (photorealistic, digital art, oil painting, etc.)
- Lighting and atmosphere (golden hour, dramatic shadows, soft diffused light)
- Composition and perspective (close-up, wide angle, bird's eye view)
- Color palette and mood (warm tones, vibrant, muted, cinematic)
- Quality modifiers (8K, ultra HD, highly detailed, masterpiece)

${style ? `Incorporate this style: ${style}` : ""}
${mood ? `Apply this mood/atmosphere: ${mood}` : ""}
${lighting ? `Use this lighting: ${lighting}` : ""}

IMPORTANT: Return ONLY the enhanced prompt text, nothing else. No explanations, no quotes, just the improved prompt.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Enhance this image prompt: "${prompt}"` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI enhancement failed: ${errorText}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      throw new Error("No enhanced prompt received from AI");
    }

    console.log("Enhanced prompt generated successfully");

    return new Response(
      JSON.stringify({ enhancedPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in enhance-prompt function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to enhance prompt" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
