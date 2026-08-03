import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function pollForResult(getUrl: string, token: string, maxAttempts = 30): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(getUrl, {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await response.json();

    if (data.status === "succeeded" && data.output) {
      return data.output;
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Prediction ${data.status}: ${data.error || "unknown error"}`);
    }

    // Wait 1 second before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error("Timeout waiting for voice generation");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const REPLICATE_API_TOKEN = (Deno.env.get("REPLICATE_API_TOKEN") || "").replace(/[^\x20-\x7E]/g, "").trim();
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    const { text, language = "pl" } = await req.json();
    const requestOrigin = req.headers.get("origin")?.replace(/\/$/, "");

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const speakerCandidates = [
      requestOrigin ? `${requestOrigin}/speaker-reference.wav` : null,
      "https://raw.githubusercontent.com/coqui-ai/TTS/dev/tests/data/ljspeech/wavs/LJ001-0001.wav",
    ].filter((speaker): speaker is string => Boolean(speaker));

    let lastError: Error | null = null;

    for (const speaker of speakerCandidates) {
      try {
        const response = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: "684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
            input: {
              text: text.slice(0, 500),
              language,
              speaker,
            },
          }),
        });

        const prediction = await response.json();

        if (!response.ok) {
          throw new Error(`Replicate API error: ${JSON.stringify(prediction)}`);
        }

        const audioUrl = await pollForResult(prediction.urls.get, REPLICATE_API_TOKEN);

        return new Response(
          JSON.stringify({ audio_url: audioUrl }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Speaker candidate failed: ${speaker}`, lastError.message);
      }
    }

    throw lastError ?? new Error("Voice generation failed");
  } catch (error: unknown) {
    console.error("Voice generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
