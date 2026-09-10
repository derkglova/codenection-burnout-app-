"use client";

export default function SleepCard({
  capPercent,
  capPercentClamped,
  statusColor,
  statusMsg,
  capLoadLabel,
  capBudgetLabel,
  sleepHours,
  onSleepChange,
}: {
  capPercent: number;
  capPercentClamped: number;
  statusColor: string;
  statusMsg: string;
  capLoadLabel: string;
  capBudgetLabel: string;
  sleepHours: number;
  onSleepChange: (value: number) => void;
}) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 18, padding: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>Tomorrow&apos;s capacity</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
        <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.3, color: statusColor, lineHeight: 1 }}>{capPercent}%</div>
        <div style={{ fontSize: 13, color: "#7a7a7a" }}>{statusMsg}</div>
      </div>
      <div style={{ height: 8, background: "#f0f0f0", borderRadius: 9999, marginTop: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${capPercentClamped}%`, background: statusColor, borderRadius: 9999 }} />
      </div>
      <div style={{ fontSize: 12, color: "#7a7a7a", marginTop: 6 }}>
        {capLoadLabel} of {capBudgetLabel} load budget
      </div>
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #e0e0e0" }}>
        <div style={{ background: "#f5f5f7", borderRadius: 11, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#333333", marginBottom: 8 }}>
            <span>Last night&apos;s sleep</span>
            <span style={{ color: "#1d1d1f", fontWeight: 600 }}>{sleepHours}h</span>
          </div>
          <input
            className="pacer-range"
            type="range"
            min={3}
            max={10}
            step={0.5}
            value={sleepHours}
            onChange={(e) => onSleepChange(parseFloat(e.target.value))}
          />
          <div style={{ fontSize: 11, color: "#7a7a7a", marginTop: 6 }}>Logged once a day — feeds today&apos;s capacity only</div>
        </div>
      </div>
    </div>
  );
}
