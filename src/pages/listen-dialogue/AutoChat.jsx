import { useEffect, useState, useRef, useCallback } from "react";
import ChatBubble from "./ChatBubble";
import "./listenDialog.css";

export default function AutoChat({ showTranscript }) {
  const [messages, setMessages] = useState([]);
  const [displayMsgs, setDisplayMsgs] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSide, setTypingSide] = useState("left");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState(false);

  const chatRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/listening/finnish_for_work/dialogues/kahvitauolla_2/part1",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("HTTP: " + res.status);

        const data = await res.json();
        const part = data.result.part1;

        const ordered = Object.entries(part)
          .sort(([a], [b]) => {
            const [a1, a2] = a.split("_").slice(1).map(Number);
            const [b1, b2] = b.split("_").slice(1).map(Number);
            return a2 - b2 || a1 - b1;
          })
          .map(([k, v]) => ({
            speaker: k.split("_")[1],
            text: v.script,
            avatar: v.imageLink,
            audio: v.audioLink,
          }));

        setMessages(ordered);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const playAudio = useCallback(
    (msg, onFinish) => {
      const audio = audioRef.current;
      if (!msg.audio) {
        setTimeout(onFinish, 800);
        return;
      }

      audio.src = msg.audio;
      audio.onended = () => {
        audio.onended = null; 
        onFinish();
      };

      audio
        .play()
        .catch(() => {
          audio.onended = null;
          onFinish();
        });
    },
    []
  );

  useEffect(() => {
    if (!isPlaying || loading || index >= messages.length) return;

    const msg = messages[index];

    const next = () => setIndex((i) => i + 1);

    if (showTranscript) {
      setIsTyping(true);
      setTypingSide(msg.speaker === "1" ? "left" : "right");

      const typingDelay = 600 + Math.random() * 600;

      const timer = setTimeout(() => {
        setIsTyping(false);
        setDisplayMsgs((prev) => [...prev, msg]);
        playAudio(msg, next);
      }, typingDelay);

      return () => clearTimeout(timer);
    }

    playAudio(msg, next);
  }, [index, isPlaying, messages, showTranscript, playAudio, loading]);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [displayMsgs, isTyping]);

  const handleStart = () => {
    if (cooldown || loading) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 1000);

    setDisplayMsgs([]);
    setIndex(0);
    setIsPlaying(true);
  };

  if (loading)
    return <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>;

  return (
    <div>
      <div ref={chatRef} className="auto-chat-container">
        {displayMsgs.map((msg, i) => (
          <ChatBubble
            key={i}
            avatar={msg.avatar}
            text={showTranscript ? msg.text : ""}
            isLeft={msg.speaker === "1"}
          />
        ))}

        {isTyping && showTranscript && (
          <div className={`chat-bubble-row ${typingSide}`}>
            <div className="chat-bubble typing-indicator">
              <div className="typing-loader"></div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button disabled={cooldown || loading} onClick={handleStart}>
          {loading ? "Loading..." : "Start / Replay"}
        </button>
      </div>
    </div>
  );
}
