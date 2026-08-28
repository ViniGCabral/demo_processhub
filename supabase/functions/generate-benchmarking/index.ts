import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const { title, description, key_indicators } = await req.json();

    const prompt = `Generate benchmarking KPIs for: "${title}" - ${description}. 
Indicators to benchmark: ${(key_indicators || []).join(", ")}.
Return via tool call.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a benchmarking expert. Return structured KPI data via tool calling." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_benchmarking",
            description: "Return benchmarking KPIs",
            parameters: {
              type: "object",
              properties: {
                benchmarking: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      category: { type: "string" },
                      unit: { type: "string" },
                      market_value: { type: "string" },
                      best_in_class: { type: "string" },
                    },
                    required: ["name", "category", "unit", "market_value", "best_in_class"],
                  },
                },
              },
              required: ["benchmarking"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_benchmarking" } },
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
    const benchmarking = toolCall ? JSON.parse(toolCall.function.arguments).benchmarking : [];

    return new Response(JSON.stringify({ benchmarking }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("benchmarking error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
