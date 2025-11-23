import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AutoChat from "./AutoChat";
import Title from "../../components/listening-title/listening-title";
import "./listenDialog.css";

export default function ListenDialog() {
  const { topic } = useParams();

  const [lessonInfo] = useState({
    type: "dialog",
    lessonName: topic || "",
  });

  const [showTranscript, setShowTranscript] = useState(true);
  const autoChatRef = useRef();

  const handleStart = () => {
    if (autoChatRef.current?.handleStart) {
      autoChatRef.current.handleStart();
    }
  };

  return (
    <div className="listen-dialog-wrapper">
      <Title
        type={lessonInfo.type}
        lesson={lessonInfo.lessonName}
        instruction="Listen to the dialogue and read along. You can replay the dialogue and toggle the transcript visibility."
      />
      <div className="dialog-chat-area">
        <AutoChat ref={autoChatRef} showTranscript={showTranscript} />
        <div className="dialog-bottom-controls">
          <button className="dialog-btn" onClick={handleStart}>
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
