"use client";

import type { TodayPillVM } from "@/lib/selectors";

export default function TodayPill({ vm }: { vm: TodayPillVM }) {
  const futureBg = `repeating-linear-gradient(45deg, ${vm.statusColor} 0 4px, transparent 4px 8px)`;
  const futureBorder = vm.futurePct > 0 ? `1.5px dashed ${vm.statusColor}` : "none";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5f5f7", border: "1px solid #e0e0e0", borderRadius: 9999, padding: "7px 16px 7px 14px", flex: 1, maxWidth: 520 }}>
      <span style={{ fontSize: 13, color: "#7a7a7a", flexShrink: 0 }}>Today</span>
      <div
        title={vm.breakdownLabel}
        style={{ flex: 1, minWidth: 40, height: 8, background: "#e5e5ea", borderRadius: 9999, overflow: "hidden", position: "relative", display: "flex", alignItems: "stretch" }}
      >
        <div style={{ height: "100%", width: `${vm.usedPct}%`, background: vm.statusColor, flexShrink: 0, position: "relative", zIndex: 2 }} />
        <div style={{ height: "100%", width: `${vm.futurePct}%`, background: futureBg, opacity: 0.5, filter: "blur(0.4px)", borderLeft: futureBorder, flexShrink: 0, position: "relative", zIndex: 1 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: vm.statusColor, flexShrink: 0 }}>{vm.capPercent}%</span>
    </div>
  );
}
