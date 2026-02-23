import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_ENHANCEMENT_PROMPT = "Enhance this image with improved clarity, balanced lighting, natural colors, and refined details while preserving the original subject, identity, structure, and composition. Maintain realism and avoid distortion or artifacts.";

function sanitizePrompt(prompt: string | undefined | null): string {
  if (!prompt || typeof prompt !== "string") {
    return DEFAULT_ENHANCEMENT_PROMPT;
  }

  let sanitized = prompt
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[<>{}[\]\\|`~^]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (sanitized.length < 3) {
    return DEFAULT_ENHANCEMENT_PROMPT;
  }

  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500) + "... Focus on enhancing image quality.";
  }

  return sanitized;
}

function buildImageToImagePrompt(userPrompt: string): string {
  const sanitized = sanitizePrompt(userPrompt);
  
  if (sanitized === DEFAULT_ENHANCEMENT_PROMPT) {
    return sanitized;
  }

  return `${sanitized}. IMPORTANT: Preserve the exact facial features, identity, face structure, and likeness of any people in the image. Only modify the style, background, or requested elements while keeping faces identical.`;
}

async function uploadToStorage(
  supabase: any,
  userId: string,
  base64Data: string
): Promise<string> {
  // Extract the base64 content (remove data:image/...;base64, prefix)
  const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error("Invalid base64 image format");
  }
  
  const imageType = base64Match[1];
  const base64Content = base64Match[2];
  
  // Convert base64 to Uint8Array
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const fileName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${imageType === 'jpeg' ? 'jpg' : imageType}`;
  
  const { data, error } = await supabase.storage
    .from('generated-images')
    .upload(fileName, bytes, {
      contentType: `image/${imageType}`,
      upsert: false
    });
  
  if (error) {
    console.error("Storage upload error:", error);
    throw new Error("Failed to save image to storage");
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('generated-images')
    .getPublicUrl(fileName);
  
  return urlData.publicUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = "text-to-image", sourceImage = null, aspectRatio = "1:1" } = await req.json();
    
    console.log("Generating image with prompt:", prompt, "type:", type);

    // Get auth header and create Supabase client
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract user ID from JWT
    let userId: string | null = null;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub;
      } catch (e) {
        console.error("Failed to parse auth token:", e);
      }
    }

    let base64Image: string;

    if (type === "image-to-image" && sourceImage) {
      // Use Lovable AI for image-to-image (preserves facial features)
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      
      if (!LOVABLE_API_KEY) {
        throw new Error("LOVABLE_API_KEY not configured");
      }

      const safePrompt = buildImageToImagePrompt(prompt);
      console.log("Using Lovable AI for image editing with prompt:", safePrompt);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: safePrompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: sourceImage
                  }
                }
              ]
            }
          ],
          modalities: ["image", "text"]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lovable AI error:", response.status, errorText);
        throw new Error("Image editing failed. Please try again.");
      }

      const data = await response.json();
      console.log("Lovable AI response received");
      
      const finishReason = data.choices?.[0]?.native_finish_reason || data.choices?.[0]?.finish_reason;
      const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!editedImageUrl) {
        console.error("No image in response:", JSON.stringify(data));
        if (finishReason === "IMAGE_SAFETY") {
          throw new Error("Your prompt was flagged by safety filters. Please try a less violent or graphic prompt.");
        }
        throw new Error("No image generated. Please try a different prompt.");
      }

      base64Image = editedImageUrl;
    } else {
      // Text-to-image generation using FLUX.1-schnell via Hugging Face
      const HUGGING_FACE_ACCESS_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
      if (!HUGGING_FACE_ACCESS_TOKEN) {
        throw new Error("HUGGING_FACE_ACCESS_TOKEN not configured");
      }

      const sanitizedPrompt = sanitizePrompt(prompt);
      
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: sanitizedPrompt,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face text-to-image error:", response.status, errorText);
        throw new Error(`Text-to-image generation failed: ${errorText}`);
      }

      const imageBlob = await response.blob();
      
      // Convert the blob to a base64 string using chunked approach
      const arrayBuffer = await imageBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64 = btoa(binary);
      base64Image = `data:image/png;base64,${base64}`;
    }

    // Upload to storage if we have a user ID
    let finalImageUrl = base64Image;
    if (userId) {
      try {
        finalImageUrl = await uploadToStorage(supabase, userId, base64Image);
        console.log("Image uploaded to storage:", finalImageUrl);
      } catch (storageError) {
        console.error("Storage upload failed, returning base64:", storageError);
        // Fall back to base64 if storage fails
      }
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ imageUrl: finalImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
