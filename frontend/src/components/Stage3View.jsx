import ReactMarkdown from "react-markdown";

export default function Stage3View({ data }) {
  return (
    <div className="verdict-container">
      <div className="verdict-judge-tag">
        <span className="judge-dot" />
        MISTRAL SMALL — JUDGE
      </div>

      <div className="verdict-card">
        <div className="verdict-section">
          <div className="verdict-section-label">SUMMARY</div>
          <div className="verdict-summary">
            <ReactMarkdown>{data.summary}</ReactMarkdown>
          </div>
        </div>

        <div className="verdict-divider" />

        <div className="verdict-section">
          <div className="verdict-section-label">FINAL VERDICT</div>
          <div className="verdict-body">
            <ReactMarkdown>{data.verdict}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}