"""LangChain/Groq tool-calling agent for multi-action, conversational
command parsing.

Unlike the old single-shot "ask for one strict JSON object" approach,
this lets the model call zero or more add_event/move_event/delete_event
tools (e.g. three add_event calls for one multi-part request) and then
respond with a short conversational reply. Tool calls never mutate
anything server-side — each tool normalizes its args via hydrate_action
(shared with the regex fallback) and queues the result; the frontend
applies the batch only after the user confirms.

Falls back to command_parser.parse_with_regex on any failure (no key,
network error, malformed tool call, model never stops calling tools),
mirroring the old parse_command's try/except-fallback shape.
"""
from typing import Optional

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from pydantic import BaseModel, Field

from capacity import compute_capacity, status_label
from command_parser import decimal_to_time_label, hydrate_action, parse_with_regex

MAX_ITERS = 6
MAX_HISTORY_TURNS = 12
DEFAULT_SLEEP_HOURS = 5.5


class AddEventArgs(BaseModel):
    title: str = Field(description="Short event title, e.g. 'Chem exam'")
    day: int = Field(ge=0, le=6, description="Day index 0-6 per the mapping given in the system prompt")
    startHour: float = Field(default=9, description="24h decimal hour, 0-23.75, quarter-hour steps (e.g. 14.5 = 2:30pm)")
    duration: float = Field(default=1, description="Duration in hours, e.g. 1.5")


class MoveEventArgs(BaseModel):
    eventId: int = Field(description="id of an existing event from the events list in the system prompt")
    userNamedEvent: bool = Field(
        default=False,
        description="True only if the user explicitly named/identified this exact event themselves; "
        "False if you picked it yourself via criteria (drain level, load contribution, etc).",
    )
    newDay: Optional[int] = Field(default=None, ge=0, le=6)
    newStartHour: Optional[float] = Field(default=None)


class DeleteEventArgs(BaseModel):
    eventId: int = Field(description="id of an existing event from the events list in the system prompt")
    userNamedEvent: bool = Field(
        default=False,
        description="True only if the user explicitly named/identified this exact event themselves; "
        "False if you picked it yourself via criteria (drain level, load contribution, etc).",
    )


def _is_ongoing(event, ctx):
    now_hour = ctx.get("nowHour")
    if now_hour is None or event["day"] != ctx.get("todayIndex"):
        return False
    return event["startHour"] <= now_hour < event["startHour"] + event["duration"]


def _build_tools(ctx, actions):
    """Tools close over this request's ctx (events/day mapping) and an
    `actions` accumulator list. Invoking a tool never mutates anything —
    it normalizes+validates via hydrate_action and queues a proposal."""

    @tool("add_event", args_schema=AddEventArgs)
    def add_event(title: str, day: int, startHour: float = 9, duration: float = 1) -> str:
        """Propose adding a new event to the calendar. Does not apply it — queues it for user confirmation."""
        result = hydrate_action({"type": "add", "title": title, "day": day, "startHour": startHour, "duration": duration}, ctx)
        actions.append(result)
        return f"Queued: {result['summary']}"

    @tool("move_event", args_schema=MoveEventArgs)
    def move_event(eventId: int, userNamedEvent: bool = False, newDay: Optional[int] = None, newStartHour: Optional[float] = None) -> str:
        """Propose moving/rescheduling an existing event by id. Leave a field null to keep it unchanged."""
        target = next((e for e in ctx["events"] if e["id"] == eventId), None)
        if target and not userNamedEvent and _is_ongoing(target, ctx):
            return "Skipped — that event is in progress right now. Only touch it if the user specifically asked for that one."
        result = hydrate_action({"type": "move", "eventId": eventId, "newDay": newDay, "newStartHour": newStartHour}, ctx)
        if result["type"] == "unknown":
            return result["error"]
        actions.append(result)
        return f"Queued: {result['summary']}"

    @tool("delete_event", args_schema=DeleteEventArgs)
    def delete_event(eventId: int, userNamedEvent: bool = False) -> str:
        """Propose deleting/cancelling an existing event by id."""
        target = next((e for e in ctx["events"] if e["id"] == eventId), None)
        if target and not userNamedEvent and _is_ongoing(target, ctx):
            return "Skipped — that event is in progress right now. Only touch it if the user specifically asked for that one."
        result = hydrate_action({"type": "delete", "eventId": eventId}, ctx)
        if result["type"] == "unknown":
            return result["error"]
        actions.append(result)
        return f"Queued: {result['summary']}"

    return [add_event, move_event, delete_event]


def _build_system_prompt(ctx):
    events = ctx["events"]
    day_full = ctx["dayFull"]
    today_index = ctx["todayIndex"]
    sleep_hours = ctx.get("sleepHours") or DEFAULT_SLEEP_HOURS

    events_list = "\n".join(
        f'- id:{e["id"]} "{e["title"]}" {day_full[e["day"]]} '
        f'{decimal_to_time_label(e["startHour"])} ({e["duration"]}h, drain:{e["drain"]})'
        for e in events
    ) or "(none)"

    capacity_list = "\n".join(
        f'- {i}:{day_full[i]} — {(cap := compute_capacity(events, i, sleep_hours))["percent"]}% ({status_label(cap["percent"])})'
        for i in range(7)
    )

    now_hour = ctx.get("nowHour")
    now_line = f" It's currently {decimal_to_time_label(now_hour)} — don't propose a time earlier than that for today." if now_hour is not None else ""

    return (
        "You are Pacer, a conversational scheduling assistant living inside a weekly "
        "burnout-prevention calendar app. You help the user plan their week without "
        "overloading themselves.\n\n"
        f"Today is {day_full[today_index]} (day index {today_index}).{now_line} If the user's "
        "message doesn't name a specific day (e.g. \"I'm overwhelmed\"), assume they mean today "
        "— never substitute a different day just because it looks more overloaded.\n\n"
        f"Existing events:\n{events_list}\n\n"
        f"Capacity per day (load vs. sleep-based budget):\n{capacity_list}\n\n"
        "Use the add_event / move_event / delete_event tools to PROPOSE changes — calling a "
        "tool never applies anything immediately, it just queues a change the app will ask the "
        "user to confirm. You may call multiple tools, including several of the same tool, in "
        "one turn to satisfy multi-part requests (e.g. three separate events to add). eventId "
        "must come from the existing events list above; if the user names a specific event you "
        "can't find, don't guess an id — ask a clarifying question instead of calling a tool.\n\n"
        "Criteria-based targeting: the user may describe which event to touch by criteria "
        "instead of by name — e.g. tired/overwhelmed + \"unimportant\"/\"the boring one\" means "
        "prefer a low-drain event that day; \"swamped\"/\"too much\" means prefer whichever "
        "event is contributing most to that day's load. In these cases pick your best-guess "
        "eventId from the events+capacity info above, call the tool, and name which event you "
        "picked in your reply so the user can correct you — don't ask a clarifying question "
        "first when a reasonable guess is possible. move_event/delete_event take a "
        "userNamedEvent flag: set it true only when the user explicitly named or clearly "
        "identified that exact event, false when you're picking it yourself via criteria — a "
        "guessed target that's currently in progress right now gets skipped automatically, so "
        "pick a different candidate in that case.\n\n"
        "Capacity-aware recovery suggestions: if a day relevant to the conversation (one the "
        "user mentioned, or one your own proposed adds/moves push over budget) shows above "
        "100% (\"Overloaded\"), consider proposing a short recovery block for that day via "
        "add_event with a rest/nap/chill/break-style title — that kind of title is classified "
        "as \"recovery\", which actually lowers the day's load — in addition to any moves, and "
        "say briefly why. Only surface this when a day is actually overloaded; don't add a "
        "recovery block when capacity is fine, and don't add one silently without mentioning it "
        "in your reply. Capacity numbers reflect the schedule before this turn's changes, not "
        "re-simulated after each tool call — close enough to reason with, not exact.\n\n"
        "Default startHour to 9 and duration to 1 for adds when unspecified, and snap to "
        "quarter-hour steps.\n\n"
        "Once you're done proposing changes (or if no changes are needed), respond with a "
        "short, friendly, conversational message (1-3 sentences) explaining your reasoning in "
        "plain language — do not restate the raw list of actions, the app already shows them as "
        "a checklist next to your reply."
    )


def _history_to_messages(history):
    msgs = []
    for turn in (history or [])[-MAX_HISTORY_TURNS:]:
        role, text = turn.get("role"), turn.get("text") or ""
        if not text:
            continue
        msgs.append(HumanMessage(content=text) if role == "user" else AIMessage(content=text))
    return msgs


def parse_with_agent(chat_model, text, ctx, history):
    actions = []
    tools = _build_tools(ctx, actions)
    llm = chat_model.bind_tools(tools)
    tool_map = {t.name: t for t in tools}

    messages = [SystemMessage(content=_build_system_prompt(ctx))]
    messages.extend(_history_to_messages(history))
    messages.append(HumanMessage(content=text))

    reply = ""
    for _ in range(MAX_ITERS):
        ai_msg = llm.invoke(messages)
        messages.append(ai_msg)
        if not ai_msg.tool_calls:
            reply = ai_msg.content or ""
            break
        for call in ai_msg.tool_calls:
            fn = tool_map.get(call["name"])
            try:
                result = fn.invoke(call["args"]) if fn else f"Unknown tool {call['name']}"
            except Exception as exc:  # bad/partial args from the model, etc.
                result = f"Couldn't apply that: {exc}"
            messages.append(ToolMessage(content=str(result), tool_call_id=call["id"]))
    else:
        reply = reply or "Here's what I've got so far."

    if not actions and not reply:
        reply = "Not sure what you mean — try describing what to add, move, or delete."
    return reply, actions


def parse_command(chat_model, text, ctx, history):
    """Try the LangChain tool-calling agent; fall back to the offline regex
    parser (wrapped into the same envelope) on any failure."""
    if chat_model is not None:
        try:
            reply, actions = parse_with_agent(chat_model, text, ctx, history)
            return reply, actions, "llm"
        except Exception:
            pass
    action = parse_with_regex(text, ctx)
    if action["type"] == "unknown":
        return action.get("error") or "", [], "regex"
    return "", [action], "regex"
