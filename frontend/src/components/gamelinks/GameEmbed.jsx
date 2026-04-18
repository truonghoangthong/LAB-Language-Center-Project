import React from "react";
import "./game-embed.css";

const GameEmbed = ({
  projectId,               // Scratch project ID (used with TurboWarp)
  src,                    // Fallback URL when projectId is not provided
  title = "Scratch Game",
  showTitle = false,
  className = "",
  width = 700,            // Default iframe width
  height = 400,           // Default iframe height
}) => {
  // Use TurboWarp embed if projectId exists
  const iframeSrc = projectId
    ? `https://turbowarp.org/${projectId}/embed`
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
          width={width}           // Required (TurboWarp uses fixed width/height)
          height={height}         // Required (TurboWarp uses fixed width/height)
          frameBorder="0"
          allow="fullscreen"
          allowFullScreen
          style={{ maxWidth: "100%" }} // Make iframe responsive on smaller screens
        />
      </div>
    </div>
  );
};

export default GameEmbed;
