import AudioPlayer from "../../components/audio-player/audio-player";
import React from "react";

function ChatBubble({ avatar, text, isLeft, showAudioPlayer, isPlaying }) {
  return (
    <div className={`chat-bubble-row ${isLeft ? "left" : "right"}`}>
      <img src={avatar} className="chat-avatar" />
      <div className="chat-bubble">
        {showAudioPlayer ? (
          <AudioPlayer isPlaying={isPlaying} size="small" />
        ) : (
          text
        )}
      </div>
    </div>
  );
}

export default React.memo(ChatBubble);
