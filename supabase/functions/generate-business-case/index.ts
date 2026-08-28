import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const { title, description, mode } = await req.json();

    if (mode === "estimate") {
      // Generate AI estimates for the financial premises
      const prompt = `You are a financial analyst. For the following use case, estimate realistic financial premises for a business case:

Use case: "${title}" - ${description}

Estimate the following values (in BRL - Brazilian Reais):
- Investment (CAPEX): total upfront cost
- Monthly operational cost (OPEX)
- Suggested WACC / discount rate (%)
- Recommended horizon in years
- Ramp-up period in months
- Estimated annual savings

Return realistic market values via tool call.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a financial analyst specializing in technology investments. Provide realistic estimates in BRL." },
            { role: "user", content: prompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "return_estimates",
              description: "Return financial premise estimates",
              parameters: {
                type: "object",
                properties: {
                  estimates: {
                    type: "object",
                    properties: {
                      capex: { type: "number", description: "Total CAPEX in BRL" },
                      opex_monthly: { type: "number", description: "Monthly OPEX in BRL" },
                      wacc: { type: "number", description: "WACC percentage" },
                      horizon_years: { type: "number", description: "Horizon in years" },
                      ramp_up_months: { type: "number", description: "Ramp-up in months" },
                      annual_saving: { type: "number", description: "Estimated annual saving in BRL" },
                    },
                    required: ["capex", "opex_monthly", "wacc", "horizon_years", "ramp_up_months", "annual_saving"],
                  },
                },
                required: ["estimates"],
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "return_estimates" } },
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
      const estimates = toolCall ? JSON.parse(toolCall.function.arguments).estimates : {};

      return new Response(JSON.stringify({ estimates }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fallback: old behavior (should not be used anymore but kept for safety)
    return new Response(JSON.stringify({ error: "Invalid mode" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("business-case error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
