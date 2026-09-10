"use client";

import { DRAIN, DRAIN_ORDER } from "@/lib/drain";

export default function LegendCard() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 18, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#7a7a7a", marginBottom: 8 }}>Energy impact</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {DRAIN_ORDER.map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: DRAIN[key].color, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#333333" }}>{DRAIN[key].label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#7a7a7a", marginTop: 10, lineHeight: 1.4 }}>
        Drag a block to move it, drag its bottom edge to resize, or drag an empty slot to create one.
      </div>
    </div>
  );
}
