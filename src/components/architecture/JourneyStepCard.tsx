import { ArrowRight } from "lucide-react";
import type { JourneyStep } from "@/types/journeyTypes";
import { cn } from "@/lib/utils";

interface JourneyStepCardProps {
  step: JourneyStep;
  isFirst?: boolean;
  isLast?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const L1_COLORS: Record<string, string> = {
  "Source to Pay": "#0C1BA8",
  "Hire to Retire": "#6366F1",
  "Operations": "#059669",
  "IT Services": "#7C3AED",
  "Finance": "#D97706",
  "Record to Report": "#DC2626",
};

function getL1Color(l1Name?: string): string {
  if (!l1Name) return "#A5A7B0";
  return L1_COLORS[l1Name] || "#0C1BA8";
}

export function JourneyStepCard({
  step,
  isFirst = false,
  isLast = false,
  isSelected = false,
  onClick,
  compact = false,
}: JourneyStepCardProps) {
  const l1Color = getL1Color(step.l1Name);

  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={cn(
          "relative text-left rounded-sm border transition-all duration-150 hover:shadow-md group",
          compact ? "min-w-[180px] max-w-[220px]" : "min-w-[220px] max-w-[280px]",
          isSelected
            ? "border-[#0C1BA8] shadow-[0_0_0_2px_rgba(12,27,168,0.15)] bg-[#f0f2ff]"
            : "border-[#A5A7B0]/30 bg-white hover:border-[#0C1BA8]"
        )}
      >
        {/* Top accent bar */}
        <div
          className="h-[3px] w-full rounded-t-sm"
          style={{ backgroundColor: l1Color }}
        />

        <div className={cn("px-3", compact ? "py-2" : "py-3")}>
          {/* Step number + L1 badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm text-white uppercase tracking-wide"
              style={{ backgroundColor: l1Color }}
            >
              {step.order}
            </span>
            {step.l1Name && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide truncate max-w-[120px]">
                {step.l1Name}
              </span>
            )}
          </div>

          {/* Process name */}
          <h4
            className={cn(
              "font-medium text-[#272727] leading-tight",
              compact ? "text-[12px] line-clamp-2" : "text-[13px] line-clamp-2"
            )}
          >
            {step.processName}
          </h4>

          {/* Actor + duration */}
          {!compact && (
            <div className="mt-1.5 space-y-0.5">
              {step.actorRole && (
                <p className="text-[10px] text-[#A5A7B0] truncate">
                  👤 {step.actorRole}
                </p>
              )}
              {step.estimatedDuration && (
                <p className="text-[10px] text-[#A5A7B0]">
                  ⏱ {step.estimatedDuration}
                </p>
              )}
            </div>
          )}

          {/* Systems badges */}
          {!compact && step.systemIds && step.systemIds.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {step.systemIds.slice(0, 2).map((sys) => (
                <span
                  key={sys}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#f3f4f6] text-[#6B7280] border border-[#E5E7EB]"
                >
                  {sys}
                </span>
              ))}
              {step.systemIds.length > 2 && (
                <span className="text-[9px] px-1 text-[#A5A7B0]">
                  +{step.systemIds.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Arrow connector */}
      {!isLast && (
        <div className="flex items-center px-1.5 shrink-0">
          <ArrowRight className="h-4 w-4 text-[#A5A7B0]" />
        </div>
      )}
    </div>
  );
}
