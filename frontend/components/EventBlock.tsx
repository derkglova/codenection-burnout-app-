"use client";

import type { EventBlockVM } from "@/lib/selectors";

export default function EventBlock({
  vm,
  onMouseDown,
  onResizeMouseDown,
}: {
  vm: EventBlockVM;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: `calc(${vm.leftPct}% + 2px)`,
        width: `calc(${vm.widthPct}% - 4px)`,
        top: vm.top,
        height: vm.height,
        background: vm.background,
        border: "none",
        borderRadius: 8,
        padding: vm.height >= 34 ? "4px 6px" : "2px 6px",
        overflow: "hidden",
        cursor: vm.isDragging ? "grabbing" : "grab",
        boxSizing: "border-box",
        opacity: vm.isDragging ? 0.9 : 1,
        zIndex: vm.zIndex,
        userSelect: "none",
      }}
    >
      <div
        style={
          vm.clampTwoLine
            ? {
                fontSize: 12.5,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : {
                fontSize: 12.5,
                fontWeight: 700,
                color: "#ffffff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
        }
      >
        {vm.title}
      </div>
      {vm.showTime && (
        <div
          style={{
            fontSize: 10.5,
            color: "rgba(255,255,255,0.85)",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {vm.timeLabel}
        </div>
      )}
      <div onMouseDown={onResizeMouseDown} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 7, cursor: "ns-resize" }} />
    </div>
  );
}
