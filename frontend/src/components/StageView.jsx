import Stage1View from "./Stage1View";
import Stage2View from "./Stage2View";
import Stage3View from "./Stage3View";
import Loader from "./Loader";

export default function StageView({
  stage, loading, question,
  stage1Data, stage2Data, stage3Data,
  onNext, onReset,
}) {
  const stageLabels = {
    1: { num: "01", title: "Independent Opinions", sub: "Each model reasons and answers independently" },
    2: { num: "02", title: "Peer Review",           sub: "Models critique each other's reasoning anonymously" },
    3: { num: "03", title: "Final Verdict",          sub: "Mistral synthesises the council's best thinking" },
  };

  const info = stageLabels[stage];

  return (
    <div className="stage-screen">
      <div className="stage-meta">
        <div className="stage-num">{info.num}</div>
        <div className="stage-meta-text">
          <div className="stage-title">{info.title}</div>
          <div className="stage-sub">{info.sub}</div>
        </div>
      </div>

      <div className="question-display">
        <span className="question-display-label">QUESTION</span>
        <span className="question-display-text">{question}</span>
      </div>

      {loading ? (
        <Loader stage={stage} />
      ) : (
        <>
          {stage === 1 && stage1Data && <Stage1View responses={stage1Data} />}
          {stage === 2 && stage2Data && <Stage2View reviews={stage2Data} />}
          {stage === 3 && stage3Data && <Stage3View data={stage3Data} />}

          <div className="stage-nav">
            <button className="btn-ghost" onClick={onReset}>
              New Question
            </button>
            {onNext && (
              <button className="btn-primary" onClick={onNext}>
                {stage === 1 ? "Proceed to Peer Review →" : "Deliver Final Verdict →"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}