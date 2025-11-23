import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AutoChat from "./AutoChat";
import Title from "../../components/listening-title/listening-title";
import "./listenDialog.css";

export default function ListenDialog() {
  const { topic } = useParams();
  const paramType = 'dialogues'; 
  const [showTranscript, setShowTranscript] = useState(true);
  const autoChatRef = useRef();

  return (
    <div className="listen-dialog-wrapper">
      <Title
        type={paramType}
        lesson={topic.replace(/-/g, " ")}
        instruction="Listen to the dialogue and read along."
      />

      <div className="dialog-chat-area">
        <AutoChat ref={autoChatRef} showTranscript={showTranscript} />

        <div className="dialog-bottom-controls">
          <button className="dialog-btn" onClick={() => autoChatRef.current?.handleStart()}>
            Start / Replay
          </button>

          <button
            className="dialog-btn"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? "Hide Transcript" : "Show Transcript"}
          </button>
        </div>
      </div>
    </div>
  );
}
