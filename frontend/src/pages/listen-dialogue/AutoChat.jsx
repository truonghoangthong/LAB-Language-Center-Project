import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback, 
  forwardRef, 
  useImperativeHandle 
} from "react";
import ChatBubble from "./ChatBubble";
import "./listenDialog.css";

/**
 * AutoChat component
 * ------------------
 * Automatically plays a dialogue line-by-line.
 * Each message:
 *    - Appears in the chat UI
 *    - Plays audio
 *    - Waits until audio finishes before moving to the next message
 * 
 * Parent can trigger the chat using ref.handleStart().
 */
const AutoChat = forwardRef(function AutoChat({ showTranscript }, ref) {
  const [messages, setMessages] = useState([]);      // Full script from API
  const [displayMsgs, setDisplayMsgs] = useState([]); // Messages currently visible
  const [index, setIndex] = useState(0);             // Current message index
  const [isTyping, setIsTyping] = useState(false);   // Typing animation state
  const [typingSide, setTypingSide] = useState("left");  
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [loading, setLoading] = useState(true);      // Waiting for API
  const [cooldown, setCooldown] = useState(false);   // Prevent rapid re-starts
  const [started, setStarted] = useState(false);     // Whether chat has been started

  const chatRef = useRef(null);                      // Chat container (for auto-scroll)
  const audioRef = useRef(new Audio());              // Global audio player

  /** Expose handleStart() to parent component */
  useImperativeHandle(ref, () => ({
    handleStart,
  }));

  /** Cleanup audio when component unmounts */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  /**
   * Fetch dialogue from API on mount
   * --------------------------------
   * After fetching:
   *    - Sort the script keys properly
   *    - Convert into usable message objects
   */
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

        // Convert key-value pairs to sorted message list
        const ordered = Object.entries(part)
          .sort(([a], [b]) => {
            // Keys look like: line_1_1 → [ 'line', '1', '1' ]
            const [a1, a2] = a.split("_").slice(1).map(Number);
            const [b1, b2] = b.split("_").slice(1).map(Number);
            return a2 - b2 || a1 - b1;
          })
          .map(([k, v]) => ({
            speaker: k.split("_")[1], // "1" or "2"
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

  /**
   * Play audio for a message
   * --------------------------------
   * - If audio exists → play it, then run onFinish() after it ends
   * - If audio does NOT exist → delay a bit then continue
   */
  const playAudio = useCallback((msg, onFinish) => {
    const audio = audioRef.current;

    // No audio → still simulate timing
    if (!msg.audio) {
      setAudioPlaying(false);
      setTimeout(onFinish, 800);
      return;
    }

    audio.src = msg.audio;

    audio.onended = () => {
      setAudioPlaying(false);
      audio.onended = null;
      onFinish();
    };

    audio
      .play()
      .then(() => setAudioPlaying(true))
      .catch(() => {
        // In case autoplay is blocked or audio error
        setAudioPlaying(false);
        onFinish();
      });
  }, []);

  /**
   * Main auto-chat engine
   * --------------------------------
   * Whenever index increases:
   *    - Push next message to the UI
   *    - Play audio
   *    - After audio ends → index++ triggers next cycle
   */
  useEffect(() => {
    if (loading || !started || index >= messages.length) return;

    const msg = messages[index];

    // Only add if not yet displayed
    if (displayMsgs.length === index) {
      setDisplayMsgs(prev => [...prev, msg]);
      playAudio(msg, () => setIndex(i => i + 1));
    }

  }, [index, messages, loading, displayMsgs.length, playAudio, started]);

  /**
   * Auto scroll to bottom when messages change
   */
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [displayMsgs, isTyping]);

  /**
   * Start the chat manually (called from parent using ref)
   * --------------------------------
   * Resets:
   *    - display messages
   *    - index
   */
  function handleStart() {
    if (cooldown || loading) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 1000);

    setDisplayMsgs([]);
    setIndex(0);
    setStarted(true);
  }

  if (loading)
    return <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>;

  return (
    <div>
      <div ref={chatRef} className="auto-chat-container">
        {displayMsgs.map((msg, i) => (
          <ChatBubble
            key={i}
            avatar={msg.avatar}
            isLeft={msg.speaker === "1"}
            text={showTranscript ? msg.text : ""}
            showAudioPlayer={!showTranscript}
            isPlaying={audioPlaying && i === displayMsgs.length - 1}
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
    </div>
  );
});

export default AutoChat;
