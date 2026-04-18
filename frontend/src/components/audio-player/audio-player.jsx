import "./audio-player.css";

export default function AudioPlayer({ isPlaying, size = "small" }) {
  return (
    <div className={`cover ${size}`}>
      <div className={`icon ${size}`}>
        <div className="speaker">
          <div className={`wave wave1 ${isPlaying ? "" : "paused"}`}></div>
          <div className={`wave wave2 ${isPlaying ? "" : "paused"}`}></div>
        </div>
      </div>
    </div>
  );
}
