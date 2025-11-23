import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Title from "../../components/listening-title/title";
import AnswerPopup from "../../components/AnswerPopup/AnswerPopup";
import confetti from "canvas-confetti";
import "./listen-click.css";

const PARTS = ["part1", "part2", "part3"];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const ListenAndClick = () => {
  // Route: /listening/:level/:type/:topic
  const { level, type: paramType, topic: paramName } = useParams();
  const location = useLocation();
  const incomingState = location.state || {};

  // ===== Lesson info (type + tên bài) =====
  const [lessonInfo, setLessonInfo] = useState({
    type: incomingState.type || paramType || "",
    lessonName: incomingState.lessonName || paramName || "",
  });

  // ===== Dữ liệu câu hỏi theo part =====
  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== Logic dạng module 1 =====
  const [remainingIndexes, setRemainingIndexes] = useState([]); // index các câu còn lại
  const [currentIndex, setCurrentIndex] = useState(0); // con trỏ trong remainingIndexes
  const [questionChangeKey, setQuestionChangeKey] = useState(0); // trigger re-shuffle images
  const [shuffledImages, setShuffledImages] = useState([]); // lưới ảnh hiện tại

  const [answerStatus, setAnswerStatus] = useState({}); // { [idx]: 'correct' | 'wrong' }
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]); // list index đã đúng
  const [isDone, setIsDone] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // ===== Popup =====
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    isCorrect: false,
    image: "",
    script: "",
    ipa: "",
  });

  // ===== Audio =====
  const audioRef = useRef(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  // ===== Celebration =====
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const celebrationRef = useRef(null);

  // ===== Name từ URL nếu không có state =====
  const name =
    paramName ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).at(-1)
      : "");

  // ================== FETCH LESSON INFO ==================
  useEffect(() => {
    // nếu đã có info từ state thì không fetch nữa
    if (lessonInfo.type && lessonInfo.lessonName) return;
    if (!level || !paramType) return;

    const fetchLessonInfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/listening/${level}/${paramType}`
        );
        const data = await res.json();

        const matchedLesson = data?.result?.find(
          (lesson) =>
            lesson.lessonName?.toLowerCase() === name?.toLowerCase()
        );

        if (matchedLesson) {
          setLessonInfo({
            type: matchedLesson.type,
            lessonName: matchedLesson.lessonName,
          });
        } else {
          setLessonInfo({
            type: paramType,
            lessonName: name,
          });
        }
      } catch (err) {
        console.error("Error fetching lesson info:", err);
        setLessonInfo({
          type: paramType || "",
          lessonName: name || "",
        });
      }
    };

    fetchLessonInfo();
  }, [level, paramType, name, lessonInfo.type, lessonInfo.lessonName]);

  // ================== FETCH ALL PARTS ==================
  useEffect(() => {
    const fetchAllParts = async () => {
      if (!level || !paramType || !name) {
        setError("Invalid URL: missing level, type, or topic.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const qByPart = {};
      const imgByPart = {};

      try {
        for (const part of PARTS) {
          const url = `http://localhost:3000/listening/${level}/${paramType}/${name}/${part}`;
          const res = await fetch(url);
          if (!res.ok) continue;

          const data = await res.json();
          const partData = data?.result?.[part];
          if (!partData) continue;

          // Object -> array items { audioLink, script, imageLink, ipa? }
          const allItems = Object.values(partData);

          // shuffle thứ tự câu, và pool ảnh
          qByPart[part] = shuffle(allItems); // thứ tự hỏi
          imgByPart[part] = shuffle(allItems); // kho ảnh để trộn lưới
        }

        setQuestionsByPart(qByPart);
        setImagesByPart(imgByPart);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllParts();
  }, [level, paramType, name]);

  // ================== DERIVED CHO PART HIỆN TẠI ==================
  const questions = questionsByPart[currentPart] || [];
  const imagePool = imagesByPart[currentPart] || [];

  // Khi đổi part hoặc dữ liệu part thay đổi → reset state
  useEffect(() => {
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

    const idxs = questions.map((_, idx) => idx);
    setRemainingIndexes(shuffle(idxs));
    setCurrentIndex(0);
    setIsDone(false);
    setIsPracticeMode(false);
    setAnswerStatus({});
    setAnsweredCorrectly([]);
    setQuestionChangeKey(0); // không auto play câu đầu
    setIsFirstQuestion(true);
    setHasCelebrated(false);
  }, [currentPart, questions.length]);

  // Câu hiện tại
  const currentQuestionIndex = remainingIndexes.length
    ? remainingIndexes[currentIndex]
    : 0;
  const currentQuestion = questions[currentQuestionIndex];

  // Pool ảnh
  const allImages = useMemo(
    () => imagePool.map((q) => q.imageLink).filter(Boolean),
    [imagePool]
  );

  // Mỗi lần đổi câu → trộn lại lưới hình
  useEffect(() => {
    if (!allImages.length) return;
    setShuffledImages(shuffle(allImages));
  }, [questionChangeKey, allImages]);

  // Auto play khi đổi câu (trừ lần đầu)
  useEffect(() => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    if (questionChangeKey === 0 && isFirstQuestion) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
  }, [questionChangeKey, currentQuestion, isFirstQuestion]);

  const playAudio = () => {
    if (!currentQuestion?.audioLink || !audioRef.current) return;
    audioRef.current.src = currentQuestion.audioLink;
    audioRef.current.play().catch(() => {});
    if (isFirstQuestion) setIsFirstQuestion(false);
  };

  // ================== POPUP HELPERS ==================
  const openPopup = ({ isCorrect, image, script, ipa }) => {
    setPopupData({ isCorrect, image, script, ipa });
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  // ================== HANDLE CLICK ẢNH ==================
  const handleImageClick = (imgSrc) => {
    if (!currentQuestion) return;

    const correct = imgSrc === currentQuestion.imageLink;

    setAnswerStatus((prev) => ({
      ...prev,
      [currentQuestionIndex]: correct ? "correct" : "wrong",
    }));

    if (correct) {
      setAnsweredCorrectly((prev) =>
        prev.includes(currentQuestionIndex)
          ? prev
          : [...prev, currentQuestionIndex]
      );
    }

    openPopup({
      isCorrect: correct,
      image: currentQuestion.imageLink,
      script: currentQuestion.script,
      ipa: currentQuestion.ipa || "",
    });
  };

  // Sai → auto next sau 1.2s
  useEffect(() => {
    if (!showPopup || popupData.isCorrect !== false) return;
    const t = setTimeout(() => {
      goNextAfterCorrect();
    }, 1200);
    return () => clearTimeout(t);
  }, [showPopup, popupData.isCorrect]);

  // Đúng → bấm Jatka hoặc auto next gọi hàm này
  const goNextAfterCorrect = () => {
    closePopup();

    // loại những câu đã đúng khỏi remaining
    const remaining = remainingIndexes.filter(
      (idx) => !answeredCorrectly.includes(idx)
    );

    if (remaining.length === 0) {
      setIsDone(true);
      return;
    }

    const shuffled = shuffle(remaining);
    setRemainingIndexes(shuffled);
    setCurrentIndex(0);
    setQuestionChangeKey((k) => k + 1);
  };

  // ================== CELEBRATION ==================
  useEffect(() => {
    if (!isDone || hasCelebrated) return;

    // 🎉 pháo hoa
    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });

    // 🔊 âm thanh ăn mừng (file nên để ở /public/sounds/celebration.mp3)
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

  // ================== PART / PRACTICE MODE ==================
  const partsNavDisabled = loading || !questionsByPart[currentPart];

  const externalTabClass = (idx) => {
    const ans = answerStatus[idx]; // 'correct' | 'wrong' | undefined
    const isActive = remainingIndexes[currentIndex] === idx;
    return [
      "question",
      ans === "correct" ? "correct" : "",
      ans === "wrong" ? "wrong" : "",
      isActive ? "active" : "",
    ]
      .join(" ")
      .trim();
  };

  const onTabClickPractice = (idx) => {
    if (!isPracticeMode) return;
    const pos = remainingIndexes.indexOf(idx);
    if (pos !== -1) {
      setCurrentIndex(pos);
      setQuestionChangeKey((k) => k + 1);
    }
  };

  const handleResetPractice = () => {
    setIsPracticeMode(true);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsDone(false);
    setHasCelebrated(false);
    const idxs = questions.map((_, i) => i);
    setRemainingIndexes(idxs);
    setCurrentIndex(0);
    setQuestionChangeKey((k) => k + 1);
  };

  const handlePartChange = (part) => {
    setCurrentPart(part);
  };

  const getNextPart = (curr, list) => {
    const i = list.indexOf(curr);
    return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  };

  const goToNextPart = () => {
    const next = getNextPart(currentPart, PARTS);
    if (!next) {
      console.warn("No next part.");
      return;
    }
    setIsDone(false);
    setShowPopup(false);
    setIsPracticeMode(false);
    setAnsweredCorrectly([]);
    setAnswerStatus({});
    setIsFirstQuestion(true);
    setHasCelebrated(false);
    handlePartChange(next);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ================== UI TEXT ==================
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const hasData = !!questions.length;
  const titleText = lessonInfo.lessonName || name;

  const instructionText =
    lessonInfo.type === "click"
      ? "Klikkaa oikeaa kuvaa"
      : lessonInfo.type === "drag"
      ? "Vedä sana oikeaan paikkaan"
      : "Kuuntele keskustelu ja valitse vastaus";

  // ================== RENDER ==================
  return (
    <div className="listen-click">
      <Title
        type={lessonInfo.type}
        lesson={titleText}
        instruction={instructionText}
      />

      {/* Navigation giữa các part */}
      <div className="parts-nav">
        {PARTS.map((part) => (
          <button
            key={part}
            className={currentPart === part ? "active" : ""}
            onClick={() => handlePartChange(part)}
            disabled={partsNavDisabled && !questionsByPart[part]}
          >
            {part}
          </button>
        ))}
      </div>

      {hasData ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>

          {/* Tabs trạng thái câu */}
          <div className="questions">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={externalTabClass(idx)}
                onClick={() => onTabClickPractice(idx)}
                style={{ cursor: isPracticeMode ? "pointer" : "default" }}
              >
                {answerStatus[idx] === "correct"
                  ? "✔"
                  : String(idx + 1).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* Lưới hình ảnh */}
          <div className="images-grid">
            {shuffledImages.map((img, idx) => {
              const isCurrentAnswer = img === currentQuestion?.imageLink;
              const imgCls =
                answerStatus[currentQuestionIndex] === "correct" &&
                isCurrentAnswer
                  ? "correct"
                  : "";
              return (
                <img
                  key={idx}
                  src={img}
                  alt={`option-${idx}`}
                  className={imgCls}
                  onClick={() => handleImageClick(img)}
                  loading="lazy"
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="controls">
            <button onClick={playAudio}>Start</button>
            <button onClick={playAudio}>Listen Again</button>
          </div>

          <audio ref={audioRef} />
        </div>
      ) : (
        <div className="no-data">No data found for {currentPart}</div>
      )}

      {/* Popup đúng/sai */}
      {showPopup && (
        <AnswerPopup
          isCorrect={popupData.isCorrect}
          image={popupData.image}
          script={popupData.script}
          ipa={popupData.ipa}
          onClose={popupData.isCorrect ? goNextAfterCorrect : closePopup}
        />
      )}

      {/* Final popup khi hoàn thành part */}
      {isDone && (
        <div className="answer-popup">
          <div className="popup-card correct">
            <span className="popup-icon">🎉</span>
            <p className="popup-word">Hyvä!</p>
            <p className="popup-message success">
              Olet suorittanut tämän osan.
            </p>
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
                  handleResetPractice();
                }}
              >
                Yritä uudelleen
              </button>

              <button
                className="popup-button"
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

      {/* Nút luyện lại khi đang ở practice mode */}
      {!isDone && isPracticeMode && (
        <div className="practice-again-wrapper">
          <button className="popup-button" onClick={handleResetPractice}>
            🔁 Harjoittele uudelleen
          </button>
        </div>
      )}
    </div>
  );
};

export default ListenAndClick;
