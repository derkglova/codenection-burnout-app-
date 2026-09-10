import { parseCommandFallback, type ParsedCommand } from "./commandParserFallback";
import type { CommandContext, PacerEvent } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

export interface ParseResult {
  action: ParsedCommand;
  source: "llm" | "regex" | "regex-offline";
}

/** Asks the backend (Groq Llama tool-calling, with its own regex fallback)
 * to turn a natural-language command into a structured action. If the
 * backend itself can't be reached, falls back to an equivalent regex parser
 * running entirely in the browser so "Ask Pacer" still works offline. */
export async function parseCommandRemote(
  text: string,
  events: PacerEvent[],
  ctx: CommandContext
): Promise<ParseResult> {
  try {
    const res = await fetch(`${API_BASE}/api/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, context: { ...ctx, events } }),
    });
    if (!res.ok) throw new Error(`command request failed: ${res.status}`);
    const data = await res.json();
    return { action: data.action, source: data.source };
  } catch {
    return { action: parseCommandFallback(text, events, ctx), source: "regex-offline" };
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
