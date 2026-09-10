"""Drain (energy-cost) categories for scheduled events.

Ported from the Pacer.dc.html prototype's DRAIN table and classifyDrain()
so the backend's LLM fallback path and the frontend's client-side capacity
math agree on category names/weights.
"""

DRAIN = {
    "recovery": {"weight": -0.4, "color": "#34c759", "fill": "#248a3d", "label": "Recovery"},
    "low": {"weight": 0.5, "color": "#7a7a7a", "fill": "#6e6e6e", "label": "Low"},
    "medium": {"weight": 1, "color": "#0066cc", "fill": "#0066cc", "label": "Medium"},
    "high": {"weight": 1.8, "color": "#ff3b30", "fill": "#d70015", "label": "High"},
}

_RECOVERY = ["sleep", "nap", "rest", "relax", "chill", "hangout", "movie", "game night", "party", "break", "recovery", "recharge"]
_HIGH = ["exam", "midterm", "final", "test", "presentation", "interview", "deadline", "defense", "quiz"]
_MEDIUM = ["class", "lecture", "meeting", "work", "shift", "study", "studying", "homework", "assignment",
           "lab", "seminar", "practice", "rehearsal", "project"]
_LOW = ["gym", "walk", "lunch", "coffee", "call", "errand", "shopping", "laundry", "commute", "workout", "yoga"]


def classify_drain(text: str) -> str:
    t = (text or "").lower()
    if any(k in t for k in _RECOVERY):
        return "recovery"
    if any(k in t for k in _HIGH):
        return "high"
    if any(k in t for k in _MEDIUM):
        return "medium"
    if any(k in t for k in _LOW):
        return "low"
    return "medium"
