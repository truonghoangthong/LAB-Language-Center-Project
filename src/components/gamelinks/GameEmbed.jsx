import React from "react";
import "./game-embed.css";

const GameEmbed = ({
  projectId,              // ví dụ: "1235043346"
  src,                    // dùng khi không có projectId
  title = "Scratch Game",
  showTitle = false,
  className = ""
}) => {
  const iframeSrc = projectId
    ? `https://scratch.mit.edu/projects/${projectId}/embed`
    : src;

  if (!iframeSrc) {
    console.error("[GameEmbed] Missing `projectId` or `src`");
    return null;
  }

  return (
    <div className={`lesson-card ${className}`}>
      {showTitle && <div className="game-embed__header">{title}</div>}
      <div className="game-embed__frame">
        <iframe
          src={iframeSrc}
          title={title}
          allow="fullscreen"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </div>
  );
};

export default GameEmbed;
