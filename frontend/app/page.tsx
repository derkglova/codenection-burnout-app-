"use client";

import { useMemo } from "react";
import AskPacerPanel from "@/components/AskPacerPanel";
import CalendarGrid from "@/components/CalendarGrid";
import EventModal from "@/components/EventModal";
import Header from "@/components/Header";
import LegendCard from "@/components/LegendCard";
import NudgeBanner from "@/components/NudgeBanner";
import SleepCard from "@/components/SleepCard";
import Toast from "@/components/Toast";
import { computeCapacity, findNudge } from "@/lib/capacity";
import { statusColorFor } from "@/lib/drain";
import { buildDayViewModels, buildTodayPillModel, getEffectiveEvents, HOUR_LABELS } from "@/lib/selectors";
import { ASSUMED_SLEEP, HOUR_H, MONTHS } from "@/lib/time";
import { usePacer, EXAMPLES } from "@/hooks/usePacer";

export default function PacerPage() {
  const p = usePacer();

  const effectiveEvents = useMemo(() => getEffectiveEvents(p.events, p.dragPreview), [p.events, p.dragPreview]);
  const eventsById = useMemo(() => new Map(p.events.map((e) => [e.id, e])), [p.events]);

  const days = useMemo(
    () =>
      buildDayViewModels({
        effectiveEvents,
        dayAbbr: p.DAY_ABBR,
        weekStart: p.weekStart,
        todayIndex: p.todayIndex,
        tomorrowIndex: p.tomorrowIndex,
        sleepHours: p.sleepHours,
        budgetMult: p.budgetMult,
        drag: p.dragPreview,
      }),
    [effectiveEvents, p.DAY_ABBR, p.weekStart, p.todayIndex, p.tomorrowIndex, p.sleepHours, p.budgetMult, p.dragPreview]
  );

  const gridHeight = HOUR_LABELS.length * HOUR_H;
  const nowLineTop = Math.round(p.nowHour * HOUR_H);

  const todayPillVM = useMemo(
    () => buildTodayPillModel(p.events, p.todayIndex, p.sleepHours, p.budgetMult, p.nowHour),
    [p.events, p.todayIndex, p.sleepHours, p.budgetMult, p.nowHour]
  );

  const tomorrowCap = useMemo(
    () => computeCapacity(p.events, p.tomorrowIndex, ASSUMED_SLEEP, p.budgetMult),
    [p.events, p.tomorrowIndex, p.budgetMult]
  );
  const tomorrowStatusColor = statusColorFor(tomorrowCap.percent);
  const tomorrowStatusMsg = tomorrowCap.percent > 100 ? "Overloaded" : tomorrowCap.percent >= 70 ? "Getting full" : "On track";

  const nudge = useMemo(
    () => (p.nudgeDismissed ? null : findNudge(p.events, p.tomorrowIndex, ASSUMED_SLEEP, p.budgetMult)),
    [p.events, p.tomorrowIndex, p.budgetMult, p.nudgeDismissed]
  );

  const dateRangeLabel = useMemo(() => {
    const endDate = new Date(p.weekStart);
    endDate.setDate(p.weekStart.getDate() + 6);
    const startLabel = `${MONTHS[p.weekStart.getMonth()]} ${p.weekStart.getDate()}`;
    const endLabel =
      p.weekStart.getMonth() === endDate.getMonth() ? String(endDate.getDate()) : `${MONTHS[endDate.getMonth()]} ${endDate.getDate()}`;
    return `${startLabel} – ${endLabel}`;
  }, [p.weekStart]);

  const showExamples = p.messages.length === 0 && !p.listening && !p.pending && !p.thinking;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1d1d1f", display: "flex", flexDirection: "column", flex: 1 }}>
      <Header dateRangeLabel={dateRangeLabel} todayPill={todayPillVM} onOpenCommand={p.openCommand} />

      {nudge && (
        <NudgeBanner nudge={nudge} nudgeDayLabel={p.DAY_FULL[nudge.suggestedDay]} onDismiss={p.dismissNudge} onApply={p.applyNudgeMove} />
      )}

      <div style={{ display: "flex", gap: 24, padding: "24px 32px 32px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <CalendarGrid
          days={days}
          gridHeight={gridHeight}
          nowLineTop={nowLineTop}
          gridRef={p.gridRef}
          scrollRef={p.scrollRef}
          eventsById={eventsById}
          onAdd={(dayIdx) => p.openAddEvent(dayIdx)}
          onGridMouseDown={p.onGridMouseDown}
          onEventMouseDown={p.onEventMouseDown}
          onEventResizeMouseDown={p.onEventResizeMouseDown}
        />

        <div style={{ flex: "1 1 280px", maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
          <SleepCard
            capPercent={tomorrowCap.percent}
            capPercentClamped={Math.max(3, Math.min(100, tomorrowCap.percent))}
            statusColor={tomorrowStatusColor}
            statusMsg={tomorrowStatusMsg}
            capLoadLabel={tomorrowCap.totalLoad.toFixed(1)}
            capBudgetLabel={tomorrowCap.budget.toFixed(1)}
            sleepHours={p.sleepHours}
            onSleepChange={p.setSleepHours}
          />
          <LegendCard />
        </div>
      </div>

      <AskPacerPanel
        show={p.showCommand}
        onClose={p.closeCommand}
        messages={p.messages}
        showExamples={showExamples}
        examples={EXAMPLES}
        onExampleClick={p.useExample}
        listening={p.listening}
        thinking={p.thinking}
        pending={p.pending}
        onConfirmPending={p.confirmPending}
        onCancelPending={p.cancelPending}
        commandText={p.commandText}
        onCommandChange={p.onCommandChange}
        onCommandKeyDown={p.onCommandKeyDown}
        onSubmit={() => p.submitNow()}
        onToggleVoice={p.toggleVoice}
        hasMessages={p.messages.length > 0}
        onNewChat={p.newChat}
      />

      {p.editingEvent && (
        <EventModal
          editingEvent={p.editingEvent}
          dayAbbr={p.DAY_ABBR}
          onClose={p.closeEdit}
          onTitleChange={(v) => p.updateEdit("title", v)}
          onDayChange={(day) => p.updateEdit("day", day)}
          onStartChange={(v) => p.updateEdit("startHour", v)}
          onDurationChange={(v) => p.updateEdit("duration", v)}
          onDrainChange={(v) => p.updateEdit("drain", v)}
          onSave={p.saveEdit}
          onDelete={p.deleteEdit}
        />
      )}

      {p.toast && <Toast toast={p.toast} onUndo={p.undoLast} />}
    </div>
  );
}
