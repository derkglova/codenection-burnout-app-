"""Shared event-normalization helpers, plus the dependency-free regex
parser used as a last-resort fallback (no GROQ_API_KEY configured, or the
LangChain tool-calling agent in agent.py fails for any reason).

`hydrate_action` is the single place that validates/normalizes a raw
{type, ...} dict against the real event list — reused both by the regex
parser below and by agent.py's tools, so day/hour clamping, quarter-hour
snapping, drain classification, and eventId lookup never get duplicated.
"""
import re

from drain import classify_drain

SNAP = 0.25
START_HOUR = 0
END_HOUR = 24

DAY_NAME_MAP = {
    "sunday": 0, "sun": 0,
    "monday": 1, "mon": 1,
    "tuesday": 2, "tue": 2, "tues": 2,
    "wednesday": 3, "wed": 3, "weds": 3,
    "thursday": 4, "thu": 4, "thur": 4, "thurs": 4,
    "friday": 5, "fri": 5,
    "saturday": 6, "sat": 6,
}


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def snap_hour(v):
    return round(v / SNAP) * SNAP


def decimal_to_time_label(h):
    hour = int(h)
    minute = round((h - hour) * 60)
    period = "PM" if hour >= 12 else "AM"
    hour12 = hour % 12 or 12
    return f"{hour12}:{minute:02d} {period}" if minute else f"{hour12} {period}"


def _find_recovery_slot(events, day, duration, preferred_start, today_index=None, now_hour=None):
    """Recovery blocks are meant to be a clear break, so unlike other adds
    they shouldn't land on top of an existing event. Find every free gap
    that day big enough for the block, and place it in whichever gap is
    closest to the model's preferred time (as close to that time as the
    gap allows) — not just the earliest chronological gap, which could be
    hours away (e.g. midnight) from where the break was actually wanted.
    Falls back to the preferred time verbatim if the day has no gap big
    enough — better to overlap than to silently drop the suggestion.

    If this is today, the hours before right now are also treated as
    unavailable — a recovery break already in the past is useless, so it
    should never win over a real free slot later today."""
    duration = min(duration, END_HOUR - START_HOUR)
    day_events = sorted((e for e in events if e["day"] == day), key=lambda e: e["startHour"])
    if day == today_index and now_hour is not None and now_hour > START_HOUR:
        day_events = sorted(
            day_events + [{"startHour": START_HOUR, "duration": min(now_hour, END_HOUR) - START_HOUR}],
            key=lambda e: e["startHour"],
        )

    gaps = []
    cursor = START_HOUR
    for e in day_events:
        if e["startHour"] > cursor:
            gaps.append((cursor, e["startHour"]))
        cursor = max(cursor, e["startHour"] + e["duration"])
    if cursor < END_HOUR:
        gaps.append((cursor, END_HOUR))

    usable = [(gs, ge) for gs, ge in gaps if ge - gs >= duration]
    if not usable:
        return preferred_start

    def slot_in_gap(gs, ge):
        return snap_hour(clamp(preferred_start, gs, ge - duration))

    best_gap = min(usable, key=lambda g: abs(slot_in_gap(*g) - preferred_start))
    return clamp(slot_in_gap(*best_gap), START_HOUR, END_HOUR - duration)


def hydrate_action(parsed, ctx):
    events = ctx["events"]
    day_full = ctx["dayFull"]
    ptype = parsed.get("type")

    if ptype == "add":
        title = (str(parsed.get("title") or "New event")).strip() or "New event"
        day = int(clamp(round(parsed["day"]), 0, 6)) if parsed.get("day") is not None else ctx["todayIndex"]
        if parsed.get("startHour") is not None:
            sh = clamp(snap_hour(parsed["startHour"]), START_HOUR, END_HOUR - 0.25)
        else:
            sh = 9
        duration = max(0.25, parsed["duration"]) if parsed.get("duration") is not None else 1
        drain = classify_drain(title)
        if drain == "recovery":
            sh = _find_recovery_slot(events, day, duration, sh, ctx.get("todayIndex"), ctx.get("nowHour"))
        return {
            "type": "add", "title": title, "day": day, "startHour": sh, "duration": duration,
            "drain": drain,
            "summary": f'Add "{title}" — {day_full[day]}, {decimal_to_time_label(sh)} · {duration}h',
        }

    if ptype == "move":
        target = next((e for e in events if e["id"] == parsed.get("eventId")), None)
        if not target:
            return {"type": "unknown", "error": "Couldn't find that event."}
        new_day = int(clamp(round(parsed["newDay"]), 0, 6)) if parsed.get("newDay") is not None else target["day"]
        new_start = clamp(snap_hour(parsed["newStartHour"]), START_HOUR, END_HOUR - 0.25) if parsed.get("newStartHour") is not None else None
        summary = f'Move "{target["title"]}" to {day_full[new_day]}'
        if new_start is not None:
            summary += f", {decimal_to_time_label(new_start)}"
        return {
            "type": "move", "eventId": target["id"], "eventTitle": target["title"],
            "newDay": new_day, "newStartHour": new_start, "summary": summary,
        }

    if ptype == "delete":
        target = next((e for e in events if e["id"] == parsed.get("eventId")), None)
        if not target:
            return {"type": "unknown", "error": "Couldn't find that event."}
        return {
            "type": "delete", "eventId": target["id"], "eventTitle": target["title"],
            "summary": f'Remove "{target["title"]}" ({day_full[target["day"]]})',
        }

    return {"type": "unknown", "error": parsed.get("error") or "Couldn't understand that."}


def parse_with_regex(text, ctx):
    events = ctx["events"]
    day_full = ctx["dayFull"]
    today_index = ctx["todayIndex"]
    start_idx = ctx["startIdx"]

    text = text.strip()
    if not text:
        return {"type": "unknown"}
    lower = text.lower()

    action_type = "add"
    if re.search(r"\b(delete|cancel|remove)\b", lower):
        action_type = "delete"
    elif re.search(r"\b(move|resched\w*|shift|push|change)\b", lower):
        action_type = "move"

    col = None
    matched_day_str = None
    if re.search(r"\btomorrow\b", lower):
        col = (today_index + 1) % 7
        matched_day_str = "tomorrow"
    elif re.search(r"\btoday\b", lower):
        col = today_index
        matched_day_str = "today"
    else:
        for name, idx in DAY_NAME_MAP.items():
            if re.search(r"\b" + name + r"\b", lower):
                col = (idx - start_idx + 7) % 7
                matched_day_str = name
                break

    start_hour = None
    matched_time_str = None
    tm = re.search(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", lower)
    if tm:
        h = int(tm.group(1))
        minute = int(tm.group(2)) if tm.group(2) else 0
        mer = tm.group(3)
        if h == 12:
            h = 0
        start_hour = h + (12 if mer == "pm" else 0) + minute / 60
        matched_time_str = tm.group(0)

    duration = 1
    matched_dur_str = None
    dm = re.search(r"\b(?:for\s+)?(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b", lower)
    if dm:
        duration = float(dm.group(1))
        matched_dur_str = dm.group(0)
    else:
        dm = re.search(r"\b(?:for\s+)?(\d+)\s*(minutes?|mins?)\b", lower)
        if dm:
            duration = int(dm.group(1)) / 60
            matched_dur_str = dm.group(0)

    residual = text
    for piece in filter(None, [matched_time_str, matched_dur_str, matched_day_str]):
        residual = re.sub(re.escape(piece), "", residual, flags=re.IGNORECASE)
    stop_words = {"add", "schedule", "book", "create", "new", "event", "my", "the", "a", "an", "move",
                  "reschedule", "resched", "shift", "push", "change", "to", "from", "delete", "cancel",
                  "remove", "on", "at", "for", "please", "can", "you", "it"}
    residual = " ".join(w for w in residual.split() if w.lower() not in stop_words).strip()

    if action_type == "add":
        title = (residual[0].upper() + residual[1:]) if residual else "New event"
        day = col if col is not None else today_index
        sh = start_hour if start_hour is not None else 9
        return hydrate_action({"type": "add", "title": title, "day": day, "startHour": sh, "duration": duration}, ctx)

    if not residual:
        return {"type": "unknown", "error": 'Which event? Try naming it, e.g. "move chem exam to Friday".'}
    needle = residual.lower()
    target = next((e for e in events if needle in e["title"].lower() or e["title"].lower() in needle), None)
    if not target:
        words = [w for w in needle.split() if len(w) > 2]
        target = next((e for e in events if any(w in e["title"].lower() for w in words)), None)
    if not target:
        return {"type": "unknown", "error": f'Couldn\'t find an event matching "{residual}".'}

    if action_type == "delete":
        return {"type": "delete", "eventId": target["id"], "eventTitle": target["title"],
                "summary": f'Remove "{target["title"]}" ({day_full[target["day"]]})'}

    new_day = col if col is not None else target["day"]
    summary = f'Move "{target["title"]}" to {day_full[new_day]}'
    if start_hour is not None:
        summary += f", {decimal_to_time_label(start_hour)}"
    return {
        "type": "move", "eventId": target["id"], "eventTitle": target["title"],
        "newDay": new_day, "newStartHour": start_hour, "summary": summary,
    }
