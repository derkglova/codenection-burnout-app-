import { parseCommandFallback } from "./commandParserFallback";
import type { ChatTurn, CommandContext, PacerEvent, PendingAction } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

export interface ParseResult {
  reply: string;
  actions: PendingAction[];
  source: "llm" | "regex" | "regex-offline";
}

/** Asks the backend (a LangChain/Groq tool-calling agent, with its own
 * regex fallback) to turn a natural-language message into a conversational
 * reply plus zero or more proposed actions. If the backend itself can't be
 * reached, falls back to an equivalent regex parser running entirely in the
 * browser so "Ask Pacer" still works offline (single action only — no
 * reasoning/tool-calling possible without an LLM). */
export async function parseCommandRemote(
  text: string,
  events: PacerEvent[],
  ctx: CommandContext,
  history: ChatTurn[]
): Promise<ParseResult> {
  try {
    const res = await fetch(`${API_BASE}/api/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, context: { ...ctx, events }, history }),
    });
    if (!res.ok) throw new Error(`command request failed: ${res.status}`);
    const data = await res.json();
    return { reply: data.reply ?? "", actions: data.actions ?? [], source: data.source };
  } catch {
    const action = parseCommandFallback(text, events, ctx);
    if (action.type === "unknown") {
      return {
        reply: action.error || "Not sure what you mean — try describing what to add, move, or delete.",
        actions: [],
        source: "regex-offline",
      };
    }
    return { reply: "", actions: [action], source: "regex-offline" };
  }
}

export interface TranscribeResult {
  text: string | null;
  error?: string;
}

/** Sends a recorded audio blob to the backend for Groq Whisper transcription. */
export async function transcribeAudio(blob: Blob): Promise<TranscribeResult> {
  try {
    const form = new FormData();
    form.append("audio", blob, "voice.webm");
    const res = await fetch(`${API_BASE}/api/transcribe`, { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { text: null, error: data.error || `transcription failed: ${res.status}` };
    }
    const data = await res.json();
    return { text: data.text || "" };
  } catch (err) {
    return { text: null, error: err instanceof Error ? err.message : "network error" };
  }
}
