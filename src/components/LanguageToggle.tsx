import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "light" | "dark";
  className?: string;
}

export function LanguageToggle({ variant = "dark", className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const isLight = variant === "light";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className={cn("w-4 h-4", isLight ? "text-white/70" : "text-muted-foreground")} />
      <div className={cn(
        "flex items-center text-sm font-medium",
        isLight ? "text-white/70" : "text-muted-foreground"
      )}>
        <button
          onClick={() => setLanguage("PT")}
          className={cn(
            "px-1.5 py-0.5 rounded transition-colors",
            language === "PT"
              ? isLight
                ? "text-white bg-white/20"
                : "text-foreground bg-muted"
              : isLight
                ? "text-white/50 hover:text-white/80"
                : "text-muted-foreground hover:text-foreground"
          )}
        >
          PT
        </button>
        <span className={cn("mx-1", isLight ? "text-white/30" : "text-muted-foreground/50")}>|</span>
        <button
          onClick={() => setLanguage("EN")}
          className={cn(
            "px-1.5 py-0.5 rounded transition-colors",
            language === "EN"
              ? isLight
                ? "text-white bg-white/20"
                : "text-foreground bg-muted"
              : isLight
                ? "text-white/50 hover:text-white/80"
                : "text-muted-foreground hover:text-foreground"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
