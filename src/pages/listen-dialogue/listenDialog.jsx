import { useState, useRef } from "react";
import AutoChat from "./AutoChat";
import "./listenDialog.css";

export default function ListenDialog() {
  const [showTranscript, setShowTranscript] = useState(true);
  const autoChatRef = useRef();

  const handleStart = () => {
    if (autoChatRef.current && autoChatRef.current.handleStart) {
      autoChatRef.current.handleStart();
    }
  };

  return (
    <div className="listen-dialog-wrapper">
      <h1 className="dialog-title">Listening & Dialogue Simulation</h1>
      <div className="dialog-chat-area">
        <AutoChat ref={autoChatRef} showTranscript={showTranscript} />
        <div className="dialog-bottom-controls">
          <button className="dialog-btn" onClick={handleStart}>
            Start / Replay
          </button>
          <button className="dialog-btn" onClick={() => setShowTranscript(!showTranscript)}>
            {showTranscript ? "Hide Transcript" : "Show Transcript"}
          </button>
        </div>
      </div>
    </div>
  );
}
