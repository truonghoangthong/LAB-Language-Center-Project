import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/listening-title";
import AnswerPopup from "../../components/AnswerPopup/AnswerPopup";
import confetti from "canvas-confetti";
import "./listen-click.css";

const PARTS = ["part1", "part2", "part3"];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ListenAndClick = () => {
  const { level, topic } = useParams();

  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // gameplay states
  const [remainingIndexes, setRemainingIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    isCorrect: false,
    image: "",
    script: "",
    ipa: "",
  });

  const audioRef = useRef(null);
  const celebrationRef = useRef(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // ================== FETCH ALL PARTS ==================
  useEffect(() => {
    const fetchParts = async () => {
      if (!level || !topic) {
        setError("Invalid URL: missing level or topic.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const qMap = {};
      const imgMap = {};

      try {
        for (const part of PARTS) {
          const url = `http://localhost:3000/listening/${level}/click/${topic}/${part}`;
          const res = await fetch(url);
          if (!res.ok) continue;

          const data = await res.json();
          const raw = data?.result?.[part];
          if (!raw) continue;

          const items = shuffle(Object.values(raw)); // question order
          qMap[part] = items;
          imgMap[part] = shuffle(items); // image pool
        }

        setQuestionsByPart(qMap);
        setImagesByPart(imgMap);
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [level, topic]);

  // ================== CURRENT PART ==================
  const questions = questionsByPart[currentPart] || [];
  const imagesPool = imagesByPart[currentPart] || [];

  // ================== RESET PART ==================
  const resetPart = useCallback(() => {
    if (!questions.length) {
      setRemainingIndexes([]);
      setCurrentIndex(0);
      setAnswerStatus({});
      setAnsweredCorrectly([]);
      setIsDone(false);
      setIsPracticeMode(false);
      setHasCelebrated(false);
      return;
    }

    const idxs = shuffle(questions.map((_, i) => i));
    setRemainingIndexes(idxs);
    setCurrentIndex(0);
    setAnswerStatus({});
    setAnsweredCorrectly([]);
    setIsDone(false);
    setHasCelebrated(false);
    setIsPracticeMode(false);
    setIsFirstQuestion(true);
  }, [questions]);

  useEffect(() => {
    resetPart();
  }, [currentPart, questions.length, resetPart]);

  // ================== CURRENT QUESTION ==================
  const currentQuestionIndex = remainingIndexes[currentIndex] ?? 0;
  const currentQuestion = questions[currentQuestionIndex];

  // ================== IMAGE GRID ==================
  const allImages = useMemo(
    () => imagesPool.map((q) => q.imageLink).filter(Boolean),
    [imagesPool]
  );

  const shuffledImages = useMemo(() => shuffle(allImages), [currentQuestionIndex, allImages]);

  // ================== PLAY AUDIO ==================
  const playAudio = useCallback(() => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
    if (isFirstQuestion) setIsFirstQuestion(false);
  }, [currentQuestion, isFirstQuestion]);

  useEffect(() => {
    if (!currentQuestion || isFirstQuestion) return;
    playAudio();
  }, [currentQuestionIndex]);

  // ================== POPUP ==================
  const openPopup = useCallback((data) => {
    setPopupData(data);
    setShowPopup(true);
  }, []);

  const closePopup = () => setShowPopup(false);

  // ================== CLICK IMAGE ==================
  const handleImageClick = useCallback(
    (imgSrc) => {
      if (!currentQuestion) return;

      const isCorrect = imgSrc === currentQuestion.imageLink;

      setAnswerStatus((p) => ({ ...p, [currentQuestionIndex]: isCorrect ? "correct" : "wrong" }));

      if (isCorrect) {
        setAnsweredCorrectly((p) => (p.includes(currentQuestionIndex) ? p : [...p, currentQuestionIndex]));
      }

      openPopup({
        isCorrect,
        image: currentQuestion.imageLink,
        script: currentQuestion.script,
        ipa: currentQuestion.ipa || "",
      });
    },
    [currentQuestion, currentQuestionIndex, openPopup]
  );

  // ----------------- AUTO NEXT WHEN WRONG -----------------
  useEffect(() => {
    if (!showPopup || popupData.isCorrect !== false) return;
    const t = setTimeout(() => goNext(), 1200);
    return () => clearTimeout(t);
  }, [showPopup, popupData.isCorrect]);

  // ----------------- NEXT LOGIC -----------------
  const goNext = useCallback(() => {
    closePopup();

    const remaining = remainingIndexes.filter((i) => !answeredCorrectly.includes(i));

    if (remaining.length === 0) {
      setIsDone(true);
      return;
    }

    const nextList = shuffle(remaining);
    setRemainingIndexes(nextList);
    setCurrentIndex(0);
  }, [remainingIndexes, answeredCorrectly]);

  // ================== CELEBRATION ==================
  useEffect(() => {
    if (!isDone || hasCelebrated) return;

    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });

    try {
      if (!celebrationRef.current)
        celebrationRef.current = new Audio("/sounds/celebration.mp3");

      celebrationRef.current.currentTime = 0;
      celebrationRef.current.play().catch(() => {});
    } catch {}

    setHasCelebrated(true);
  }, [isDone, hasCelebrated]);

  // ================== PRACTICE ==================
  const enablePractice = () => {
    setIsPracticeMode(true);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsDone(false);
    setHasCelebrated(false);
    setRemainingIndexes(questions.map((_, i) => i));
    setCurrentIndex(0);
  };

  // ================== PART NAV ==================
  const goToNextPart = () => {
    const idx = PARTS.indexOf(currentPart);
    if (idx < 0 || idx >= PARTS.length - 1) return;
    setCurrentPart(PARTS[idx + 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const externalTabClass = useCallback(
    (idx) => {
      const s = answerStatus[idx];
      const isActive = remainingIndexes[currentIndex] === idx;
      return ["question", s === "correct" ? "correct" : "", s === "wrong" ? "wrong" : "", isActive ? "active" : ""]
        .join(" ")
        .trim();
    },
    [answerStatus, remainingIndexes, currentIndex]
  );

  // ================== RENDER ==================
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const hasData = questions.length > 0;

  return (
    <div className="listen-click">
      <Title type="click" lesson={topic} instruction="Klikkaa oikeaa kuvaa" />

      {/* PART NAV */}
      <div className="parts-nav">
        {PARTS.map((p) => (
          <button
            key={p}
            className={currentPart === p ? "active" : ""}
            onClick={() => setCurrentPart(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {hasData ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>

          {/* TABS */}
          <div className="questions">
            {questions.map((_, i) => (
              <div
                key={i}
                className={externalTabClass(i)}
                style={{ cursor: isPracticeMode ? "pointer" : "default" }}
                onClick={() => {
                  if (!isPracticeMode) return;
                  setCurrentIndex(remainingIndexes.indexOf(i));
                }}
              >
                {answerStatus[i] === "correct" ? "✔" : String(i + 1).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* IMAGES */}
          <div className="images-grid">
            {shuffledImages.map((img, i) => {
              const isCorrectImg = img === currentQuestion?.imageLink;
              const cls =
                answerStatus[currentQuestionIndex] === "correct" && isCorrectImg
                  ? "correct"
                  : "";
              return (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => handleImageClick(img)}
                  className={cls}
                  loading="lazy"
                />
              );
            })}
          </div>

          {/* CONTROLS */}
          <div className="controls">
            <button onClick={playAudio}>Start</button>
            <button onClick={playAudio}>Listen Again</button>
          </div>

          <audio ref={audioRef} />
        </div>
      ) : (
        <div className="no-data">No data found for {currentPart}</div>
      )}

      {/* POPUP */}
      {showPopup && (
        <AnswerPopup
          isCorrect={popupData.isCorrect}
          image={popupData.image}
          script={popupData.script}
          ipa={popupData.ipa}
          onClose={popupData.isCorrect ? goNext : closePopup}
        />
      )}

      {/* DONE PANEL */}
      {isDone && (
        <div className="answer-popup">
          <div className="popup-card correct">
            <span className="popup-icon">🎉</span>
            <p className="popup-word">Hyvä!</p>
            <p className="popup-message success">Olet suorittanut tämän osan.</p>
            <p className="popup-ipa">Great job – keep it up!</p>

            <div className="popup-buttons">
              <button onClick={() => { setIsDone(false); enablePractice(); }}>
                Yritä uudelleen
              </button>

              <button onClick={() => { setIsDone(false); goToNextPart(); }}>
                Seuraava osa →
              </button>
            </div>
          </div>
        </div>
      )}

      {isPracticeMode && !isDone && (
        <div className="practice-again-wrapper">
          <button onClick={enablePractice}>🔁 Harjoittele uudelleen</button>
        </div>
      )}
    </div>
  );
};

export default ListenAndClick;
