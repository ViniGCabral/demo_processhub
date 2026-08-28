import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const { title, description, key_technologies } = await req.json();

    const prompt = `Find 4-6 market solutions/vendors for: "${title}" - ${description}. Technologies: ${(key_technologies || []).join(", ")}. Return via tool call.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a technology solutions expert. Return structured vendor data via tool calling." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_solutions",
            description: "Return market solutions",
            parameters: {
              type: "object",
              properties: {
                solutions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      vendor: { type: "string" },
                      solution: { type: "string" },
                      type: { type: "string" },
                      differentials: { type: "string" },
                      pricing: { type: "string" },
                      clients: { type: "string" },
                    },
                    required: ["vendor", "solution", "type", "differentials", "pricing"],
                  },
                },
              },
              required: ["solutions"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_solutions" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${status}`);
    }

    const data = await aiResponse.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const solutions = toolCall ? JSON.parse(toolCall.function.arguments).solutions : [];

    return new Response(JSON.stringify({ solutions }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("screen-match error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
