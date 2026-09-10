import os
import tempfile

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

from command_parser import parse_command  # noqa: E402

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
CHAT_MODEL = os.environ.get("GROQ_CHAT_MODEL", "llama-3.3-70b-versatile")
WHISPER_MODEL = os.environ.get("GROQ_WHISPER_MODEL", "whisper-large-v3")

groq_client = None
if GROQ_API_KEY:
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
CORS(app, origins=os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","))


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "llmConfigured": groq_client is not None})


@app.post("/api/command")
def command():
    """Parse a natural-language scheduling command into a structured action.

    Body: { text: string, context: { todayIndex, startIdx, dayFull: string[], events: Event[] } }
    Does NOT mutate anything server-side — events live in the frontend's
    local state, matching the app's "no DB needed" storage model. The
    caller applies the returned action itself after the user confirms.
    """
    body = request.get_json(silent=True) or {}
    text = (body.get("text") or "").strip()
    ctx = body.get("context") or {}
    required = ("todayIndex", "startIdx", "dayFull", "events")
    if not text or any(k not in ctx for k in required):
        return jsonify({"error": "text and context.{todayIndex,startIdx,dayFull,events} are required"}), 400

    action, source = parse_command(groq_client, CHAT_MODEL, text, ctx)
    return jsonify({"action": action, "source": source})


@app.post("/api/transcribe")
def transcribe():
    """Speech-to-text via Groq Whisper. Expects multipart/form-data with an 'audio' file part."""
    if groq_client is None:
        return jsonify({"error": "GROQ_API_KEY not configured"}), 503

    audio = request.files.get("audio")
    if audio is None:
        return jsonify({"error": "audio file is required"}), 400

    suffix = os.path.splitext(audio.filename or "")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix) as tmp:
        audio.save(tmp.name)
        with open(tmp.name, "rb") as f:
            try:
                result = groq_client.audio.transcriptions.create(
                    file=(os.path.basename(tmp.name), f.read()),
                    model=WHISPER_MODEL,
                )
            except Exception as exc:
                return jsonify({"error": str(exc)}), 502

    return jsonify({"text": (result.text or "").strip()})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=True)
