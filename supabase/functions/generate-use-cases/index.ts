import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { company_name, area, source_level, source_ids, source_names, process_names, assessment_problems, observations, language } = body;

    const lang = language === "PT" ? "Portuguese (Brazil)" : "English";

    // Create session
    const { data: session, error: sessionErr } = await supabase.from("use_case_sessions").insert({
      user_id: user.id,
      company_name,
      area,
      source_level: source_level || "l1",
      source_ids: source_ids || [],
      source_names: source_names || [],
      process_names: process_names || [],
      assessment_problems: assessment_problems || "",
      observations: observations || "",
    }).select().single();

    if (sessionErr) throw sessionErr;

    // Build prompt
    const processNamesStr = (process_names || []).join(", ");
    const prompt = `You are a process optimization and digital transformation expert. Given the following context, identify 6-10 use cases for improvement.

IMPORTANT: All output text (titles, descriptions, potential gains, key indicators, source references) MUST be written in ${lang}.

Company: ${company_name}
Area: ${area}
Source Level: ${source_level}
Chain elements: ${(source_names || []).join(", ")}
Processes: ${processNamesStr}
Problems identified: ${assessment_problems || "None specified"}
Observations: ${observations || "None"}

For each use case, provide structured output via the tool call. Remember: ALL text content must be in ${lang}.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a process optimization expert. Return structured use cases via tool calling." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_use_cases",
            description: "Return a list of identified use cases",
            parameters: {
              type: "object",
              properties: {
                use_cases: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string", enum: ["IA", "Processo", "Sistemas"] },
                      effort: { type: "string", enum: ["very_low", "low", "high", "very_high"] },
                      impact: { type: "string", enum: ["very_low", "low", "high", "very_high"] },
                      source_reference: { type: "string" },
                      potential_gains: {
                        type: "array",
                        items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } }, required: ["title", "description"] }
                      },
                      key_indicators: { type: "array", items: { type: "string" } },
                      key_technologies: { type: "array", items: { type: "string" } },
                      impacted_processes_count: { type: "number" },
                    },
                    required: ["title", "description", "category", "effort", "impact"],
                  },
                },
              },
              required: ["use_cases"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_use_cases" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const useCasesRaw = toolCall ? JSON.parse(toolCall.function.arguments).use_cases : [];

    // Insert use cases into DB
    const useCasesToInsert = useCasesRaw.map((uc: any) => ({
      session_id: session.id,
      user_id: user.id,
      title: uc.title,
      description: uc.description || "",
      category: uc.category || "IA",
      effort: uc.effort || "low",
      impact: uc.impact || "high",
      source_reference: uc.source_reference || "",
      potential_gains: uc.potential_gains || [],
      key_indicators: uc.key_indicators || [],
      key_technologies: uc.key_technologies || [],
      impacted_processes_count: uc.impacted_processes_count || 0,
    }));

    const { data: insertedUCs, error: insertErr } = await supabase
      .from("use_cases")
      .insert(useCasesToInsert)
      .select();

    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({ session_id: session.id, use_cases: insertedUCs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-use-cases error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
