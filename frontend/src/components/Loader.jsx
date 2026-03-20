const MESSAGES = {
  1: ["Convening the council...", "Models are reasoning independently...", "Collecting opinions..."],
  2: ["Anonymising responses...", "Models are reviewing each other...", "Gathering critiques..."],
  3: ["Mistral is deliberating...", "Synthesising the council's reasoning...", "Delivering verdict..."],
};

import { useState, useEffect } from "react";

export default function Loader({ stage }) {
  const msgs = MESSAGES[stage] || MESSAGES[1];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 2000);
    return () => clearInterval(t);
  }, [stage]);

  return (
    <div className="loader-container">
      <div className="loader-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>
      <div className="loader-message">{msgs[idx]}</div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
    </div>
  );
}