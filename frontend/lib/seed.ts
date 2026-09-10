import { clamp, END_HOUR, snapHour, START_HOUR } from "./time";
import type { PacerEvent } from "./types";

/** Seeds today's schedule anchored to "now" (so the current-time line always
 * has context around it) and fills the rest of the week with a plausible
 * student load — including a deliberately overloaded tomorrow so the nudge
 * banner is visible right away. Mirrors the prototype's seedEvents(). */
export function seedEvents(todayIndex: number, nowHour: number): PacerEvent[] {
  const off = (o: number) => (todayIndex + o) % 7;
  let id = 1;
  const mk = (o: number, title: string, startHour: number, duration: number, drain: PacerEvent["drain"]): PacerEvent => ({
    id: id++,
    day: off(o),
    title,
    startHour,
    duration,
    drain,
  });
  const anchor = clamp(snapHour(nowHour), START_HOUR + 4, END_HOUR - 5);
  return [
    mk(0, "Gym session", anchor - 3.5, 1, "recovery"),
    mk(0, "Intro to Psych lecture", anchor - 2, 1.5, "medium"),
    mk(0, "Study block", anchor - 0.5, 1, "high"),
    mk(0, "Coffee with Sam", anchor + 1, 1, "low"),
    mk(0, "Group project meeting", anchor + 2.5, 1.5, "medium"),
    mk(1, "Chem lecture", 8, 1.5, "medium"),
    mk(1, "Chem midterm prep", 10, 2, "high"),
    mk(1, "Group project meeting", 13, 1.5, "medium"),
    mk(1, "Part-time shift", 15.5, 3, "medium"),
    mk(1, "Stats problem set", 19, 2, "high"),
    mk(2, "Yoga", 8, 1, "recovery"),
    mk(2, "History seminar", 11, 1.5, "medium"),
    mk(2, "Coffee with advisor", 14, 0.5, "low"),
    mk(3, "Bio lab", 9, 2, "medium"),
    mk(3, "Study group", 16, 1.5, "medium"),
    mk(4, "French class", 10, 1, "medium"),
    mk(4, "Movie night", 20, 2, "recovery"),
    mk(5, "Weekend job shift", 9, 4, "medium"),
    mk(6, "Laundry + errands", 11, 1, "low"),
    mk(6, "Call parents", 18, 0.5, "low"),
  ];
}
