"""Per-day load/budget math, ported from frontend/lib/capacity.ts
(computeCapacity only — not the findNudge pick-the-worst-offender
heuristic, which picks the wrong direction for "move the unimportant
stuff" style requests). Used by agent.py to give the LLM a numeric
capacity readout per day instead of just a raw event list.
"""
from drain import DRAIN

BUDGET_MULT = 1.6


def compute_capacity(events, day_index, sleep_hours):
    day_events = [e for e in events if e["day"] == day_index]
    total_load = sum(DRAIN[e["drain"]]["weight"] * e["duration"] for e in day_events)
    budget = max(4, sleep_hours * BUDGET_MULT)
    percent = max(0, round((total_load / budget) * 100))
    return {"totalLoad": total_load, "budget": budget, "percent": percent}


def status_label(percent):
    return "Overloaded" if percent > 100 else "Getting full" if percent >= 70 else "On track"
