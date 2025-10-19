import { useEffect, useRef, useState } from "react";
import "./audioPlayer.css";

/**
 * AudioPlayer component
 *
 * Small reusable audio player that shows a simple animated speaker icon
 * and toggles playback when clicked.
 *
 * Props:
 *  - src: (string) audio source URL or data URI
 *  - size: (string) one of "small" | "large" (default: "small")
 */
const AudioPlayer = ({ src, size = "small" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // When src changes: stop playback and reset animation/state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [src]);

  /**
   * Toggle playback state.
   *
   * Uses the audio element's play() which returns a promise.
   * Autoplay may be blocked by the browser; failures are silently ignored.
   */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play(); // playback state will update via event listeners
      } catch {
        // Autoplay may be blocked by the browser; ignore or show a toast if needed
      }
    } else {
      audio.pause(); // playback state will update via event listeners
    }
  };

  return (
    <div className={`cover ${size}`} onClick={togglePlay}>
      <div className={`icon ${size}`}>
        <div className="speaker">
          <div className={`wave wave1 ${isPlaying ? "" : "paused"}`}></div>
          <div className={`wave wave2 ${isPlaying ? "" : "paused"}`}></div>
        </div>
        <audio ref={audioRef} src={src} preload="auto"></audio>
      </div>
    </div>
  );
};

export default AudioPlayer;