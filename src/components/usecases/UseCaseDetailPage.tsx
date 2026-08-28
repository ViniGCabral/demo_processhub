import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUseCaseStore } from "@/stores/useCaseStore";
import { OverviewSection } from "./sections/OverviewSection";
import { BenchmarkingSection } from "./sections/BenchmarkingSection";
import { ScreenMatchSection } from "./sections/ScreenMatchSection";
import { BusinessCaseSection } from "./sections/BusinessCaseSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export function UseCaseDetailPage() {
  const { language } = useLanguage();
  const { useCases, selectedUseCaseId, setStep, session } = useUseCaseStore();
  const useCase = useCases.find((uc) => uc.id === selectedUseCaseId);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!useCase) return;
    const checkSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_use_cases")
        .select("id")
        .eq("user_id", user.id)
        .eq("use_case_id", useCase.id)
        .maybeSingle();
      setIsSaved(!!data);
    };
    checkSaved();
  }, [useCase?.id]);

  const toggleSave = async () => {
    if (!useCase) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    if (isSaved) {
      await supabase.from("saved_use_cases").delete().eq("user_id", user.id).eq("use_case_id", useCase.id);
      setIsSaved(false);
      toast.success(language === "PT" ? "Caso de uso removido dos salvos" : "Use case removed from saved");
    } else {
      const l1Id = searchParams.get("l1Id") || "";
      const sourceName = searchParams.get("sourceName") || "";
      const level = searchParams.get("level") || "";

      await supabase.from("saved_use_cases").insert({
        user_id: user.id,
        use_case_id: useCase.id,
        l1_id: l1Id,
        l1_name: sourceName,
        l2_name: level === "l2" ? sourceName : (session?.source_names?.[0] || null),
        l3_name: level === "l3" ? sourceName : null,
        l4_name: level === "l4" ? sourceName : null,
      });
      setIsSaved(true);
      toast.success(language === "PT" ? "Caso de uso salvo!" : "Use case saved!");
    }
    setSaving(false);
  };

  if (!useCase) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setStep(1)}>
          <ArrowLeft size={16} />
          {language === "PT" ? "Voltar para lista" : "Back to list"}
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          size="sm"
          disabled={saving}
          onClick={toggleSave}
          className={`gap-1.5 rounded-sm ${
            isSaved
              ? "bg-[#0C1BA8] hover:bg-[#04223D] text-white"
              : "border-[#0C1BA8] text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
          }`}
        >
          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {isSaved
            ? (language === "PT" ? "Salvo" : "Saved")
            : (language === "PT" ? "Salvar" : "Save")}
        </Button>
      </div>

      <OverviewSection useCase={useCase} />
      <BenchmarkingSection useCase={useCase} />
      <ScreenMatchSection useCase={useCase} />
      <BusinessCaseSection useCase={useCase} />
    </div>
  );
}
