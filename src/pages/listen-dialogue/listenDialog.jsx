import { useState } from "react";
import AutoChat from "./AutoChat";
import "./listenDialog.css";

export default function ListenDialog() {
  const [showTranscript, setShowTranscript] = useState(true);

  return (
    <div className="listen-dialog-wrapper">
      <h1 className="dialog-title">Listening & Dialogue Simulation</h1>
      <div className="dialog-chat-area">
        <AutoChat showTranscript={showTranscript} />
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={() => setShowTranscript(!showTranscript)}>
          {showTranscript ? "Hide Transcript" : "Show Transcript"}
        </button>
      </div>
    </div>
  );
}
