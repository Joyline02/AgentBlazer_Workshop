import { useState } from "react";
import QuestionInput from "./components/QuestionInput";
import StageView from "./components/StageView";
import "./index.css";

export default function App() {
  const [stage, setStage] = useState(0);
  const [question, setQuestion] = useState("");
  const [stage1Data, setStage1Data] = useState(null);
  const [stage2Data, setStage2Data] = useState(null);
  const [stage3Data, setStage3Data] = useState(null);
  const [sessionId, setSessionId] = useState(""); // 🔥 NEW
  const [insights, setInsights] = useState(null); // 🔥 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE = "http://localhost:8000";

  async function handleSubmit(q) {
    setQuestion(q);
    setError(null);
    setLoading(true);
    setStage(1);
    try {
      const r = await fetch(`${BASE}/stage1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json();
      setStage1Data(data.responses);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStage2() {
    setLoading(true);
    setStage(2);
    try {
      const r = await fetch(`${BASE}/stage2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, responses: stage1Data }),
      });
      const data = await r.json();
      setStage2Data(data.reviews);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStage3() {
    setLoading(true);
    setStage(3);
    try {
      const r = await fetch(`${BASE}/stage3`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, responses: stage1Data, reviews: stage2Data }),
      });

      const data = await r.json();
      setStage3Data(data);
      setSessionId(data.session_id); // 🔥 STORE SESSION ID
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 NEW FEATURE: GET INSIGHTS
  async function getInsights() {
    try {
      const res = await fetch(`${BASE}/session/${sessionId}/insights`);
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      setError(e.message);
    }
  }

  // 🔥 NEW FEATURE: DOWNLOAD
  function downloadSession() {
    window.open(`${BASE}/session/${sessionId}/download`);
  }

  function handleReset() {
    setStage(0);
    setQuestion("");
    setStage1Data(null);
    setStage2Data(null);
    setStage3Data(null);
    setSessionId("");
    setInsights(null);
    setError(null);
  }

  return (
  <div className="app">
    <header className="header">
      <h1>LLM Council</h1>
    </header>

    <main>
      {error && <div className="error">{error}</div>}

      {stage === 0 && <QuestionInput onSubmit={handleSubmit} />}

      {stage >= 1 && (
        <StageView
          stage={stage}
          loading={loading}
          question={question}
          stage1Data={stage1Data}
          stage2Data={stage2Data}
          stage3Data={stage3Data}
          onNext={
            stage === 1 ? handleStage2 :
            stage === 2 ? handleStage3 : null
          }
          onReset={handleReset}
        />
      )}

      {/* OLD BUTTONS (optional, can remove later) */}
      

      {/* OPTIONAL JSON VIEW */}
      {insights && (
        <div style={{ marginTop: "20px" }}>
          <h3>Insights</h3>
          <pre>{JSON.stringify(insights, null, 2)}</pre>
        </div>
      )}
    </main>

    {/* 🔥 INSIGHTS PANEL (NOW INSIDE MAIN DIV) */}
    {stage === 3 && sessionId && (
      <div className="insights-panel">
        <div className="insights-title">INSIGHTS PANEL</div>

        <div className="insights-item">
          Session ID:
          <div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>
            {sessionId}
          </div>
        </div>

        {insights && (
          <>
            <div className="insights-item">
              🏆 Best Model:
              <span className="insights-highlight">
                {" "}{insights.best_model}
              </span>
            </div>

            <div className="insights-item">
              📊 Scores:
              <pre style={{ fontSize: "0.7rem", color: "var(--text3)" }}>
                {JSON.stringify(insights.scores, null, 2)}
              </pre>
            </div>
          </>
        )}

        <div className="insights-btns">
          <button className="insights-btn" onClick={getInsights}>
            View
          </button>

          <button className="insights-btn" onClick={downloadSession}>
            Download
          </button>
        </div>
      </div>
    )}
  </div>
);
}