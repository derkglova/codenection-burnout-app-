"use client";

import type { Toast as ToastType } from "@/lib/types";

export default function Toast({ toast, onUndo }: { toast: ToastType; onUndo: () => void }) {
  return (
    <div
      className="pacer-rise"
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1d1d1f",
        borderRadius: 9999, padding: "10px 12px 10px 18px", color: "#ffffff", fontSize: 13, fontWeight: 600,
        zIndex: 200, display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <span>{toast.msg}</span>
      {toast.canUndo && (
        <button onClick={onUndo} style={{ background: "transparent", border: "none", color: "#2997ff", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
          Undo
        </button>
      )}
    </div>
  );
}
