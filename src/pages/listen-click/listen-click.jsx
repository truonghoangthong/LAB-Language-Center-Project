import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/title";
import "./listen-click.css";

const ListenAndClick = () => {
  const { level, type, name: paramName } = useParams();
  const [questionsByPart, setQuestionsByPart] = useState({});
  const [answersByPart, setAnswersByPart] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const parts = ["part1", "part2", "part3"];

  const name =
    paramName ||
    (() => {
      const segments = window.location.pathname.split("/").filter(Boolean);
      return segments.at(-1); // phần cuối URL
    })();

  console.log("useParams values:", { level, type, paramName });
  console.log("Resolved name from URL:", name);

  useEffect(() => {
    const fetchAllParts = async () => {
      if (!level || !type || !name) {
        console.error("Invalid URL: missing level, type, or name.", {
          level,
          type,
          name,
        });
        setError("Invalid URL: missing level, type, or name.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const newQuestionsByPart = {};
      const newAnswersByPart = {};

      try {
        for (const part of parts) {
          const url = `http://localhost:3000/listening/${level}/${type}/${name}/${part}`;
          console.log("Fetching:", url);

          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`Part ${part} not found`);
            continue;
          }

          const data = await res.json();
          const partData = data?.result?.[part];
          if (!partData) {
            console.warn(`Invalid data structure for ${part}`);
            continue;
          }

          const questionArr = Object.values(partData);
          newQuestionsByPart[part] = questionArr;
          newAnswersByPart[part] = Array(questionArr.length).fill(null);
        }

        setQuestionsByPart(newQuestionsByPart);
        setAnswersByPart(newAnswersByPart);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllParts();
  }, [level, type, name]);

  const questions = questionsByPart[currentPart] || [];
  const answers = answersByPart[currentPart] || [];
  const hasData = questions.length > 0;

  const playAudio = (index) => {
    if (!questions[index] || !audioRef.current) return;
    const { audioLink } = questions[index];
    audioRef.current.src = audioLink;
    audioRef.current.play().catch((err) => console.warn("Audio error:", err));
  };

  const handleAnswer = (clickedScript) => {
    if (!questions[currentQuestion]) return;

    const isCorrect = clickedScript === questions[currentQuestion].script;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = isCorrect;

    setAnswersByPart((prev) => ({ ...prev, [currentPart]: updatedAnswers }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        playAudio(currentQuestion + 1);
      }, 600);
    }
  };

  const handlePartChange = (part) => {
    setCurrentPart(part);
    setCurrentQuestion(0);
  };

  // -------------------- Render --------------------
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listen-click">
      <Title />

      {/* Part navigation */}
      <div className="parts-nav">
        {parts.map((part) => (
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

      {hasData ? (
        <div className="part active">
          <div className="part-label">{currentPart}</div>

          {/* Question indicators */}
          <div className="questions">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`question ${
                  ans === true ? "correct" : ans === false ? "wrong" : ""
                }`}
              >
                {ans === true ? "✔" : ans === false ? "✖" : idx + 1}
              </div>
            ))}
          </div>

          {/* Image grid */}
          <div className="images-grid">
            {questions.map((q, idx) => (
              <img
                key={idx}
                src={q.imageLink}
                alt={q.script}
                className={idx === currentQuestion ? "active" : ""}
                onClick={() =>
                  idx === currentQuestion && handleAnswer(q.script)
                }
              />
            ))}
          </div>

          {/* Audio controls */}
          <div className="controls">
            <button onClick={() => playAudio(currentQuestion)}>Start</button>
            <button onClick={() => playAudio(currentQuestion)}>
              Listen Again
            </button>
          </div>

          <audio ref={audioRef} />
        </div>
      ) : (
        <div className="no-data">No data found for {currentPart}</div>
      )}
    </div>
  );
};

export default ListenAndClick;
