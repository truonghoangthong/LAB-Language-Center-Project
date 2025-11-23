import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/listening-title";
import AnswerPopup from "../../components/AnswerPopup/AnswerPopup";
import confetti from "canvas-confetti";
import "./listen-click.css";

const PARTS = ["part1", "part2", "part3"];
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const ListenAndClick = () => {
  const { level, topic } = useParams();

  const [lessonInfo] = useState({
    type: "click",
    lessonName: topic || "",
  });

  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [answersByPart, setAnswersByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    isCorrect: false,
    image: "",
    script: "",
    ipa: "",
  });
  const [isDone, setIsDone] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const audioRef = useRef(null);
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

      const newQuestionsByPart = {};
      const newImagesByPart = {};
      const newAnswersByPart = {};

      try {
        for (const part of PARTS) {
          const url = `http://localhost:3000/listening/${level}/click/${topic}/${part}`;
          const res = await fetch(url);
          if (!res.ok) continue;

          const data = await res.json();
          const partData = data?.result?.[part];
          if (!partData) continue;

          const allItems = Object.values(partData);
          newQuestionsByPart[part] = shuffle(allItems);
          newImagesByPart[part] = shuffle(allItems);
          newAnswersByPart[part] = Array(allItems.length).fill(null);
        }
        setQuestionsByPart(newQuestionsByPart);
        setImagesByPart(newImagesByPart);
        setAnswersByPart(newAnswersByPart);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllParts();
  }, [level, topic]);

  const questions = questionsByPart[currentPart] || [];
  const images = imagesByPart[currentPart] || [];
  const answers = answersByPart[currentPart] || [];

  const playAudio = (index) => {
    if (!questions[index] || !audioRef.current) return;
    audioRef.current.src = questions[index].audioLink;
    audioRef.current.play().catch(() => {});
  };

  const handleAnswer = (clickedScript) => {
    if (!questions[currentQuestion]) return;

    const isCorrect = clickedScript === questions[currentQuestion].script;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = isCorrect;

    setAnswersByPart((prev) => ({
      ...prev,
      [currentPart]: updatedAnswers,
    }));

    setPopupData({
      isCorrect,
      image: questions[currentQuestion].imageLink,
      script: questions[currentQuestion].script,
      ipa: questions[currentQuestion].ipa || "",
    });
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const goNextAfterCorrect = () => {
    closePopup();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      playAudio(currentQuestion + 1);
    } else {
      setIsDone(true);
    }
  };

  useEffect(() => {
    if (!isDone || hasCelebrated) return;

    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });
    try {
      if (!celebrationRef.current) {
        celebrationRef.current = new Audio("/sounds/celebration.mp3");
      }
      celebrationRef.current.currentTime = 0;
      celebrationRef.current.play().catch(() => {});
    } catch (e) {
      console.warn("celebration sound error:", e);
    }
    setHasCelebrated(true);
  }, [isDone, hasCelebrated]);

  const handlePartChange = (part) => {
    setCurrentPart(part);
    setCurrentQuestion(0);
    setIsDone(false);
    setHasCelebrated(false);
    setShowPopup(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listen-click">
      <Title
        type={lessonInfo.type}
        lesson={lessonInfo.lessonName}
        instruction={
          lessonInfo.type === "click"
            ? "Klikkaa oikeaa kuvaa"
            : lessonInfo.type === "drag"
            ? "Vedä sana oikeaan paikkaan"
            : "Kuuntele keskustelu ja valitse vastaus"
        }
      />

      <div className="parts-nav">
        {PARTS.map((part) => (
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

      {questions.length > 0 ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>

          <div className="questions">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`question ${
                  ans === true ? "correct" : ans === false ? "wrong" : ""
                } ${currentQuestion === idx ? "active" : ""}`}
              >
                {ans === true ? "✔" : ans === false ? "✖" : idx + 1}
              </div>
            ))}
          </div>

          <div className="images-grid">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.imageLink}
                alt={img.script}
                className={
                  answers[currentQuestion] == null
                    ? ""
                    : img.script === questions[currentQuestion].script
                    ? answers[currentQuestion]
                      ? "correct"
                      : "wrong"
                    : ""
                }
                onClick={() => handleAnswer(img.script)}
                loading="lazy"
              />
            ))}
          </div>

          <div className="controls">
            <button onClick={() => playAudio(currentQuestion)}>Start</button>
            <button onClick={() => playAudio(currentQuestion)}>Listen Again</button>
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
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              <button
                className="popup-button popup-button-secondary"
                onClick={() => {
                  setIsDone(false);
                  setCurrentQuestion(0);
                  setAnswersByPart((prev) => ({
                    ...prev,
                    [currentPart]: Array(questions.length).fill(null),
                  }));
                  setHasCelebrated(false);
                }}
              >
                Yritä uudelleen
              </button>

              <button
                className="popup-button"
                onClick={() => {
                  const nextIndex = PARTS.indexOf(currentPart) + 1;
                  if (nextIndex < PARTS.length) {
                    handlePartChange(PARTS[nextIndex]);
                  }
                }}
              >
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
