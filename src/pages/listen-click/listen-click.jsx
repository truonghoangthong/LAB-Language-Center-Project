import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/listening-title";
import AnswerPopup from "../../components/AnswerPopup/AnswerPopup";
import confetti from "canvas-confetti";
import "./listen-click.css";

const PARTS = ["part1", "part2", "part3"];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const ListenAndClick = () => {
  const { level, topic } = useParams();

  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [remainingIndexes, setRemainingIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionChangeKey, setQuestionChangeKey] = useState(0);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [answerStatus, setAnswerStatus] = useState({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ isCorrect: false, image: "", script: "", ipa: "" });

  const audioRef = useRef(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const celebrationRef = useRef(null);

  useEffect(() => {
    const fetchAllParts = async () => {
      if (!level || !topic) {
        setError("Invalid URL: missing level or topic.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      const qByPart = {};
      const imgByPart = {};
      try {
        for (const part of PARTS) {
          const url = `http://localhost:3000/listening/${level}/click/${topic}/${part}`;
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          const partData = data?.result?.[part];
          if (!partData) continue;
          const allItems = Object.values(partData);
          qByPart[part] = shuffle(allItems);
          imgByPart[part] = shuffle(allItems);
        }
        setQuestionsByPart(qByPart);
        setImagesByPart(imgByPart);
      } catch {
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllParts();
  }, [level, topic]);

  const questions = questionsByPart[currentPart] || [];
  const imagePool = imagesByPart[currentPart] || [];

  useEffect(() => {
    if (!questions.length) {
      setRemainingIndexes([]);
      setAnswerStatus({});
      setAnsweredCorrectly([]);
      setIsDone(false);
      setIsPracticeMode(false);
      setHasCelebrated(false);
      return;
    }
    setRemainingIndexes(shuffle(questions.map((_, idx) => idx)));
    setCurrentIndex(0);
    setAnswerStatus({});
    setAnsweredCorrectly([]);
    setIsDone(false);
    setIsFirstQuestion(true);
    setHasCelebrated(false);
    setQuestionChangeKey(0);
  }, [currentPart, questions.length]);

  const currentQuestionIndex = remainingIndexes[currentIndex] ?? 0;
  const currentQuestion = questions[currentQuestionIndex];

  const allImages = useMemo(() => imagePool.map(q => q.imageLink).filter(Boolean), [imagePool]);

  useEffect(() => {
    if (allImages.length) setShuffledImages(shuffle(allImages));
  }, [questionChangeKey, allImages]);

  const playAudio = () => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
    if (isFirstQuestion) setIsFirstQuestion(false);
  };

  useEffect(() => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    if (questionChangeKey === 0 && isFirstQuestion) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
  }, [questionChangeKey, currentQuestion, isFirstQuestion]);

  const openPopup = ({ isCorrect, image, script, ipa }) => {
    setPopupData({ isCorrect, image, script, ipa });
    setShowPopup(true);
  };
  const closePopup = () => setShowPopup(false);

  const handleImageClick = (imgSrc) => {
    if (!currentQuestion) return;
    const correct = imgSrc === currentQuestion.imageLink;
    setAnswerStatus(prev => ({ ...prev, [currentQuestionIndex]: correct ? "correct" : "wrong" }));
    if (correct) {
      setAnsweredCorrectly(prev => (prev.includes(currentQuestionIndex) ? prev : [...prev, currentQuestionIndex]));
    }
    openPopup({ isCorrect: correct, image: currentQuestion.imageLink, script: currentQuestion.script, ipa: currentQuestion.ipa || "" });
  };

  useEffect(() => {
    if (!showPopup || popupData.isCorrect) return;
    const t = setTimeout(() => goNextAfterCorrect(), 1200);
    return () => clearTimeout(t);
  }, [showPopup, popupData.isCorrect]);

  const goNextAfterCorrect = () => {
    closePopup();
    const remaining = remainingIndexes.filter(idx => !answeredCorrectly.includes(idx));
    if (remaining.length === 0) {
      setIsDone(true);
      return;
    }
    setRemainingIndexes(shuffle(remaining));
    setCurrentIndex(0);
    setQuestionChangeKey(k => k + 1);
  };

  useEffect(() => {
    if (!isDone || hasCelebrated) return;
    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });
    try {
      if (!celebrationRef.current) celebrationRef.current = new Audio("/sounds/celebration.mp3");
      celebrationRef.current.currentTime = 0;
      celebrationRef.current.play().catch(() => {});
    } catch {}
    setHasCelebrated(true);
  }, [isDone, hasCelebrated]);

  const handleResetPractice = () => {
    setIsPracticeMode(true);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsDone(false);
    setHasCelebrated(false);
    setRemainingIndexes(questions.map((_, i) => i));
    setCurrentIndex(0);
    setQuestionChangeKey(k => k + 1);
  };

  const handlePartChange = (part) => setCurrentPart(part);

  const goToNextPart = () => {
    const i = PARTS.indexOf(currentPart);
    const next = i >= 0 && i < PARTS.length - 1 ? PARTS[i + 1] : null;
    if (!next) return;
    setIsDone(false);
    setShowPopup(false);
    setIsPracticeMode(false);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsFirstQuestion(true);
    setHasCelebrated(false);
    handlePartChange(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const questionsExist = !!questions.length;
  const instructionText = "Klikkaa oikeaa kuvaa";

  return (
    <div className="listen-click">
      <Title type="click" lesson={topic} instruction={instructionText} />
      <div className="parts-nav">
        {PARTS.map(part => (
          <button
            key={part}
            className={currentPart === part ? "active" : ""}
            onClick={() => handlePartChange(part)}
            disabled={!questionsByPart[part]}
          >
            {part}
          </button>
        ))}
      </div>
      {questionsExist ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>
          <div className="images-grid">
            {shuffledImages.map((img, idx) => (
              <img key={idx} src={img} alt={`option-${idx}`} onClick={() => handleImageClick(img)} loading="lazy" />
            ))}
          </div>
          <div className="controls">
            <button onClick={playAudio}>Start</button>
            <button onClick={playAudio}>Listen Again</button>
          </div>
          <audio ref={audioRef} />
        </div>
      ) : (
        <div className="no-data">No data found for {currentPart}</div>
      )}
      {showPopup && (
        <AnswerPopup
          isCorrect={popupData.isCorrect}
          image={popupData.image}
          script={popupData.script}
          ipa={popupData.ipa}
          onClose={popupData.isCorrect ? goNextAfterCorrect : closePopup}
        />
      )}
      {isDone && (
        <div className="answer-popup">
          <div className="popup-card correct">
            <span className="popup-icon">🎉</span>
            <p className="popup-word">Hyvä!</p>
            <p className="popup-message success">Olet suorittanut tämän osan.</p>
            <p className="popup-ipa">Great job – keep it up!</p>
            <div className="popup-buttons">
              <button className="popup-button popup-button-secondary" onClick={handleResetPractice}>
                Yritä uudelleen
              </button>
              <button className="popup-button" onClick={goToNextPart}>
                Seuraava osa →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListenAndClick;
