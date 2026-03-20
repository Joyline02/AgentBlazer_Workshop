import os
import json
import uuid
import time
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

from backend.council import run_stage1, run_stage2, run_stage3

app = FastAPI(title="LLM Council API", version="1.0.0")

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS_DIR = Path("data/sessions")
SESSIONS_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------
# Request Models
# -------------------------

class Stage1Request(BaseModel):
    question: str

class Stage2Request(BaseModel):
    question: str
    responses: list[dict]

class Stage3Request(BaseModel):
    question: str
    responses: list[dict]
    reviews: list[dict]

# -------------------------
# Routes
# -------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "groq_key_set": bool(os.getenv("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")),
        "mistral_key_set": bool(os.getenv("REgE1yAN54RqfJitzpI5elBbvrHMIESg")),
    }


@app.post("/stage1")
def stage1(request: Stage1Request):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        responses = run_stage1(request.question)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {"responses": responses}


@app.post("/stage2")
def stage2(request: Stage2Request):
    if not request.responses:
        raise HTTPException(status_code=400, detail="Stage 1 responses are required.")

    try:
        reviews = run_stage2(request.question, request.responses)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {"reviews": reviews}


@app.post("/stage3")
def stage3(request: Stage3Request):
    if not request.responses or not request.reviews:
        raise HTTPException(status_code=400, detail="Stage 1 + Stage 2 required.")

    try:
        result = run_stage3(request.question, request.responses, request.reviews)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    session = {
        "session_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "question": request.question,
        "stage1": request.responses,
        "stage2": request.reviews,
        "stage3": result,
    }

    _save_session(session)

    return {
        "summary": result["summary"],
        "verdict": result["verdict"],
        "session_id": session["session_id"]
    }


@app.get("/sessions")
def list_sessions():
    sessions = []
    for file in sorted(SESSIONS_DIR.glob("*.json"), reverse=True):
        try:
            with open(file) as f:
                data = json.load(f)
            sessions.append({
                "session_id": data.get("session_id"),
                "timestamp": data.get("timestamp"),
                "question": data.get("question"),
            })
        except:
            continue
    return sessions


@app.get("/sessions/{session_id}")
def get_session(session_id: str):
    for file in SESSIONS_DIR.glob("*.json"):
        try:
            with open(file) as f:
                data = json.load(f)
            if data.get("session_id") == session_id:
                return data
        except:
            continue
    raise HTTPException(status_code=404, detail="Session not found")


# -------------------------
# 🔥 NEW FEATURES
# -------------------------

import re  # ✅ make sure this is at top of file


@app.get("/session/{session_id}/insights")
def get_insights(session_id: str):
    for file in SESSIONS_DIR.glob("*.json"):
        try:
            with open(file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            continue

        if data.get("session_id") == session_id:
            reviews = data.get("stage2", [])

            scores = {}

            # 🔥 FIXED scoring logic
            for review in reviews:
                ranking = review.get("ranking", [])

                # ensure it's a list
                if not isinstance(ranking, list):
                    continue

                # ✅ FILTER ONLY valid models (Model A, B, C...)
                clean_ranking = []
                for model in ranking:
                    model = str(model).strip()
                    if re.match(r"^Model\s+[A-Z]$", model):
                        clean_ranking.append(model)

                # skip if nothing valid
                if not clean_ranking:
                    continue

                # score only valid models
                for i, model in enumerate(clean_ranking):
                    scores[model] = scores.get(model, 0) + (len(clean_ranking) - i)

            # handle empty case
            if not scores:
                return {
                    "best_model": "No valid ranking data",
                    "scores": {},
                }

            # get best model
            best_model = max(scores, key=scores.get)

            return {
                "best_model": best_model,
                "scores": scores,
            }

    raise HTTPException(status_code=404, detail="Session not found")

# ⚡ 3. STREAMING RESPONSES (BONUS)
@app.post("/stage1-stream")
def stage1_stream(request: Stage1Request):

    def generate():
        try:
            responses = run_stage1(request.question)
            for res in responses:
                yield f"{res}\n\n"
                time.sleep(1)
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")


# -------------------------
# Helper
# -------------------------

def _save_session(session: dict):
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = SESSIONS_DIR / f"session_{timestamp}.json"

    with open(filename, "w") as f:
        json.dump(session, f, indent=2)