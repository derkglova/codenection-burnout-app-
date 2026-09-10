"use client";

import TodayPill from "./TodayPill";
import type { TodayPillVM } from "@/lib/selectors";

export default function Header({
  dateRangeLabel,
  todayPill,
  onOpenCommand,
}: {
  dateRangeLabel: string;
  todayPill: TodayPillVM;
  onOpenCommand: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, letterSpacing: -0.28, color: "#1d1d1f", flexShrink: 0 }}>Pacer</div>
        <div style={{ fontSize: 13, color: "#7a7a7a", flexShrink: 0 }}>{dateRangeLabel}</div>
        <TodayPill vm={todayPill} />
      </div>
      <button
        onClick={onOpenCommand}
        style={{ display: "flex", alignItems: "center", background: "#0066cc", color: "#ffffff", border: "none", borderRadius: 9999, padding: "10px 18px", fontSize: 14, fontWeight: 400, letterSpacing: -0.224, cursor: "pointer", flexShrink: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#0071e3")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#0066cc")}
      >
        <span className="pacer-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff", display: "inline-block", marginRight: 8 }} />
        Ask Pacer
        <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 12 }}>⌘K</span>
      </button>
    </div>
  );
}
