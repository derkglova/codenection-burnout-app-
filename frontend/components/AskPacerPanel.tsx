"use client";

import type { ChatMessage, PendingAction } from "@/lib/types";

function bubbleStyle(m: ChatMessage): React.CSSProperties {
  if (m.role === "user") {
    return {
      maxWidth: "84%", background: "#0066cc", color: "#ffffff", fontSize: 14, lineHeight: 1.4,
      padding: "10px 14px", borderRadius: "18px 18px 4px 18px",
    };
  }
  return {
    maxWidth: "84%",
    background: m.isError ? "rgba(255,59,48,0.12)" : "rgba(255,255,255,0.08)",
    border: m.isError ? "1px solid rgba(255,59,48,0.4)" : "1px solid rgba(255,255,255,0.1)",
    color: m.isError ? "#ff6961" : "#ffffff",
    fontSize: 14, lineHeight: 1.4, padding: "10px 14px", borderRadius: "18px 18px 18px 4px",
  };
}

export default function AskPacerPanel({
  show,
  onClose,
  messages,
  showExamples,
  examples,
  onExampleClick,
  listening,
  thinking,
  pendingActions,
  onConfirmPendingActions,
  onCancelPendingActions,
  commandText,
  onCommandChange,
  onCommandKeyDown,
  onSubmit,
  onToggleVoice,
  hasMessages,
  onNewChat,
}: {
  show: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  showExamples: boolean;
  examples: string[];
  onExampleClick: (text: string) => void;
  listening: boolean;
  thinking: boolean;
  pendingActions: PendingAction[];
  onConfirmPendingActions: () => void;
  onCancelPendingActions: () => void;
  commandText: string;
  onCommandChange: (v: string) => void;
  onCommandKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onToggleVoice: () => void;
  hasMessages: boolean;
  onNewChat: () => void;
}) {
  const voicePillStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid " + (listening ? "rgba(255,59,48,0.4)" : "rgba(255,255,255,0.14)"),
    background: listening ? "rgba(255,59,48,0.12)" : "rgba(255,255,255,0.06)",
    color: listening ? "#ff3b30" : "#ffffff", cursor: "pointer", flexShrink: 0,
    animation: listening ? "pacerPulse 1s ease-in-out infinite" : "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: show ? "auto" : "none" }} onClick={onClose}>
      <div
        style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "92vw", background: "#272729",
          borderLeft: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column",
          pointerEvents: show ? "auto" : "none", transform: show ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>Ask Pacer</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasMessages && (
              <button
                onClick={onNewChat}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "#ffffff", borderRadius: 9999, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}
              >
                New chat
              </button>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#cccccc", fontSize: 18, cursor: "pointer" }}>
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: "24px 20px 12px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {showExamples && (
            <>
              <div style={{ fontSize: 14, color: "#cccccc" }}>Hey</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: -0.2, color: "#ffffff", lineHeight: 1.3 }}>
                What do you want to schedule?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => onExampleClick(ex)}
                    style={{ textAlign: "left", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9999, padding: "14px 18px", color: "#ffffff", fontSize: 14, cursor: "pointer" }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={bubbleStyle(m)}>{m.text}</div>
            </div>
          ))}

          {listening && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "40px 0" }}>
              <span className="pacer-pulse-dot" style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff3b30", display: "inline-block" }} />
              <span style={{ fontSize: 14, color: "#ffffff" }}>Listening…</span>
            </div>
          )}

          {thinking && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <span className="pacer-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#cccccc", display: "inline-block" }} />
              <span style={{ fontSize: 13, color: "#cccccc" }}>Thinking…</span>
            </div>
          )}

          {pendingActions.length > 0 && (
            <div className="pacer-rise" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 16 }}>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {pendingActions.map((a, i) => (
                  <li key={i} style={{ fontSize: 14, color: "#ffffff", lineHeight: 1.4, display: "flex", gap: 8 }}>
                    <span style={{ color: "#8e8e93" }}>•</span>
                    <span>{a.summary}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
                <button onClick={onCancelPendingActions} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.24)", color: "#ffffff", borderRadius: 9999, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={onConfirmPendingActions} style={{ background: "#0066cc", border: "none", color: "#ffffff", borderRadius: 9999, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                  {pendingActions.length > 1 ? "Confirm all" : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px 18px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9999, padding: "6px 6px 6px 18px" }}>
            <input
              className="pacer-cmd-input"
              value={commandText}
              onChange={(e) => onCommandChange(e.target.value)}
              onKeyDown={onCommandKeyDown}
              placeholder="Ask Pacer to add or move something…"
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "var(--font-text)", fontSize: 14, color: "#ffffff", minWidth: 0 }}
            />
            <button onClick={onToggleVoice} title={listening ? "Listening…" : "Voice input"} style={voicePillStyle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button onClick={onSubmit} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#0066cc", color: "#ffffff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
