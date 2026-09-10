"use client";

import { DRAIN, DRAIN_ORDER } from "@/lib/drain";
import { decimalToTimeLabel, DURATION_OPTIONS, TIME_OPTIONS, withValue } from "@/lib/time";
import type { DrainKey, EditingEvent } from "@/lib/types";

function pillStyle(active: boolean): React.CSSProperties {
  return active
    ? { background: "rgba(0,102,204,0.08)", color: "#0066cc", border: "2px solid #0071e3", borderRadius: 9999, padding: "5px 12px", fontSize: 13, cursor: "pointer" }
    : { background: "#ffffff", color: "#1d1d1f", border: "1px solid #e0e0e0", borderRadius: 9999, padding: "6px 13px", fontSize: 13, cursor: "pointer" };
}

export default function EventModal({
  editingEvent,
  dayAbbr,
  onClose,
  onTitleChange,
  onDayChange,
  onStartChange,
  onDurationChange,
  onDrainChange,
  onSave,
  onDelete,
}: {
  editingEvent: EditingEvent;
  dayAbbr: string[];
  onClose: () => void;
  onTitleChange: (v: string) => void;
  onDayChange: (day: number) => void;
  onStartChange: (v: number) => void;
  onDurationChange: (v: number) => void;
  onDrainChange: (v: DrainKey) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const timeOptions = withValue(TIME_OPTIONS, editingEvent.startHour);
  const durationOptions = withValue(DURATION_OPTIONS, editingEvent.duration);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div className="pacer-rise" style={{ width: 420, maxWidth: "92vw", background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 18, padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f" }}>{editingEvent.isNew ? "New event" : "Edit event"}</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#7a7a7a", fontSize: 18, cursor: "pointer" }}>
            ×
          </button>
        </div>

        <input
          value={editingEvent.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Event title"
          style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", fontFamily: "var(--font-text)", fontSize: 15, color: "#1d1d1f", outline: "none" }}
        />

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#7a7a7a", marginBottom: 6 }}>Day</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {dayAbbr.map((abbr, i) => (
              <button key={abbr} onClick={() => onDayChange(i)} style={pillStyle(editingEvent.day === i)}>
                {abbr}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#7a7a7a", marginBottom: 6 }}>Start time</div>
            <select
              value={editingEvent.startHour}
              onChange={(e) => onStartChange(parseFloat(e.target.value))}
              style={{ width: "100%", background: "#ffffff", color: "#1d1d1f", border: "1px solid #e0e0e0", borderRadius: 8, padding: 8, fontFamily: "var(--font-text)", fontSize: 14 }}
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {decimalToTimeLabel(t)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#7a7a7a", marginBottom: 6 }}>Duration</div>
            <select
              value={editingEvent.duration}
              onChange={(e) => onDurationChange(parseFloat(e.target.value))}
              style={{ width: "100%", background: "#ffffff", color: "#1d1d1f", border: "1px solid #e0e0e0", borderRadius: 8, padding: 8, fontFamily: "var(--font-text)", fontSize: 14 }}
            >
              {durationOptions.map((d) => (
                <option key={d} value={d}>
                  {d}h
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#7a7a7a", marginBottom: 6 }}>How draining?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DRAIN_ORDER.map((key) => (
              <button key={key} onClick={() => onDrainChange(key)} style={pillStyle(editingEvent.drain === key)}>
                {DRAIN[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          {!editingEvent.isNew && (
            <button onClick={onDelete} style={{ background: "transparent", border: "none", color: "#ff3b30", fontSize: 13, cursor: "pointer", padding: "8px 0" }}>
              Delete
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={onClose} style={{ background: "transparent", border: "1px solid #0066cc", color: "#0066cc", borderRadius: 9999, padding: "9px 18px", fontSize: 14, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={onSave} style={{ background: "#0066cc", border: "none", color: "#ffffff", borderRadius: 9999, padding: "9px 18px", fontSize: 14, cursor: "pointer" }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
