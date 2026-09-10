"use client";

import type { RefObject } from "react";
import EventBlock from "./EventBlock";
import { HOUR_LABELS } from "@/lib/selectors";
import type { DayVM } from "@/lib/selectors";
import { decimalToTimeLabel, HOUR_H } from "@/lib/time";
import type { PacerEvent } from "@/lib/types";

const GRID_COLS = "56px repeat(7, minmax(132px,1fr))";

export default function CalendarGrid({
  days,
  gridHeight,
  nowLineTop,
  gridRef,
  scrollRef,
  eventsById,
  onAdd,
  onGridMouseDown,
  onEventMouseDown,
  onEventResizeMouseDown,
}: {
  days: DayVM[];
  gridHeight: number;
  nowLineTop: number;
  gridRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  eventsById: Map<number, PacerEvent>;
  onAdd: (dayIdx: number) => void;
  onGridMouseDown: (e: React.MouseEvent, dayIdx: number) => void;
  onEventMouseDown: (e: React.MouseEvent, ev: PacerEvent) => void;
  onEventResizeMouseDown: (e: React.MouseEvent, ev: PacerEvent) => void;
}) {
  return (
    <div style={{ flex: "3 1 620px", background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 960 }}>
          <div style={{ display: "grid", gridTemplateColumns: GRID_COLS, borderBottom: "1px solid #e0e0e0" }}>
            <div />
            {days.map((day) => (
              <div key={day.idx} style={{ position: "relative", padding: "10px 6px 12px", textAlign: "center", background: "transparent" }}>
                <button
                  onClick={() => onAdd(day.idx)}
                  style={{
                    position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 5,
                    border: "1px solid #e0e0e0", background: "transparent", color: "#7a7a7a", fontSize: 12,
                    lineHeight: 1, cursor: "pointer", opacity: 0.4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.borderColor = "#0066cc";
                    e.currentTarget.style.color = "#0066cc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.4";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.color = "#7a7a7a";
                  }}
                >
                  +
                </button>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#70757a", letterSpacing: 0.6 }}>{day.abbr}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 5 }}>
                  {day.isToday ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#0066cc", color: "#ffffff", fontSize: 16, fontWeight: 600, flexShrink: 0 }}>
                      {day.dateNum}
                    </span>
                  ) : (
                    <span style={{ fontSize: 16, fontWeight: 400, color: "#3c4043" }}>{day.dateNum}</span>
                  )}
                  {day.isTomorrow && (
                    <span style={{ background: "rgba(0,102,204,0.09)", color: "#0066cc", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 9999 }}>
                      Tomorrow
                    </span>
                  )}
                </div>
                <div title={day.capLabel} style={{ margin: "8px 14px 0", height: 4, background: "#eceff1", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${day.capPctClamped}%`, background: day.capColor, borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pacer-scroll" ref={scrollRef} style={{ maxHeight: 600, overflowY: "auto" }}>
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: GRID_COLS }}>
              <div style={{ position: "relative", height: gridHeight }}>
                {HOUR_LABELS.map((h, idx) => (
                  <div key={h} style={{ height: HOUR_H, fontSize: 11, color: "#7a7a7a", textAlign: "right", paddingRight: 8, boxSizing: "border-box", transform: "translateY(-6px)" }}>
                    {idx === 0 ? "" : decimalToTimeLabel(h)}
                  </div>
                ))}
              </div>

              {days.map((day) => (
                <div
                  key={day.idx}
                  onMouseDown={(e) => onGridMouseDown(e, day.idx)}
                  style={{
                    position: "relative",
                    height: gridHeight,
                    borderRight: "1px solid #e8eaed",
                    background: day.isToday ? "rgba(66,133,244,0.03)" : "transparent",
                    backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 59px, #e8eaed 59px, #e8eaed 60px)",
                  }}
                >
                  {day.events.map((vm) => {
                    const ev = eventsById.get(vm.id);
                    return (
                      <EventBlock
                        key={vm.id}
                        vm={vm}
                        onMouseDown={(e) => ev && onEventMouseDown(e, ev)}
                        onResizeMouseDown={(e) => ev && onEventResizeMouseDown(e, ev)}
                      />
                    );
                  })}
                  {day.ghost && (
                    <div
                      style={{
                        position: "absolute", left: 2, right: 2, top: day.ghost.top, height: day.ghost.height,
                        background: "rgba(0,102,204,0.55)", border: "1px dashed #0066cc", borderRadius: 8,
                        padding: "4px 6px", boxSizing: "border-box", zIndex: 35, pointerEvents: "none",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#ffffff" }}>{day.ghost.label}</div>
                    </div>
                  )}
                  {day.showNowLine && (
                    <div style={{ position: "absolute", left: 0, right: 0, top: nowLineTop, height: 2, background: "#ea4335", zIndex: 30, pointerEvents: "none" }}>
                      <span style={{ position: "absolute", left: -4, top: -4, width: 9, height: 9, borderRadius: "50%", background: "#ea4335" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
