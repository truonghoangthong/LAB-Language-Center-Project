import { useState, useEffect } from "react"; 
import "./game.css";
import React from 'react';
import tutorIcon from "../../assets/tutor.png";
import sanapyramidi from "../../assets/sanapyramidi.png";
import axios from 'axios';
import TutorItem from "./TutorItem/TutorItem";
import SanapyramidiItem from "./SanapyramidiItem/SanapyramidiItem";
import TutorBoard from "./TutorBoard/TutorBoard";



const Game = () => {
    const [active, setActive] = useState("tutor");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const handleLessonSelect = (item) => {
        setSelectedLesson(item);
    };
    useEffect(() => {
        if (!active) return;
        setLoading(true);
        setError(null);
        axios.get(`http://localhost:3000/game/${active}`)
        .then(response => {
            setData(response.data.result);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError("Tietojen hakeminen epäonnistui.");
            setLoading(false);
        });
    }, [active]);
    return (
        <div className="game-container">
            <div className="game-icon">
                <div className={`tutor-game ${active === "tutor" ? "active" : ""}`} onClick={() => { setActive("tutor"); setSelectedLesson(null); }}>

                    <img src={tutorIcon} alt="" className="tutor-icon" />
                    <h1>Arvaa sana!</h1>
                </div>
                <div className={`sanapyramidi-game ${active === "sanapyramidi" ? "active" : ""}`} onClick={() => setActive("sanapyramidi")}>
                    <img src={sanapyramidi} alt="" className="sanapyramidi-icon" />
                    <h1>Sanapyramidi</h1>
                </div>
                {console.log(data)}
            </div>
            <div className="text-introduction">
                <h1>Harjoittele sanastoa hauskassa sanaselityspelissä!</h1>
            </div>
            {loading && <div className="loading">Ladataan...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && !selectedLesson && (active === "tutor" ? <TutorItem data={data} onLessonSelect={handleLessonSelect} /> : <SanapyramidiItem data={data} />)}
            {selectedLesson && (active === "tutor" ? <TutorBoard lesson={selectedLesson} characterImage={selectedLesson.imageLink} /> : null)}
        </div>
    );
};

export default Game;