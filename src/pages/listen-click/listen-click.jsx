import { useState, useEffect, useRef } from 'react'; 
import { useParams } from 'react-router-dom';
import Title from '../../components/listening-title/listening-title';
import './listen-click.css';

const ListenAndClick = () => {
  const { level, topic } = useParams(); 
  const paramType = 'click'; 

  const [questionsByPart, setQuestionsByPart] = useState({});
  const [imagesByPart, setImagesByPart] = useState({});
  const [answersByPart, setAnswersByPart] = useState({});
  const [currentPart, setCurrentPart] = useState('part1');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const parts = ['part1', 'part2', 'part3'];

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllParts = async () => {
      if (!level || !topic) {
        setError('Invalid URL: missing level or topic.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      const newQuestionsByPart = {};
      const newImagesByPart = {};
      const newAnswersByPart = {};

      try {
        for (const part of parts) {
          const url = `http://localhost:3000/listening/${level}/${paramType}/${topic}/${part}`;
          const res = await fetch(url);
          if (!res.ok) continue;

          const data = await res.json();
          const partData = data?.result?.[part];
          if (!partData) continue;

          const allItems = Object.values(partData);
          const shuffledAudios = shuffle(allItems);
          const shuffledImages = shuffle(allItems);

          newQuestionsByPart[part] = shuffledAudios;
          newImagesByPart[part] = shuffledImages;
          newAnswersByPart[part] = Array(shuffledAudios.length).fill(null);
        }

        setQuestionsByPart(newQuestionsByPart);
        setImagesByPart(newImagesByPart);
        setAnswersByPart(newAnswersByPart);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load lesson data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllParts();
  }, [level, paramType, topic]);

  const questions = questionsByPart[currentPart] || [];
  const images = imagesByPart[currentPart] || [];
  const answers = answersByPart[currentPart] || [];

  const playAudio = (index) => {
    if (!questions[index] || !audioRef.current) return;
    audioRef.current.src = questions[index].audioLink;
    audioRef.current.play().catch(() => {});
  };

  const handleAnswer = (clickedScript) => {
    const correctScript = questions[currentQuestion].script;
    const isCorrect = clickedScript === correctScript;

    const updated = [...answers];
    updated[currentQuestion] = isCorrect;

    setAnswersByPart((prev) => ({
      ...prev,
      [currentPart]: updated,
    }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        playAudio(currentQuestion + 1);
      }, 600);
    }
  };

  const titleText = topic;
  const instructionText = 'Klikkaa oikeaa kuvaa';

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listen-click">
      <Title type={paramType} lesson={titleText} instruction={instructionText} />

      <div className="parts-nav">
        {parts.map((part) => (
          <button
            key={part}
            className={currentPart === part ? 'active' : ''}
            onClick={() => {
              setCurrentPart(part);
              setCurrentQuestion(0);
            }}
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
                  ans === true ? 'correct' : ans === false ? 'wrong' : ''
                }`}
              >
                {ans === true ? '✔' : ans === false ? '✖' : idx + 1}
              </div>
            ))}
          </div>

          <div className="images-grid">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.imageLink}
                alt={img.script}
                onClick={() => handleAnswer(img.script)}
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
    </div>
  );
};

export default ListenAndClick;
