# LLM Council — AgentBlazer Workshop

A hands-on workshop application where multiple AI models collaborate to answer a question. Each model reasons independently, critiques the others, and a neutral judge delivers a final verdict.

---

## How It Works

| Stage | What Happens |
|-------|-------------|
| **1 — Opinions** | LLaMA 70B and Compound Beta each receive your question independently and show their step-by-step reasoning before answering |
| **2 — Peer Review** | Each model reads the other's response (anonymised) and critiques the reasoning quality |
| **3 — Verdict** | Mistral Small acts as judge, synthesises the best reasoning, and delivers a final answer |

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- Three free API keys (no credit card required)

| Provider | Model Used | Get Key |
|----------|-----------|---------|
| Groq | LLaMA 3.3 70B + Compound Beta | https://console.groq.com |
| Mistral | Mistral Small (judge) | https://console.mistral.ai |

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd AgentBlazer_Workshop
```

---

### 2. Create a virtual environment

**Windows (Command Prompt / PowerShell)**
```cmd
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS**
```bash
python3 -m venv venv
source venv/bin/activate
```

> You should see `(venv)` at the start of your prompt once the environment is active.  
> To deactivate at any time, run `deactivate`.

---

### 3. Install backend dependencies

**Windows & Linux (run after activating the venv)**
```bash
pip install -r requirements.txt
```

> On Linux, if you encounter system package conflicts outside a venv, add `--break-system-packages`. Inside a virtual environment this flag is not needed.

---

### 4. Configure API keys

**Windows (Command Prompt)**
```cmd
copy backend\.env.example backend\.env
notepad backend\.env
```

**Windows (PowerShell)**
```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

**Linux / macOS**
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Fill in your keys:

```
GROQ_API_KEY=your_groq_key_here
MISTRAL_API_KEY=your_mistral_key_here
```

---

### 5. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the App

Open two terminals from the project root. Make sure the virtual environment is **activated in each terminal** before running.

**Terminal 1 — Backend**
```bash
uvicorn backend.main:app --reload
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Testing the Backend

With the backend running, open a third terminal (activate the venv first), then run:

```bash
python test.py
```

All 5 tests should pass before proceeding to the frontend.

---

## Project Structure

```
AgentBlazer_Workshop/
├── test.py                        # Backend test suite
├── requirements.txt               # Python dependencies
│
├── backend/
│   ├── .env                       # API keys (never commit this)
│   ├── .env.example               # Template for .env
│   ├── .gitignore
│   ├── __init__.py
│   ├── main.py                    # FastAPI app + endpoints
│   ├── council.py                 # Three-stage orchestration logic
│   ├── config.py                  # Models, prompts, API URLs
│   └── providers/
│       ├── __init__.py            # Provider router
│       ├── groq.py                # Groq API (LLaMA + Compound Beta)
│       └── mistral.py             # Mistral API (judge)
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           ├── QuestionInput.jsx  # Question entry screen
│           ├── StageView.jsx      # Stage orchestrator
│           ├── Stage1View.jsx     # Independent opinions
│           ├── Stage2View.jsx     # Peer review
│           ├── Stage3View.jsx     # Final verdict
│           └── Loader.jsx         # Loading states
│
└── data/
    └── sessions/                  # Auto-saved session logs (JSON)
```

---

## Tech Stack

- **Backend** — FastAPI, httpx, python-dotenv
- **Frontend** — React 18, Vite, react-markdown
- **Models** — LLaMA 3.3 70B (Groq), Compound Beta (Groq), Mistral Small (Mistral AI)