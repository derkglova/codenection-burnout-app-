"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseCommandRemote } from "@/lib/api";
import { findNudge } from "@/lib/capacity";
import { seedEvents } from "@/lib/seed";
import { transcribeAudio } from "@/lib/api";
import {
  ASSUMED_SLEEP,
  currentNowHour,
  decimalToTimeLabel,
  END_HOUR,
  FULL_CANON,
  ABBR_CANON,
  HOUR_H,
  rotate,
  snapHour,
  START_HOUR,
  clamp,
} from "@/lib/time";
import type {
  ChatMessage,
  ChatTurn,
  CommandContext,
  DragState,
  EditingEvent,
  PacerEvent,
  PendingAction,
  Toast,
} from "@/lib/types";

export const BUDGET_MULT = 1.6;
export const DEFAULT_SLEEP_HOURS = 5.5;
const WEEK_STARTS_SUNDAY = false; // Monday-start week, matching the shipped prototype

export const VOICE_SAMPLES = [
  "Add gym tomorrow at 6pm for 1 hour",
  "Move chem midterm prep to Friday",
  "Add study group Thursday 4pm for 2 hours",
];

export const EXAMPLES = [
  "Add gym tomorrow 6pm for 1 hour",
  "Move chem midterm prep to Friday",
  "Add study group Thursday 4pm for 2 hours",
  "Delete part-time shift",
];

interface DragMeta {
  mode: "move" | "resize" | "create";
  id?: number;
  day: number;
  startHour: number;
  duration: number;
  x: number;
  y: number;
  moved: boolean;
  anchorHour?: number;
  orig: PacerEvent | { day: number };
}

export function usePacer() {
  const startIdx = WEEK_STARTS_SUNDAY ? 0 : 1;
  const { todayIndex, tomorrowIndex, weekStart, DAY_ABBR, DAY_FULL } = useMemo(() => {
    const now = new Date();
    const todayIndex = (now.getDay() - startIdx + 7) % 7;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - todayIndex);
    return {
      todayIndex,
      tomorrowIndex: (todayIndex + 1) % 7,
      weekStart,
      DAY_ABBR: rotate(ABBR_CANON, startIdx),
      DAY_FULL: rotate(FULL_CANON, startIdx),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, []);

  const [events, setEvents] = useState<PacerEvent[]>(() => seedEvents(todayIndex, currentNowHour()));
  const [nowHour, setNowHour] = useState(() => currentNowHour());
  const [sleepHours, setSleepHours] = useState(DEFAULT_SLEEP_HOURS);
  const [showCommand, setShowCommand] = useState(false);
  const [commandText, setCommandText] = useState("");
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [pendingChecked, setPendingChecked] = useState<boolean[]>([]);
  const [editingEvent, setEditingEvent] = useState<EditingEvent | null>(null);
  const [dragPreview, setDragPreview] = useState<DragState | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragMeta | null>(null);
  const nextIdRef = useRef(500);
  const msgIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const undoSnapshotRef = useRef<PacerEvent[] | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommand();
      }
      if (e.key === "Escape") {
        closeCommand();
        closeEdit();
      }
    };
    window.addEventListener("keydown", onKey);
    const clock = setInterval(() => setNowHour(currentNowHour()), 60000);
    const el = scrollRef.current;
    if (el) {
      const target = (currentNowHour() - START_HOUR) * HOUR_H - 140;
      el.scrollTop = Math.max(0, Math.min(target, el.scrollHeight - el.clientHeight));
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      clearInterval(clock);
      clearTimeout(debounceRef.current);
      clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- toast + undo ---------- */

  function showToast(msg: string, snapshot?: PacerEvent[] | null) {
    clearTimeout(toastTimerRef.current);
    undoSnapshotRef.current = snapshot ?? null;
    setToast({ msg, canUndo: !!snapshot });
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  }

  function undoLast() {
    if (!undoSnapshotRef.current) return;
    clearTimeout(toastTimerRef.current);
    const restored = undoSnapshotRef.current;
    undoSnapshotRef.current = null;
    setEvents(restored);
    setToast({ msg: "Undone", canUndo: false });
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  }

  /* ---------- drag: move / resize / create ---------- */

  function gridMetrics() {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { rect, colW: (rect.width - 56) / 7 };
  }

  function dayFromX(clientX: number) {
    const m = gridMetrics();
    if (!m) return 0;
    return clamp(Math.floor((clientX - m.rect.left - 56) / m.colW), 0, 6);
  }

  function hourFromY(clientY: number) {
    const m = gridMetrics();
    if (!m) return START_HOUR;
    return START_HOUR + (clientY - m.rect.top) / HOUR_H;
  }

  function beginDrag(mode: "move" | "resize" | "create", e: React.MouseEvent, ev: PacerEvent | { day: number }) {
    e.preventDefault();
    e.stopPropagation();
    const meta: DragMeta = { mode, x: e.clientX, y: e.clientY, moved: false, orig: ev, day: 0, startHour: 0, duration: 0 };

    if (mode === "create") {
      const day = dayFromX(e.clientX);
      const h = clamp(snapHour(hourFromY(e.clientY)), START_HOUR, END_HOUR - 0.25);
      meta.anchorHour = h;
      meta.day = day;
      meta.startHour = h;
      meta.duration = 0.5;
      setDragPreview({ mode: "create", day, startHour: h, duration: 0.5 });
    } else {
      const full = ev as PacerEvent;
      meta.id = full.id;
      meta.day = full.day;
      meta.startHour = full.startHour;
      meta.duration = full.duration;
      setDragPreview({ mode, id: full.id, day: full.day, startHour: full.startHour, duration: full.duration });
    }
    dragRef.current = meta;

    const onMouseMove = (evt: MouseEvent) => handleDragMove(evt);
    const onMouseUp = () => {
      handleDragEnd();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function handleDragMove(evt: MouseEvent) {
    const meta = dragRef.current;
    if (!meta) return;
    const dy = evt.clientY - meta.y;
    const dx = evt.clientX - meta.x;
    if (Math.abs(dy) > 3 || Math.abs(dx) > 3) meta.moved = true;

    if (meta.mode === "move") {
      const orig = meta.orig as PacerEvent;
      meta.duration = orig.duration;
      meta.startHour = clamp(snapHour(orig.startHour + dy / HOUR_H), START_HOUR, END_HOUR - orig.duration);
      meta.day = dayFromX(evt.clientX);
    } else if (meta.mode === "resize") {
      const orig = meta.orig as PacerEvent;
      meta.duration = clamp(snapHour(orig.duration + dy / HOUR_H), 0.5, END_HOUR - orig.startHour);
      meta.day = orig.day;
      meta.startHour = orig.startHour;
    } else {
      const cur = clamp(snapHour(hourFromY(evt.clientY)), START_HOUR, END_HOUR);
      const a = meta.anchorHour ?? cur;
      const duration = Math.max(0.5, Math.abs(cur - a));
      meta.startHour = clamp(Math.min(a, cur), START_HOUR, END_HOUR - duration);
      meta.duration = duration;
    }
    setDragPreview({ mode: meta.mode, id: meta.id, day: meta.day, startHour: meta.startHour, duration: meta.duration });
  }

  function handleDragEnd() {
    const meta = dragRef.current;
    dragRef.current = null;
    setDragPreview(null);
    if (!meta) return;

    if (meta.mode === "create") {
      if (meta.moved) openAddEvent(meta.day, meta.startHour, meta.duration);
      else openAddEvent(meta.day, meta.startHour, 1);
      return;
    }

    const origEvent = meta.orig as PacerEvent;
    if (!meta.moved) {
      openEditEvent(origEvent.id);
      return;
    }

    const snapshot = events;
    setEvents(
      snapshot.map((ev) => (ev.id === meta.id ? { ...ev, day: meta.day, startHour: meta.startHour, duration: meta.duration } : ev))
    );
    const label =
      meta.mode === "resize"
        ? `"${origEvent.title}" is now ${meta.duration}h`
        : `Moved "${origEvent.title}" to ${DAY_FULL[meta.day]}, ${decimalToTimeLabel(meta.startHour)}`;
    showToast(label, snapshot);
  }

  function onEventMouseDown(e: React.MouseEvent, ev: PacerEvent) {
    beginDrag("move", e, ev);
  }
  function onEventResizeMouseDown(e: React.MouseEvent, ev: PacerEvent) {
    beginDrag("resize", e, ev);
  }
  function onGridMouseDown(e: React.MouseEvent, dayIdx: number) {
    beginDrag("create", e, { day: dayIdx });
  }

  /* ---------- chat ---------- */

  function openCommand() {
    setShowCommand(true);
    clearPending();
    setListening(false);
  }
  function closeCommand() {
    clearTimeout(debounceRef.current);
    setShowCommand(false);
    setCommandText("");
    clearPending();
    setListening(false);
    setThinking(false);
  }
  function newChat() {
    clearTimeout(debounceRef.current);
    setMessages([]);
    clearPending();
    setCommandText("");
    setThinking(false);
    setListening(false);
  }

  function clearPending() {
    setPendingActions([]);
    setPendingChecked([]);
  }

  function toggleActionChecked(index: number) {
    setPendingChecked((prev) => prev.map((c, i) => (i === index ? !c : c)));
  }

  function pushMessage(role: ChatMessage["role"], text: string, isError = false) {
    msgIdRef.current += 1;
    setMessages((prev) => prev.concat([{ id: msgIdRef.current, role, text, isError }]));
  }

  function onCommandChange(value: string) {
    setCommandText(value);
  }
  function onCommandKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitNow();
    }
  }

  function submitNow(textOverride?: string) {
    const text = (textOverride ?? commandText).trim();
    if (!text) return;
    clearTimeout(debounceRef.current);
    const history: ChatTurn[] = messages.slice(-12).map((m) => ({ role: m.role, text: m.text }));
    pushMessage("user", text);
    setCommandText("");
    clearPending();
    setThinking(true);
    debounceRef.current = setTimeout(() => resolveCommand(text, history), 480);
  }

  async function resolveCommand(text: string, history: ChatTurn[]) {
    const ctx: CommandContext = { todayIndex, startIdx, dayFull: DAY_FULL, sleepHours, nowHour };
    const { reply, actions } = await parseCommandRemote(text, events, ctx, history);
    setThinking(false);
    if (reply) pushMessage("pacer", reply);
    if (actions.length > 0) {
      setPendingActions(actions);
      setPendingChecked(actions.map(() => true));
    } else if (!reply) {
      pushMessage("pacer", 'Not sure what you mean — try something like "add dentist appointment Thursday 3pm for 1 hour".', false);
    }
  }

  function useExample(text: string) {
    submitNow(text);
  }

  async function toggleVoice() {
    if (listening) {
      recorderRef.current?.stop();
      setListening(false);
      return;
    }
    clearPending();
    setMicUnavailable(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const supported = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.("audio/webm");
      const recorder = supported ? new MediaRecorder(stream, { mimeType: "audio/webm" }) : new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        setThinking(true);
        const { text, error } = await transcribeAudio(blob);
        setThinking(false);
        if (text && text.trim()) {
          submitNow(text.trim());
        } else {
          pushMessage("pacer", error ? "Couldn't reach voice transcription — try typing instead." : "Didn't catch that — try typing instead.", true);
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setListening(true);
    } catch {
      setMicUnavailable(true);
      const phrase = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)];
      setCommandText(phrase);
      pushMessage("pacer", "Mic unavailable — filled in an example instead. Edit it or hit send.", false);
    }
  }

  /* ---------- toast-confirmed AI actions ---------- */

  function confirmPendingActions() {
    const toApply = pendingActions.filter((_, i) => pendingChecked[i]);
    if (toApply.length === 0) return;
    const snapshot = events;
    let next = events;
    const labels: string[] = [];
    for (const a of toApply) {
      if (a.type === "add") {
        const ev: PacerEvent = { id: nextIdRef.current++, title: a.title, day: a.day, startHour: a.startHour, duration: a.duration, drain: a.drain };
        next = next.concat([ev]);
        labels.push(`Added "${ev.title}" — ${DAY_FULL[ev.day]}`);
      } else if (a.type === "move") {
        next = next.map((e) => (e.id === a.eventId ? { ...e, day: a.newDay, startHour: a.newStartHour != null ? a.newStartHour : e.startHour } : e));
        labels.push(`Moved "${a.eventTitle}" to ${DAY_FULL[a.newDay]}`);
      } else if (a.type === "delete") {
        next = next.filter((e) => e.id !== a.eventId);
        labels.push(`Removed "${a.eventTitle}"`);
      }
    }
    setEvents(next);
    const skipped = pendingActions.length - toApply.length;
    const msg =
      (labels.length === 1 ? labels[0] : `${labels.length} changes applied: ${labels.join("; ")}`) +
      (skipped > 0 ? ` (${skipped} skipped)` : "");
    clearPending();
    pushMessage("pacer", msg);
    showToast(msg, snapshot);
  }

  function cancelPendingActions() {
    clearPending();
    pushMessage("pacer", "Cancelled — nothing changed.");
  }

  /* ---------- event editing ---------- */

  function openAddEvent(dayIdx: number, startHour?: number, duration?: number) {
    setEditingEvent({ id: null, isNew: true, title: "", day: dayIdx, startHour: startHour ?? 9, duration: duration ?? 1, drain: "medium" });
  }
  function openEditEvent(id: number) {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    setEditingEvent({ ...ev, isNew: false });
  }
  function closeEdit() {
    setEditingEvent(null);
  }
  function updateEdit<K extends keyof EditingEvent>(field: K, value: EditingEvent[K]) {
    setEditingEvent((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function saveEdit() {
    const ev = editingEvent;
    if (!ev) return;
    const snapshot = events;
    if (ev.isNew) {
      const newEv: PacerEvent = { id: nextIdRef.current++, title: ev.title.trim() || "New event", day: ev.day, startHour: ev.startHour, duration: ev.duration, drain: ev.drain };
      setEvents(snapshot.concat([newEv]));
      setEditingEvent(null);
      showToast(`Added "${newEv.title}"`, snapshot);
    } else {
      const title = ev.title.trim() || "Untitled";
      setEvents(snapshot.map((e) => (e.id === ev.id ? { id: ev.id, title, day: ev.day, startHour: ev.startHour, duration: ev.duration, drain: ev.drain } : e)));
      setEditingEvent(null);
      showToast(`Saved "${title}"`, snapshot);
    }
  }

  function deleteEdit() {
    const ev = editingEvent;
    if (!ev) return;
    const snapshot = events;
    setEvents(snapshot.filter((e) => e.id !== ev.id));
    setEditingEvent(null);
    showToast(`Removed "${ev.title}"`, snapshot);
  }

  function onSleepChange(value: number) {
    setSleepHours(value);
  }
  function dismissNudge() {
    setNudgeDismissed(true);
  }
  function applyNudgeMove() {
    const n = findNudge(events, tomorrowIndex, ASSUMED_SLEEP, BUDGET_MULT);
    if (!n) return;
    const snapshot = events;
    setEvents(snapshot.map((e) => (e.id === n.eventId ? { ...e, day: n.suggestedDay } : e)));
    setNudgeDismissed(false);
    showToast(`Moved "${n.eventTitle}" to ${DAY_FULL[n.suggestedDay]}`, snapshot);
  }

  return {
    // config
    DAY_ABBR, DAY_FULL, todayIndex, tomorrowIndex, weekStart, startIdx, budgetMult: BUDGET_MULT,
    // state
    events, nowHour, sleepHours, showCommand, commandText, listening, thinking, messages, pendingActions, pendingChecked,
    editingEvent, dragPreview, toast, nudgeDismissed, micUnavailable,
    // refs
    gridRef, scrollRef,
    // actions
    setSleepHours: onSleepChange,
    openCommand, closeCommand, newChat, onCommandChange, onCommandKeyDown, submitNow, useExample, toggleVoice,
    confirmPendingActions, cancelPendingActions, toggleActionChecked,
    openAddEvent, openEditEvent, closeEdit, updateEdit, saveEdit, deleteEdit,
    dismissNudge, applyNudgeMove,
    onEventMouseDown, onEventResizeMouseDown, onGridMouseDown,
    undoLast,
  };
}

export type UsePacerReturn = ReturnType<typeof usePacer>;
