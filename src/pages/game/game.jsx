import { useState, useEffect } from "react"; 
import { Icon } from "@iconify/react";
import pyramidiLogo from "../../assets/pyramid.svg";
import PyramidiUnactive from "../../assets/pyramid-unactive.svg";
import SanapyramidiItem from "./SanapyramidiItem/SanapyramidiItem";
import axios from 'axios';
import TutorItem from "./TutorItem/TutorItem";
import TutorBoard from "./TutorBoard/TutorBoard";
import Sanapyramidi from "./Sanapyramidi";
import "./game.css";

const Game = () => {
  const [activeSection, setActiveSection] = useState("arvaa"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonSelect = (item) => {
    setSelectedLesson(item);
  };

  useEffect(() => {
    if (!activeSection) return;
    setLoading(true);
    setError(null);

    const endpoint = activeSection === "arvaa" ? "tutor" : "pyramidi";

    axios.get(`http://localhost:3000/game/${endpoint}`)
      .then((response) => {
        setData(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Tietojen hakeminen epäonnistui.");
        setLoading(false);
      });
  }, [activeSection]);

  return (
    <div className="game-page">
      <div className="game-nav-bar">
        <div
          className={`game-section ${activeSection === "arvaa" ? "active" : ""}`}
          onClick={() => { setActiveSection("arvaa"); setSelectedLesson(null); }}
        >
          <Icon icon="fluent:hat-graduation-24-filled" width="24" height="24" />
          <h1>Arvaa sana!</h1>
        </div>

        <div
          className={`game-section ${activeSection === "pyramidi" ? "active" : ""}`}
          onClick={() => { setActiveSection("pyramidi"); setSelectedLesson(null); }}
        >
          <img
            src={activeSection === "pyramidi" ? pyramidiLogo : PyramidiUnactive}
            alt="Pyramidi Logo"
            width={24}
            height={24}
          />
          <h1>Sanapyramidi</h1>
        </div>
      </div>

      <h2 className="game-instruction">
        {activeSection === "arvaa" 
          ? "Harjoittele sanastoa hauskassa sanaselityspelissä!" 
          : "Löydä yhdistävä tekijäpyramidin eri kerrosten sanoille"}
      </h2>

      {loading && <div className="loading">Ladataan...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && !selectedLesson && (
        activeSection === "arvaa"
          ? <TutorItem data={data} onLessonSelect={handleLessonSelect} />
          : <SanapyramidiItem data={data} />
      )}

      {selectedLesson && activeSection === "arvaa" && (
        <TutorBoard lesson={selectedLesson} characterImage={selectedLesson.imageLink} />
      )}
      {selectedLesson && activeSection === "pyramidi" && (
        <Sanapyramidi />
      )}
    </div>
  );
};

export default Game;