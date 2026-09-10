export type DrainKey = "recovery" | "low" | "medium" | "high";

export interface PacerEvent {
  id: number;
  title: string;
  day: number; // 0-6, index into the rotated week (matches DAY_ABBR/DAY_FULL)
  startHour: number; // 0-23.75, quarter-hour steps
  duration: number; // hours
  drain: DrainKey;
}

export interface DragState {
  mode: "move" | "resize" | "create";
  id?: number;
  day: number;
  startHour: number;
  duration: number;
}

export type ChatRole = "user" | "pacer";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
  isError?: boolean;
}

export type PendingAction =
  | { type: "add"; title: string; day: number; startHour: number; duration: number; drain: DrainKey; summary: string }
  | { type: "move"; eventId: number; eventTitle: string; newDay: number; newStartHour: number | null; summary: string }
  | { type: "delete"; eventId: number; eventTitle: string; summary: string };

export interface Nudge {
  eventId: number;
  eventTitle: string;
  suggestedDay: number;
  resultPercent: number;
  currentPercent: number;
}

export interface Toast {
  msg: string;
  canUndo: boolean;
}

export interface EditingEvent {
  id: number | null;
  isNew: boolean;
  title: string;
  day: number;
  startHour: number;
  duration: number;
  drain: DrainKey;
}

export interface CommandContext {
  todayIndex: number;
  startIdx: number;
  dayFull: string[];
  sleepHours: number;
}

export interface ChatTurn {
  role: ChatRole;
  text: string;
}
