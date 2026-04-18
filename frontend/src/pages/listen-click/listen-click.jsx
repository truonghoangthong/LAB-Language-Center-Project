import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";

import Title from "../../components/listening-title/listening-title";
import AnswerPopup from "../../components/AnswerPopup/AnswerPopup";
import "./listen-click.css";

// CONSTANTS & UTILITIES
const PARTS = ["part1", "part2", "part3"];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// MAIN COMPONENT
const ListenAndClick = () => {
  const { level, topic } = useParams();

  // STATE: Data Loading
  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // STATE: Gameplay
  const [remainingIndexes, setRemainingIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  // STATE: Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    isCorrect: false,
    image: "",
    script: "",
    ipa: "",
  });

  // REFS
  const audioRef = useRef(null);
  const celebrationRef = useRef(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // DERIVED STATE
  const questions = questionsByPart[currentPart] || [];
  const imagesPool = imagesByPart[currentPart] || [];
  const currentQuestionIndex = remainingIndexes[currentIndex] ?? 0;
  const currentQuestion = questions[currentQuestionIndex];

  const allImages = useMemo(
    () => imagesPool.map((q) => q.imageLink).filter(Boolean),
    [imagesPool]
  );

  const shuffledImages = useMemo(
    () => shuffle(allImages),
    [currentQuestionIndex, allImages]
  );


  // EFFECT: Fetch all parts data
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

          const items = shuffle(Object.values(raw));
          qMap[part] = items;
          imgMap[part] = shuffle(items);
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

  // EFFECT: Reset part when changed
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

  // EFFECT: Auto-play audio when question changes
  const playAudio = useCallback(() => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
    if (isFirstQuestion) setIsFirstQuestion(false);
  }, [currentQuestion, isFirstQuestion]);

  useEffect(() => {
    if (!currentQuestion || isFirstQuestion) return;
    playAudio();
  }, [currentQuestionIndex, currentQuestion, isFirstQuestion, playAudio]);

  // EFFECT: Auto-advance after wrong answer
  useEffect(() => {
    if (!showPopup || popupData.isCorrect !== false) return;
    const timeout = setTimeout(() => goNext(), 1200);
    return () => clearTimeout(timeout);
  }, [showPopup, popupData.isCorrect]);

  // EFFECT: Celebration when completed
  useEffect(() => {
    if (!isDone || hasCelebrated) return;

    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });

    try {
      if (!celebrationRef.current) {
        celebrationRef.current = new Audio("/sounds/celebration.mp3");
      }
      celebrationRef.current.currentTime = 0;
      celebrationRef.current.play().catch(() => {});
    } catch {}

    setHasCelebrated(true);
  }, [isDone, hasCelebrated]);

  // HANDLER: Image click
  const handleImageClick = useCallback(
    (imgSrc) => {
      if (!currentQuestion) return;

      const isCorrect = imgSrc === currentQuestion.imageLink;

      setAnswerStatus((prev) => ({
        ...prev,
        [currentQuestionIndex]: isCorrect ? "correct" : "wrong",
      }));

      if (isCorrect) {
        setAnsweredCorrectly((prev) =>
          prev.includes(currentQuestionIndex)
            ? prev
            : [...prev, currentQuestionIndex]
        );
      }

      openPopup({
        isCorrect,
        image: currentQuestion.imageLink,
        script: currentQuestion.script,
        ipa: currentQuestion.ipa || "",
      });
    },
    [currentQuestion, currentQuestionIndex]
  );

  // HANDLER: Popup controls
  const openPopup = useCallback((data) => {
    setPopupData(data);
    setShowPopup(true);
  }, []);

  const closePopup = () => setShowPopup(false);

  // HANDLER: Navigation
  const goNext = useCallback(() => {
    closePopup();

    const remaining = remainingIndexes.filter(
      (i) => !answeredCorrectly.includes(i)
    );

    if (remaining.length === 0) {
      setIsDone(true);
      return;
    }

    const nextList = shuffle(remaining);
    setRemainingIndexes(nextList);
    setCurrentIndex(0);
  }, [remainingIndexes, answeredCorrectly]);

  const goToNextPart = () => {
    const idx = PARTS.indexOf(currentPart);
    if (idx < 0 || idx >= PARTS.length - 1) return;
    setCurrentPart(PARTS[idx + 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // HANDLER: Practice mode
  const enablePractice = () => {
    setIsPracticeMode(true);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsDone(false);
    setHasCelebrated(false);
    setRemainingIndexes(questions.map((_, i) => i));
    setCurrentIndex(0);
  };

  // HELPER: Tab styling
  const getTabClassName = useCallback(
    (idx) => {
      const status = answerStatus[idx];
      const isActive = remainingIndexes[currentIndex] === idx;

      return [
        "question",
        status === "correct" ? "correct" : "",
        status === "wrong" ? "wrong" : "",
        isActive ? "active" : "",
      ]
        .join(" ")
        .trim();
    },
    [answerStatus, remainingIndexes, currentIndex]
  );

  // RENDER
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const hasData = questions.length > 0;

  return (
    <div className="listen-click">
      {/* Header */}
      <Title
        type="click"
        lesson={topic}
        instruction="Klikkaa oikeaa kuvaa"
      />

      {/* Part Navigation */}
      <div className="parts-nav">
        {PARTS.map((part) => (
          <button
            key={part}
            className={currentPart === part ? "active" : ""}
            onClick={() => setCurrentPart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {hasData ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>

          {/* Question Tabs */}
          <div className="questions">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={getTabClassName(idx)}
                style={{ cursor: isPracticeMode ? "pointer" : "default" }}
                onClick={() => {
                  if (!isPracticeMode) return;
                  setCurrentIndex(remainingIndexes.indexOf(idx));
                }}
              >
                {answerStatus[idx] === "correct"
                  ? "✔"
                  : String(idx + 1).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* Image Grid */}
          <div className="images-grid">
            {shuffledImages.map((img, idx) => {
              const isCorrectImg = img === currentQuestion?.imageLink;
              const className =
                answerStatus[currentQuestionIndex] === "correct" && isCorrectImg
                  ? "correct"
                  : "";

              return (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  onClick={() => handleImageClick(img)}
                  className={className}
                  loading="lazy"
                />
              );
            })}
          </div>

          {/* Audio Controls */}
          <div className="controls">
            <button onClick={playAudio}>Start</button>
            <button onClick={playAudio}>Listen Again</button>
          </div>

          <audio ref={audioRef} />
        </div>
      ) : (
        <div className="no-data">No data found for {currentPart}</div>
      )}

      {/* Answer Popup */}
      {showPopup && (
        <AnswerPopup
          isCorrect={popupData.isCorrect}
          image={popupData.image}
          script={popupData.script}
          ipa={popupData.ipa}
          onClose={popupData.isCorrect ? goNext : closePopup}
        />
      )}

      {/* Completion Popup */}
      {isDone && (
        <div className="answer-popup">
          <div className="popup-card correct">
            <span className="popup-icon">🎉</span>
            <p className="popup-word">Hyvä!</p>
            <p className="popup-message success">
              Olet suorittanut tämän osan.
            </p>
            <p className="popup-ipa">Great job – keep it up!</p>

            <div className="popup-buttons">
              <button
                onClick={() => {
                  setIsDone(false);
                  enablePractice();
                }}
              >
                Yritä uudelleen
              </button>

              <button
                onClick={() => {
                  setIsDone(false);
                  goToNextPart();
                }}
              >
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