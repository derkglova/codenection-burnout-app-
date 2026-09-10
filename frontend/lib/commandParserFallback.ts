import { classifyDrain } from "./drain";
import { clamp, decimalToTimeLabel, snapHour } from "./time";
import type { CommandContext, PacerEvent, PendingAction } from "./types";

const DAY_NAME_MAP: Record<string, number> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3, weds: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

const STOP_WORDS = new Set([
  "add", "schedule", "book", "create", "new", "event", "my", "the", "a", "an", "move",
  "reschedule", "resched", "shift", "push", "change", "to", "from", "delete", "cancel",
  "remove", "on", "at", "for", "please", "can", "you", "it",
]);

export type ParsedCommand = PendingAction | { type: "unknown"; error?: string };

/** Dependency-free regex parser used when the backend's /api/command
 * (Groq-backed) can't be reached — keeps "Ask Pacer" usable offline,
 * mirroring the prototype's parseCommand() fallback. */
export function parseCommandFallback(raw: string, events: PacerEvent[], ctx: CommandContext): ParsedCommand {
  const text = raw.trim();
  if (!text) return { type: "unknown" };
  const lower = text.toLowerCase();
  let type: "add" | "move" | "delete" = "add";
  if (/\b(delete|cancel|remove)\b/.test(lower)) type = "delete";
  else if (/\b(move|resched\w*|shift|push|change)\b/.test(lower)) type = "move";

  let col: number | null = null;
  let matchedDayStr: string | null = null;
  if (/\btomorrow\b/.test(lower)) {
    col = (ctx.todayIndex + 1) % 7;
    matchedDayStr = "tomorrow";
  } else if (/\btoday\b/.test(lower)) {
    col = ctx.todayIndex;
    matchedDayStr = "today";
  } else {
    for (const name in DAY_NAME_MAP) {
      const re = new RegExp("\\b" + name + "\\b");
      if (re.test(lower)) {
        col = (DAY_NAME_MAP[name] - ctx.startIdx + 7) % 7;
        matchedDayStr = name;
        break;
      }
    }
  }

  let startHour: number | null = null;
  let matchedTimeStr: string | null = null;
  const tm = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (tm) {
    let h = parseInt(tm[1], 10);
    const min = tm[2] ? parseInt(tm[2], 10) : 0;
    const mer = tm[3];
    if (h === 12) h = 0;
    startHour = h + (mer === "pm" ? 12 : 0) + min / 60;
    matchedTimeStr = tm[0];
  }

  let duration = 1;
  let matchedDurStr: string | null = null;
  let dm = lower.match(/\b(?:for\s+)?(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b/);
  if (dm) {
    duration = parseFloat(dm[1]);
    matchedDurStr = dm[0];
  } else {
    dm = lower.match(/\b(?:for\s+)?(\d+)\s*(minutes?|mins?)\b/);
    if (dm) {
      duration = parseInt(dm[1], 10) / 60;
      matchedDurStr = dm[0];
    }
  }

  let residual = text;
  [matchedTimeStr, matchedDurStr, matchedDayStr].filter((p): p is string => !!p).forEach((p) => {
    residual = residual.replace(new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "");
  });
  residual = residual
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (type === "add") {
    const title = residual ? residual.charAt(0).toUpperCase() + residual.slice(1) : "New event";
    const day = col != null ? col : ctx.todayIndex;
    const sh = startHour != null ? startHour : 9;
    return {
      type: "add", title, day, startHour: sh, duration, drain: classifyDrain(title),
      summary: `Add "${title}" — ${ctx.dayFull[day]}, ${decimalToTimeLabel(sh)} · ${duration}h`,
    };
  }

  if (!residual) return { type: "unknown", error: 'Which event? Try naming it, e.g. "move chem exam to Friday".' };
  const needle = residual.toLowerCase();
  let target = events.find((e) => e.title.toLowerCase().includes(needle) || needle.includes(e.title.toLowerCase()));
  if (!target) {
    const words = needle.split(" ").filter((w) => w.length > 2);
    target = events.find((e) => words.some((w) => e.title.toLowerCase().includes(w)));
  }
  if (!target) return { type: "unknown", error: `Couldn't find an event matching "${residual}".` };

  if (type === "delete") {
    return { type: "delete", eventId: target.id, eventTitle: target.title, summary: `Remove "${target.title}" (${ctx.dayFull[target.day]})` };
  }

  const newDay = col != null ? col : target.day;
  const newStartHour = startHour != null ? clamp(snapHour(startHour), 0, 23.75) : null;
  return {
    type: "move", eventId: target.id, eventTitle: target.title, newDay, newStartHour,
    summary: `Move "${target.title}" to ${ctx.dayFull[newDay]}` + (newStartHour != null ? `, ${decimalToTimeLabel(newStartHour)}` : ""),
  };
}
