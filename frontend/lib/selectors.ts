import { DRAIN, statusColorFor } from "./drain";
import { computeCapacity, layoutColumns } from "./capacity";
import { decimalToTimeLabelGCal, END_HOUR, HOUR_H, START_HOUR } from "./time";
import type { DragState, PacerEvent } from "./types";

export function getEffectiveEvents(events: PacerEvent[], drag: DragState | null): PacerEvent[] {
  if (!drag || drag.id == null) return events;
  return events.map((e) => (e.id === drag.id ? { ...e, day: drag.day, startHour: drag.startHour, duration: drag.duration } : e));
}

export interface EventBlockVM {
  id: number;
  title: string;
  top: number;
  height: number;
  leftPct: number;
  widthPct: number;
  background: string;
  showTime: boolean;
  clampTwoLine: boolean;
  timeLabel: string;
  isDragging: boolean;
  zIndex: number;
}

export interface GhostVM {
  label: string;
  top: number;
  height: number;
}

export interface DayVM {
  idx: number;
  abbr: string;
  dateNum: number;
  isToday: boolean;
  isTomorrow: boolean;
  events: EventBlockVM[];
  ghost: GhostVM | null;
  showNowLine: boolean;
  capPctClamped: number;
  capColor: string;
  capLabel: string;
}

export function buildDayViewModels(opts: {
  effectiveEvents: PacerEvent[];
  dayAbbr: string[];
  weekStart: Date;
  todayIndex: number;
  tomorrowIndex: number;
  sleepHours: number;
  budgetMult: number;
  drag: DragState | null;
}): DayVM[] {
  const { effectiveEvents, dayAbbr, weekStart, todayIndex, tomorrowIndex, sleepHours, budgetMult, drag } = opts;

  return dayAbbr.map((abbr, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const isToday = i === todayIndex;
    const isTomorrow = i === tomorrowIndex;

    const laidOut = layoutColumns(effectiveEvents.filter((e) => e.day === i));
    const events: EventBlockVM[] = laidOut.map((e) => {
      const meta = DRAIN[e.drain];
      const top = (e.startHour - START_HOUR) * HOUR_H + 1;
      const height = e.duration * HOUR_H - 2;
      const colCount = e._colCount || 1;
      const col = e._col || 0;
      const widthPct = 100 / colCount;
      const leftPct = widthPct * col;
      const isDragging = !!(drag && drag.id === e.id);
      return {
        id: e.id,
        title: e.title,
        top,
        height,
        leftPct,
        widthPct,
        background: meta.fill,
        showTime: height >= 34,
        clampTwoLine: height >= 52,
        timeLabel: `${decimalToTimeLabelGCal(e.startHour)} – ${decimalToTimeLabelGCal(e.startHour + e.duration)}`,
        isDragging,
        zIndex: isDragging ? 40 : 10 - col,
      };
    });

    const dayCap = computeCapacity(effectiveEvents, i, isToday ? sleepHours : 8, budgetMult);
    const ghost: GhostVM | null =
      drag && drag.mode === "create" && drag.day === i
        ? {
            label: `${decimalToTimeLabelGCal(drag.startHour)} – ${decimalToTimeLabelGCal(drag.startHour + drag.duration)}`,
            top: (drag.startHour - START_HOUR) * HOUR_H + 1,
            height: drag.duration * HOUR_H - 2,
          }
        : null;

    return {
      idx: i,
      abbr,
      dateNum: date.getDate(),
      isToday,
      isTomorrow,
      events,
      ghost,
      showNowLine: isToday,
      capPctClamped: Math.max(2, Math.min(100, dayCap.percent)),
      capColor: statusColorFor(dayCap.percent),
      capLabel: `${dayCap.percent}% of capacity`,
    };
  });
}

export interface TodayPillVM {
  usedPct: number;
  futurePct: number;
  statusColor: string;
  capPercent: number;
  breakdownLabel: string;
}

export function buildTodayPillModel(events: PacerEvent[], todayIndex: number, sleepHours: number, budgetMult: number, nowHour: number): TodayPillVM {
  const todayCap = computeCapacity(events, todayIndex, sleepHours, budgetMult);
  const statusColor = statusColorFor(todayCap.percent);
  let usedW = 0;
  let futureW = 0;
  events
    .filter((e) => e.day === todayIndex)
    .forEach((e) => {
      const w = DRAIN[e.drain].weight;
      const start = e.startHour;
      const end = e.startHour + e.duration;
      if (end <= nowHour) usedW += w * e.duration;
      else if (start >= nowHour) futureW += w * e.duration;
      else {
        usedW += w * (nowHour - start);
        futureW += w * (end - nowHour);
      }
    });
  const usedPct = Math.max(0, Math.min(100, Math.round((usedW / todayCap.budget) * 100)));
  const futurePct = Math.max(0, Math.min(100 - usedPct, Math.round((futureW / todayCap.budget) * 100)));
  return {
    usedPct,
    futurePct,
    statusColor,
    capPercent: todayCap.percent,
    breakdownLabel: `Used ${usedPct}% so far · ${futurePct}% more scheduled today`,
  };
}

export const HOUR_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, idx) => idx);
