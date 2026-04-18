import React from 'react';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import "./TutorBoard.css";

const TutorBoard = ({ lesson, characterImage }) => {
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [messages, setMessages] = useState([]);  
    const audioRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        axios.get(`http://localhost:3000/game/tutor/${lesson.lessonId}`)
            .then(response => {
                setLessonData(response.data.result);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching lesson data:", error);
                setLoading(false);
            });
    }, [lesson.lessonId]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    useEffect(() => {
        if (lessonData && lessonData.part1 && messages.length === 0) {
            const questionsArray = Object.entries(lessonData.part1).map(([key, value]) => ({
                id: key,
                ...value
            }));
            
            setMessages([{
                type: 'question',
                text: questionsArray[0].script,
                audioLink: questionsArray[0].audioLink,
                questionIndex: 0
            }]);
        }
    }, [lessonData]);
    
    if (loading) {
        return <div className="loading">Ladataan...</div>;
    }
    
    if (!lessonData || !lessonData.part1) {
        return <div className="error">Ei dataa.</div>;
    }
    
    const questionsArray = Object.entries(lessonData.part1).map(([key, value]) => ({
        id: key,
        ...value
    }));
    
    const currentQuestion = questionsArray[currentQuestionIndex];
    
    const playAudio = (audioUrl) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!userAnswer.trim()) return;
        
        const correctAnswers = currentQuestion.answer.toLowerCase().split('/').map(a => a.trim());
        const userAnswerLower = userAnswer.toLowerCase().trim();
        const correct = correctAnswers.includes(userAnswerLower);
        
        const newMessages = [...messages, {
            type: 'answer',
            text: userAnswer,
            isCorrect: correct,
            correctAnswer: currentQuestion.answer,
            answerAudioLink: currentQuestion.answerAudioLink,
            questionIndex: currentQuestionIndex
        }];
        
        setMessages(newMessages);
        setUserAnswer("");
        
        if (correct) {
            if (currentQuestionIndex < questionsArray.length - 1) {
                setTimeout(() => {
                    const nextIndex = currentQuestionIndex + 1;
                    const nextQuestion = questionsArray[nextIndex];
                    
                    setMessages(prev => [...prev, {
                        type: 'question',
                        text: nextQuestion.script,
                        audioLink: nextQuestion.audioLink,
                        questionIndex: nextIndex
                    }]);
                    
                    setCurrentQuestionIndex(nextIndex);
                }, 1500);
            }
        }
    };
    
    const isCompleted = currentQuestionIndex === questionsArray.length - 1 &&
                        messages.some(m => m.questionIndex === currentQuestionIndex && m.isCorrect);
    
    return (
        <div className="tutor-board">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="character-info">
                        <img src={characterImage} alt={lesson.character} className="character-avatar" />
                        <div className="character-details">
                            <h3>{lesson.character}</h3>
                            <p className="category">{lesson.lessonName}</p>
                        </div>
                    </div>
                    <button 
                        className="audio-btn-header"
                        onClick={() => playAudio(currentQuestion.audioLink)}
                    >
                        🔊
                    </button>
                </div>
                
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        msg.type === 'question' ? (
                            <div key={index} className="message-row">
                                <img src={characterImage} alt={lesson.character} className="message-avatar" />
                                <div 
                                    className="message-bubble question-bubble"
                                    onClick={() => playAudio(msg.audioLink)}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="message-row user-message-row">
                                <div 
                                    className={`message-bubble user-bubble ${msg.isCorrect ? 'correct' : 'incorrect'}`}
                                    onClick={() => msg.isCorrect && playAudio(msg.answerAudioLink)}
                                >
                                    {msg.text}
                                    {msg.isCorrect && <span className="check-mark"> ✓</span>}
                                </div>
                            </div>
                        )
                    ))}
                    
                    {messages.length > 0 && 
                     messages[messages.length - 1].type === 'answer' &&
                     messages[messages.length - 1].isCorrect && 
                     !isCompleted && (
                        <div className="message-row">
                            <img src={characterImage} alt={lesson.character} className="message-avatar" />
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    
                    {isCompleted && (
                        <div className="completion-message">
                            🎉 Kaikki kysymykset suoritettu!
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="chat-input-area">
                    <form onSubmit={handleSubmit} className="input-form">
                        <input
                            type="text"
                            placeholder="Write your message"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="message-input"
                            disabled={isCompleted}
                        />
                        <button 
                            type="submit" 
                            className="send-btn"
                            disabled={!userAnswer.trim() || isCompleted}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TutorBoard;