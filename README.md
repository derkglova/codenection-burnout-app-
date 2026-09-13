# **Pacer by Skibidi**

**Team:** Derek Chay Wen Hong, Lim Kah Hou, Tan Jun Hao

**Problem Statement:** Stress & Workload Manager

**Video Presentation:** [Unlisted Youtube Link]

**Presentation Slides:** [Public Link]

## **1. Project Overview**

**The Problem.** University students juggle academics, part-time jobs, and social commitments with no single place that reflects all three — assignments live in a portal, shifts live in a group chat, and plans live in someone's head. Burnout builds silently from this pile-up rather than one big event, and by the time a student notices they're overloaded, most of the damage (skipped sleep, missed plans, decision fatigue) has already happened. The stakeholders are primarily university students balancing coursework with paid work and a social life.

Existing tools split into two camps, and neither closes the loop. **Voiset**, a voice-driven AI study planner, already tracks workload and lets students dictate tasks — but it's scoped to academic planning only (assignments, exams) and doesn't touch job shifts, social plans, or actively rearrange commitments once they're on the calendar. Wellness-scoring apps like **BurnoutGuard** and **Welltory** measure stress/energy but have no calendar integration at all, so the insight never turns into an action. Professional calendar tools like **Reclaim.ai** and **Motion** auto-reschedule around priorities but have no voice input and aren't built for a student's scattered life, only meetings.

**Our Solution.** Pacer is a weekly calendar that a student builds and rearranges just by talking to it — no forms and separate app for work shifts versus assignments versus plans with friends. An AI buddy turns speech (or typed text) directly into calendar events and can rearrange existing ones on request, closing the loop between "I'm overloaded" and "here's what changed." A capacity bar forecasts tomorrow's load from what's already scheduled, and nudges the student — with a concrete reschedule suggestion — before the day gets overwhelming, not after.

**Core features:**

- Voice (or text) input that creates calendar events end-to-end, across academics, work, and social life
- Voice-triggered replanning — move, cancel, or adjust existing commitments conversationally, including vague/criteria-based requests ("I'm overwhelmed, move the unimportant stuff") without the student having to name a specific event
- Manual edit as a fallback for anything the buddy gets wrong — drag-and-drop on the calendar, or a click-to-edit modal
- Drain-colored calendar blocks showing at a glance which commitments are demanding
- Tomorrow's capacity bar, with a proactive nudge and reschedule suggestion when it's overloaded
- Daily sleep input (manual slider) feeding the capacity forecast
- The AI buddy can also proactively suggest a short recovery break when a day is overloaded, placed so it never overlaps an existing commitment or falls earlier than the current time

## **2. Ideation & Process**

### **2.1 Ideas We Considered**

| Idea | Why it was dropped / kept |
| :---- | :---- |
| Voice-driven whole-life calendar with AI buddy replanning (Chosen) | Directly answers that most students don't keep a calendar at all — friction, not workload-tracking, was the real barrier. Combines add + replan in one conversational flow, which none of the closest competitors do together. |
| Voice-only ingestion, no parallel text-parser build (Chosen) | Mentor feedback: the zero-friction voice input is the standout feature, not the burnout concept. Kept manual entry as a simple fallback instead of building a second ingestion path. |
| Tomorrow's capacity forecast + proactive nudge (Chosen) | Same-day "you're tired" tracking is too late to act on; a forward-looking forecast is the only version that lets the student actually reschedule before overload hits. |
| Three-battery (mental/physical/social) burnout dashboard as the core pitch | Demoted to nice-to-have. Mentor feedback and competitor research (BurnoutGuard, Welltory, etc.) showed capacity/burnout scoring already exists as a concept — it's not the differentiator on its own. |
| Syllabus/timetable OCR ingestion | Dropped. One more live API to keep working on demo day, and it doesn't add to the friction-removal story voice already tells on its own. |
| System Lockdown mode | Dropped. Not essential to the core loop; cut for build time. |
| Full agentic AI buddy (draft pushback / decline-shift messages) | Kept as nice-to-have — good demo material if time allows, not required to prove the concept. |

### **2.2 Ideation Boards**

Architecture flow and three-battery mindmap diagrams: [https://claude.ai/code/artifact/aee18a1d-ad50-410c-8892-01da0bae0314](https://claude.ai/code/artifact/aee18a1d-ad50-410c-8892-01da0bae0314)

The first diagram shows how a voice/text input travels through the backend to three engines (ingestion, reasoning, capacity math) and back to the dashboard. The second maps the original three-battery concept (mental/physical/social) and what drains vs. replenishes each — since demoted to a nice-to-have, but kept as the reasoning behind the single capacity bar.

### **2.3 Mentor Consultation**

| Date | Mentor | Feedback Received | What Was Changed |
| :---- | :---- | :---- | :---- |
| 7 Sep 2026, 9:40 PM | Teh Ming En | The three-battery/burnout-tracking concept isn't unique — similar framing exists elsewhere. The zero-friction voice input (talk → it's scheduled) is the standout feature and should be the center of the demo. Also questioned how "battery drain" per task is actually determined, calling it a guess as-is. | Repositioned the pitch around frictionless voice scheduling instead of battery-tracking. Cut OCR from the MVP to focus build time on voice. Added voice-triggered replanning as a must-have. Replaced the per-task drain guess with a simple, deterministic forward-looking capacity bar tied directly to a reschedule suggestion. |

## **3. Design & Prototype**

**UI Prototype:** [Public Link]

*[Add a link to the Figma/Canva/hosted design board, or embed 4–8 key screens as images with a caption on each explaining the interaction. The original design source for this build lives in `project/Pacer.dc.html` if a starting point is useful.]*

## **4. What Makes It Different**

1. **Whole-life scope, not just academics.** Voiset (the closest competitor) plans study tasks only. Pacer treats classes, work shifts, and social plans as the same kind of commitment, in one calendar.
2. **Voice for replanning, not just capture.** Every voice-calendar tool we found (Voiset, Smart Calendars AI, 0sec, MoteCalendar) converts speech into new events. None clearly support rearranging existing commitments conversationally — "move my shift, I'm overloaded" — which is Pacer's core interaction, not an add-on.
3. **Capacity forecast that ends in an action, not a number.** Burnout/wellness apps (BurnoutGuard, Welltory, Anticipate) show a stress score with no calendar tie-in. Calendar tools (Reclaim, Motion, Clockwise) reschedule but track no wellness signal. Pacer's forecast closes that loop: tomorrow's load is calculated, and the same AI buddy offers the fix.

| | Pacer | Voiset | Reclaim / Motion / Clockwise | BurnoutGuard / Welltory |
| :---- | :---- | :---- | :---- | :---- |
| Voice input | ✅ | ✅ | ❌ | ❌ |
| Whole-life scope (not just study or work) | ✅ | ❌ (academic only) | ❌ (meetings only) | N/A |
| Conversational replanning | ✅ | ⚠️ unclear / limited | ✅ (rule-based, not voice) | ❌ |
| Load forecast tied to a calendar action | ✅ | ⚠️ workload monitoring only | ❌ | ❌ (no calendar) |

## **5. Technical Architecture & Feasibility**

**Tech stack** (as actually implemented, verified against the repo):

- **Frontend:** Next.js 16 + React 19 (TypeScript), styled with inline styles component-by-component. Tailwind v4 is present from the `create-next-app` scaffold but isn't the primary styling approach used.
- **Backend:** Python 3.9 + Flask 3.0 — a small API layer (`backend/app.py`) exposing `/api/command` (parse a message into a reply + proposed calendar actions), `/api/transcribe` (voice-to-text), and `/api/health`.
- **Voice:** Groq Whisper (`whisper-large-v3`), forced to English transcription.
- **Agent / reasoning:** Groq (`openai/gpt-oss-120b`) via LangChain (`langchain-groq`), using real tool-calling — the model can call `add_event` / `move_event` / `delete_event` zero or more times per message (so one message like "I have an exam Friday, a shift Saturday, and plans Sunday" produces three proposed events, not one), then replies conversationally. Implemented as a manual bind-tools loop rather than LangChain's `AgentExecutor`, to avoid ReAct-style text-parsing fragility.
- **Reliability fallback:** if no API key is configured, or the LLM call fails for any reason (network issue, rate limit, malformed response), a dependency-free regex parser (mirrored in both Python and TypeScript) takes over so "Ask Pacer" still works — single-action only, no conversational reasoning, but never fully broken.
- **Calendar storage:** local frontend React state for the prototype — no database. Every proposed change (from voice, text, or drag-and-drop) is queued and requires explicit user confirmation before it touches the calendar; nothing is ever auto-applied. Google Calendar sync is a nice-to-have if time allows, not required for the core demo.
- **Constraint:** OCR/vision ingestion (originally planned via OpenAI `gpt-4o-mini`) was cut from the MVP, as planned — one less live API to keep working reliably during a demo.

**System architecture diagram**

See Section 2.2 above for the request-flow diagram.

**Build plan & scope — status**

**Must-have (complete):**

- ✅ Weekly calendar, full-page view
- ✅ AI buddy (voice + text) adds tasks to the calendar
- ✅ AI buddy reschedules/edits/removes existing tasks conversationally
- ✅ Manual edit as a fallback (drag-and-drop + edit modal)
- ✅ Drain-colored calendar blocks
- ✅ Tomorrow's capacity bar, with a nudge + reschedule suggestion when overloaded
- ✅ Daily sleep input (manual slider) feeding the capacity forecast

**Nice-to-have — actual status:**

- ✅ **Recovery-session suggestions during free time** — done, and made deliberately safe: a suggested recovery block is placed in a genuinely free gap (never overlapping an existing event) and never earlier than the current time on today
- ❌ Three-battery (mental/physical/social) breakdown — not built; kept to the single capacity bar as scoped
- ❌ Auto-predicted sleep from calendar gaps — not built; sleep is manual-only
- ❌ Syllabus/timetable OCR ingestion — not built, cut as planned
- ❌ Google Calendar bidirectional sync — not built
- ❌ Draft pushback / decline-shift messages — not built
- ❌ System Lockdown mode — not built, dropped as planned

Scope was kept intentionally narrow: one conversational interface (voice or text) driving one calendar, with the capacity forecast as the only "intelligence" layer beyond basic CRUD. Everything else was additive polish, applied where build time allowed.


