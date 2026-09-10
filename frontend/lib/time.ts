export const ABBR_CANON = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const FULL_CANON = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const START_HOUR = 0;
export const END_HOUR = 24;
export const HOUR_H = 60;
export const ASSUMED_SLEEP = 8;
export const SNAP = 0.25;

export const TIME_OPTIONS: number[] = Array.from({ length: 96 }, (_, q) => q / 4);
export const DURATION_OPTIONS: number[] = Array.from({ length: 16 }, (_, i) => (i + 1) / 4);

export function rotate<T>(arr: T[], n: number): T[] {
  return arr.slice(n).concat(arr.slice(0, n));
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function snapHour(v: number): number {
  return Math.round(v / SNAP) * SNAP;
}

export function currentNowHour(): number {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

/** Fold the live value into an options list so a <select> never silently
 * falls back to its first option when the current value isn't a preset. */
export function withValue(list: number[], v: number | null | undefined): number[] {
  if (v == null || list.indexOf(v) !== -1) return list;
  return [...list, v].sort((a, b) => a - b);
}

export function decimalToTimeLabelGCal(h: number): string {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const period = hour >= 12 ? "pm" : "am";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  return min ? `${hour12}:${String(min).padStart(2, "0")}${period}` : `${hour12}${period}`;
}

export function decimalToTimeLabel(h: number): string {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  return min ? `${hour12}:${String(min).padStart(2, "0")} ${period}` : `${hour12} ${period}`;
}
