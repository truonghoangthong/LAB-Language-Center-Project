import React from "react";
import "./game-embed.css";

const GameEmbed = ({
  projectId,              // ví dụ: "1235043346"
  src,                    // dùng khi không có projectId
  title = "Scratch Game",
  showTitle = false,
  className = "",
  width = 700,            // 👉 size bên ngoài: to hơn tí
  height = 400,           // 👉 chỉnh ở đây nếu muốn
}) => {
  // Dùng TurboWarp
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
          width={width}           // 🔥 QUAN TRỌNG
          height={height}         // 🔥 QUAN TRỌNG
          frameBorder="0"
          allow="fullscreen"
          allowFullScreen
          style={{ maxWidth: "100%" }} // để responsive
        />
      </div>
    </div>
  );
};

export default GameEmbed;
