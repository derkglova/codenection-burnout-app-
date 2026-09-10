import type { DrainKey } from "./types";

export const DRAIN: Record<DrainKey, { weight: number; color: string; fill: string; label: string }> = {
  recovery: { weight: -0.4, color: "#34c759", fill: "#248a3d", label: "Recovery" },
  low: { weight: 0.5, color: "#7a7a7a", fill: "#6e6e6e", label: "Low" },
  medium: { weight: 1, color: "#0066cc", fill: "#0066cc", label: "Medium" },
  high: { weight: 1.8, color: "#ff3b30", fill: "#d70015", label: "High" },
};

export const DRAIN_ORDER: DrainKey[] = ["recovery", "low", "medium", "high"];

const RECOVERY = ["sleep", "nap", "rest", "relax", "chill", "hangout", "movie", "game night", "party", "break", "recovery", "recharge"];
const HIGH = ["exam", "midterm", "final", "test", "presentation", "interview", "deadline", "defense", "quiz"];
const MEDIUM = [
  "class", "lecture", "meeting", "work", "shift", "study", "studying", "homework", "assignment",
  "lab", "seminar", "practice", "rehearsal", "project",
];
const LOW = ["gym", "walk", "lunch", "coffee", "call", "errand", "shopping", "laundry", "commute", "workout", "yoga"];

export function classifyDrain(text: string): DrainKey {
  const t = text.toLowerCase();
  if (RECOVERY.some((k) => t.includes(k))) return "recovery";
  if (HIGH.some((k) => t.includes(k))) return "high";
  if (MEDIUM.some((k) => t.includes(k))) return "medium";
  if (LOW.some((k) => t.includes(k))) return "low";
  return "medium";
}

export function statusColorFor(percent: number): string {
  return percent > 100 ? "#ff3b30" : percent >= 70 ? "#ff9500" : "#34c759";
}
