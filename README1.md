# 🧠 LLM Council

An interactive system that evaluates multiple AI model responses using a structured multi-stage pipeline.

---

## 🚀 Features

### Stage 1 – Response Generation
- Multiple LLMs generate answers to the same question.
- Each response includes reasoning and final answer.

### Stage 2 – Peer Review
- Models review anonymized responses.
- Rankings are generated based on quality.

### Stage 3 – Final Verdict
- A judge model synthesizes the best final answer.

---

## 🔥 Enhancements & Modifications

### Backend Improvements
- Fixed ranking parsing to convert LLM text into structured lists.
- Added validation to filter only valid models (Model A, Model B, etc.).
- Improved scoring system to avoid incorrect insights.
- Added error handling for malformed or missing ranking data.

### Frontend Improvements
- Fixed ReactMarkdown crash by converting arrays into strings.
- Added safe rendering checks to prevent blank screens.
- Improved UI stability and user experience.

### New Features
- 🧠 Insights Panel:
  - Displays best performing model
  - Shows score distribution
- 📥 Download Session:
  - Allows exporting session data
- 🔄 Session Tracking:
  - Each run is saved and can be analyzed later

---

## 📊 Insights Logic

- Each ranking assigns scores:
  - First place → highest score
  - Second → lower score
- Only valid models are considered:
- Best model is selected using highest cumulative score.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **LLMs:** Groq (LLaMA), Mistral

---

## ⚠️ Challenges Faced

- LLMs returning unstructured ranking text
- Frontend crashes due to invalid data types
- Incorrect scoring from noisy outputs

---

## ✅ Solutions Implemented

- Strict ranking parsing using regex
- Data validation before scoring
- Safe rendering in frontend components

---

## 🎯 Outcome

The system is now:
- Stable ✅
- Accurate ✅
- User-friendly ✅
- Ready for evaluation ✅

---


