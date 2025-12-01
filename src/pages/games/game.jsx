import { useState } from "react";
import { Icon } from "@iconify/react";
import pyramidiLogo from "../../assets/pyramid.svg";
import PyramidiUnactive from "../../assets/pyramid-unactive.svg";
import Sanapyramidi from "./Sanapyramidi";
import "./game.css";

const Game = () => {
  const [activeSection, setActiveSection] = useState("arvaa"); // Track active section

  return (
    <div className="game-page">
      <div className="game-nav-bar">
        <div
          className={`game-section ${activeSection === "arvaa" ? "active" : ""}`}
          onClick={() => setActiveSection("arvaa")}
        >
          <Icon icon="fluent:hat-graduation-24-filled" width="24" height="24" />
          <h1>Arvaa sana!</h1>
        </div>

        <div
          className={`game-section ${activeSection === "pyramidi" ? "active" : ""}`}
          onClick={() => setActiveSection("pyramidi")}
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
      
      <h2 className="game-instruction">Löydä yhdistävä tekijäpyramidin eri kerrosten sanoille</h2>
    </div>
    
  );
};

export default Game;
