import { useState } from "react";
import ReactMarkdown from "react-markdown";

const MODEL_COLORS = {
  llama:    { accent: "#00D9FF", label: "GROQ" },
  compound: { accent: "#A78BFA", label: "GROQ" },
};

function getColor(modelId) {
  return MODEL_COLORS[modelId] || { accent: "#4ADE80", label: "AI" };
}

export default function Stage1View({ responses }) {
  const [activeTab, setActiveTab] = useState({});

  function getTab(id) { return activeTab[id] || "reasoning"; }
  function setTab(id, tab) { setActiveTab((p) => ({ ...p, [id]: tab })); }

  return (
    <div className="response-grid">
      {responses.map((resp) => {
        const { accent, label } = getColor(resp.model_id);
        const tab = getTab(resp.model_id);
        return (
          <div key={resp.model_id} className="response-card" style={{ "--accent": accent }}>
            <div className="card-header">
              <div className="model-identity">
                <span className="model-provider-tag" style={{ color: accent }}>{label}</span>
                <span className="model-name">{resp.model_name}</span>
              </div>
              <div className="card-tabs">
                <button
                  className={`tab-btn ${tab === "reasoning" ? "active" : ""}`}
                  onClick={() => setTab(resp.model_id, "reasoning")}
                >
                  Reasoning
                </button>
                <button
                  className={`tab-btn ${tab === "answer" ? "active" : ""}`}
                  onClick={() => setTab(resp.model_id, "answer")}
                >
                  Answer
                </button>
              </div>
            </div>
            <div className="card-body">
              {tab === "reasoning" ? (
                <div className="reasoning-block">
                  <div className="reasoning-tag">THINKING</div>
                  <ReactMarkdown>{resp.reasoning}</ReactMarkdown>
                </div>
              ) : (
                <div className="answer-block">
                  <ReactMarkdown>{resp.answer}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}