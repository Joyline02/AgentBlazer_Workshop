import ReactMarkdown from "react-markdown";

const MODEL_COLORS = {
  llama:    { accent: "#00D9FF" },
  compound: { accent: "#A78BFA" },
};

function getColor(modelId) {
  return MODEL_COLORS[modelId] || { accent: "#4ADE80" };
}

export default function Stage2View({ reviews }) {
  return (
    <div className="response-grid">
      {reviews.map((review) => {
        const { accent } = getColor(review.reviewer_id);

        return (
          <div key={review.reviewer_id} className="response-card" style={{ "--accent": accent }}>
            <div className="card-header">
              <div className="model-identity">
                <span className="model-provider-tag" style={{ color: accent }}>REVIEWER</span>
                <span className="model-name">{review.reviewer_name}</span>
              </div>
            </div>

            <div className="card-body">

              {/* CRITIQUE */}
              <div className="review-section">
                <div className="review-section-label">CRITIQUE</div>
                <div className="review-content">
                  <ReactMarkdown>
                    {typeof review.critique === "string" ? review.critique : ""}
                  </ReactMarkdown>
                </div>
              </div>

              {/* RANKING */}
              <div className="review-section">
                <div className="review-section-label">RANKING</div>
                <div className="review-content ranking-content">
                  <ReactMarkdown>
                    {Array.isArray(review.ranking)
                      ? review.ranking.join(" > ")
                      : String(review.ranking || "")}
                  </ReactMarkdown>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}