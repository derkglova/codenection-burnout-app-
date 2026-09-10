"use client";

import type { Nudge } from "@/lib/types";

export default function NudgeBanner({
  nudge,
  nudgeDayLabel,
  onDismiss,
  onApply,
}: {
  nudge: Nudge;
  nudgeDayLabel: string;
  onDismiss: () => void;
  onApply: () => void;
}) {
  return (
    <div
      style={{
        margin: "16px 32px 0", padding: "16px 20px", background: "rgba(255,59,48,0.06)",
        border: "1px solid rgba(255,59,48,0.25)", borderRadius: 14, display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>Tomorrow is overloaded ({nudge.currentPercent}%)</div>
        <div style={{ fontSize: 13, color: "#333333", marginTop: 3 }}>
          &quot;{nudge.eventTitle}&quot; is pushing you past capacity. Move it to {nudgeDayLabel}, which has room.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
        <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#7a7a7a", fontSize: 13, padding: "9px 12px", cursor: "pointer" }}>
          Dismiss
        </button>
        <button
          onClick={onApply}
          style={{ background: "#0066cc", color: "#ffffff", border: "none", borderRadius: 9999, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0071e3")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0066cc")}
        >
          Move it to {nudgeDayLabel}
        </button>
      </div>
    </div>
  );
}
