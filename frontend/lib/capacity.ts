import { DRAIN } from "./drain";
import type { Nudge, PacerEvent } from "./types";

export interface Capacity {
  dayEvents: PacerEvent[];
  totalLoad: number;
  budget: number;
  percent: number;
}

export function computeCapacity(
  events: PacerEvent[],
  dayIndex: number,
  sleepHours: number,
  budgetMult: number
): Capacity {
  const dayEvents = events.filter((e) => e.day === dayIndex).slice().sort((a, b) => a.startHour - b.startHour);
  const totalLoad = dayEvents.reduce((s, e) => s + DRAIN[e.drain].weight * e.duration, 0);
  const budget = Math.max(4, sleepHours * budgetMult);
  const percent = Math.max(0, Math.round((totalLoad / budget) * 100));
  return { dayEvents, totalLoad, budget, percent };
}

export function findNudge(
  events: PacerEvent[],
  tomorrowIndex: number,
  sleepHours: number,
  budgetMult: number
): Nudge | null {
  const cap = computeCapacity(events, tomorrowIndex, sleepHours, budgetMult);
  if (cap.percent <= 100) return null;
  const candidates = cap.dayEvents
    .filter((e) => e.drain !== "recovery")
    .sort((a, b) => DRAIN[b.drain].weight * b.duration - DRAIN[a.drain].weight * a.duration);
  if (!candidates.length) return null;
  const candidate = candidates[0];
  const contribution = DRAIN[candidate.drain].weight * candidate.duration;
  let best: { day: number; pct: number } | null = null;
  for (let d = 0; d < 7; d++) {
    if (d === tomorrowIndex) continue;
    const otherLoad = events.filter((e) => e.day === d).reduce((s, e) => s + DRAIN[e.drain].weight * e.duration, 0);
    const budget = Math.max(4, sleepHours * budgetMult);
    const pct = Math.round(((otherLoad + contribution) / budget) * 100);
    if (!best || pct < best.pct) best = { day: d, pct };
  }
  if (!best) return null;
  return {
    eventId: candidate.id,
    eventTitle: candidate.title,
    suggestedDay: best.day,
    resultPercent: best.pct,
    currentPercent: cap.percent,
  };
}

/** Assign side-by-side columns to overlapping events within a day, in place
 * (annotates each event with _col/_colCount), mirroring the prototype's
 * cluster-based column packing so concurrent events read as separate cards. */
export interface LaidOutEvent extends PacerEvent {
  _col: number;
  _colCount: number;
}

export function layoutColumns(list: PacerEvent[]): LaidOutEvent[] {
  const sorted = list.slice().sort((a, b) => a.startHour - b.startHour || b.duration - a.duration);
  let clusterEvents: LaidOutEvent[] = [];
  let colEnds: number[] = [];
  let clusterMaxEnd = -Infinity;
  const out: LaidOutEvent[] = [];
  const flush = () => {
    clusterEvents.forEach((ce) => {
      ce._colCount = colEnds.length;
    });
    out.push(...clusterEvents);
    clusterEvents = [];
    colEnds = [];
    clusterMaxEnd = -Infinity;
  };
  sorted.forEach((e) => {
    const laid = e as LaidOutEvent;
    const start = e.startHour;
    const end = e.startHour + e.duration;
    if (clusterEvents.length && start >= clusterMaxEnd) flush();
    let col = -1;
    for (let c = 0; c < colEnds.length; c++) {
      if (colEnds[c] <= start) {
        col = c;
        break;
      }
    }
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(end);
    } else {
      colEnds[col] = end;
    }
    laid._col = col;
    clusterEvents.push(laid);
    clusterMaxEnd = Math.max(clusterMaxEnd, end);
  });
  if (clusterEvents.length) flush();
  return out;
}
