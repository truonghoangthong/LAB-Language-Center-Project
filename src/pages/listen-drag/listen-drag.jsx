import React from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/listening-title";
import GameEmbed from "../../components/gamelinks/GameEmbed"; 
import "../../components/gamelinks/game-embed.css";
import "./listen-drag.css";


const ListenAndDrag = () => {
  const { level, topic } = useParams();

  const lessonLabel = topic ? decodeURIComponent(topic) : "Kotisanasto 1";

  return (
    <div className="listen-drag-page">
      <Title
        type="drag"
        lesson={lessonLabel}
        instruction="Kuuntele seuraava keskustelu"
      />

      <GameEmbed projectId="1235043346" />
      {/*
        Hoặc:
        <GameEmbed src="https://scratch.mit.edu/projects/1235043346/embed" />
      */}
    </div>
  );
};

export default ListenAndDrag;
