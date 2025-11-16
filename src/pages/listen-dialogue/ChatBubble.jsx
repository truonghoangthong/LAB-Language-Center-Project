import React from "react";

function ChatBubble({ avatar, text, isLeft }) {
  return (
    <div className={`chat-bubble-row ${isLeft ? "left" : "right"}`}>
      <img src={avatar} className="chat-avatar" />
      <div className="chat-bubble">{text}</div>
    </div>
  );
}

export default React.memo(ChatBubble);
