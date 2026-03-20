import { useState } from "react";

const SAMPLE_QUESTIONS = [
  "What is recursion in programming?",
  "Explain the CAP theorem in distributed systems.",
  "What is the difference between a process and a thread?",
  "How does a neural network learn?",
  "What is Big O notation and why does it matter?",
];

export default function QuestionInput({ onSubmit }) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (value.trim()) onSubmit(value.trim());
  }

  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  }

  return (
    <div className="question-screen">
      <div className="question-card">
        <div className="question-header">
          <div className="question-label">SUBMIT YOUR QUESTION</div>
          <p className="question-hint">The council will reason independently, critique each other, then deliver a final verdict.</p>
        </div>

        <textarea
          className="question-textarea"
          placeholder="Ask something challenging..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          rows={4}
          autoFocus
        />

        <div className="question-actions">
          <span className="question-shortcut">Ctrl + Enter to submit</span>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!value.trim()}
          >
            Convene the Council
          </button>
        </div>

        <div className="sample-questions">
          <div className="sample-label">SAMPLE QUESTIONS</div>
          <div className="sample-list">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                className="sample-btn"
                onClick={() => setValue(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}