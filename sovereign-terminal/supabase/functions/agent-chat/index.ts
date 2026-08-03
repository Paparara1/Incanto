import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, agentDescription, agentType, agentName, agentLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langMap: Record<string, string> = {
      pl: "polski", en: "angielski", de: "niemiecki", es: "hiszpański", fr: "francuski",
    };

    const systemPrompt = `Jesteś spersonalizowanym agentem AI o imieniu "${agentName || "Agent"}".
Twój typ: ${agentType || "asystent"}.
Twój opis od użytkownika: "${agentDescription || "Bądź pomocny i przyjazny."}".
Odpowiadaj w języku: ${langMap[agentLanguage] || "polski"}.

Zachowuj się dokładnie tak, jak opisał Cię użytkownik. Bądź spójny z osobowością opisaną powyżej.
Odpowiadaj naturalnie, krótko i konkretnie, chyba że użytkownik prosi o dłuższą odpowiedź.
Nie wspominaj, że jesteś AI, chyba że ktoś o to zapyta.`;

    const models = [
      "google/gemini-3-flash-preview",
      "google/gemini-2.5-flash",
      "openai/gpt-5-mini",
    ];

    let lastError = "";
    let response: Response | null = null;

    for (const model of models) {
      try {
        const attempt = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            stream: true,
          }),
        });

        if (attempt.ok) {
          response = attempt;
          break;
        }

        if (attempt.status === 429) {
          return new Response(JSON.stringify({ error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (attempt.status === 402) {
          return new Response(JSON.stringify({ error: "Brak kredytów AI. Doładuj konto w ustawieniach." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const t = await attempt.text();
        lastError = `${model}: ${attempt.status} ${t.slice(0, 200)}`;
        console.error("AI gateway error with model", model, attempt.status, t.slice(0, 300));
        // Try next model for 5xx errors
        if (attempt.status < 500) break;
      } catch (fetchErr) {
        lastError = `${model}: ${fetchErr}`;
        console.error("Fetch error with model", model, fetchErr);
      }
    }

    if (!response) {
      console.error("All models failed. Last error:", lastError);
      return new Response(JSON.stringify({ error: "Serwer AI jest chwilowo niedostępny. Spróbuj ponownie za minutę." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
