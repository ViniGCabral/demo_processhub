interface HealthMetricCellProps {
  maturity: number;
  risk: number;
}

export function HealthMetricCell({ maturity, risk }: HealthMetricCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "11px", color: "#A5A7B0", width: "12px" }}>M</span>
        <span style={{ fontSize: "12px", color: "#272727", fontWeight: 500, width: "20px" }}>{maturity}</span>
        <div 
          className="relative"
          style={{ 
            width: "40px", 
            height: "3px", 
            backgroundColor: "#E8E8EA",
            borderRadius: "2px"
          }}
        >
          <div 
            style={{ 
              width: `${Math.min(maturity, 100)}%`, 
              height: "100%", 
              backgroundColor: "#0C1BA8",
              borderRadius: "2px"
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "11px", color: "#A5A7B0", width: "12px" }}>R</span>
        <span style={{ fontSize: "12px", color: "#272727", fontWeight: 500, width: "20px" }}>{risk}</span>
        <div 
          className="relative"
          style={{ 
            width: "40px", 
            height: "3px", 
            backgroundColor: "#E8E8EA",
            borderRadius: "2px"
          }}
        >
          <div 
            style={{ 
              width: `${Math.min(risk, 100)}%`, 
              height: "100%", 
              backgroundColor: "#0C1BA8",
              borderRadius: "2px"
            }}
          />
        </div>
      </div>
    </div>
  );
}
