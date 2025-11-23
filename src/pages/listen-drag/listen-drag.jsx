import React from "react";
import { useParams } from "react-router-dom";

import Title from "../../components/listening-title/listening-title";
import GameEmbed from "../../components/gamelinks/GameEmbed";

import "../../components/gamelinks/game-embed.css";
import "./listen-drag.css";

const ListenAndDrag = () => {
  const { level, topic } = useParams();
  const lessonLabel = topic ? decodeURIComponent(topic) : "kotisanasto";

  return (
    <div className="listen-drag-page">

      {/* --- PHẦN TIÊU ĐỀ ĐỨNG RIÊNG --- */}
      <Title
        type="drag"
        lesson={lessonLabel}
        instruction="Kuuntele seuraava keskustelu"
      />

      {/* --- KHUNG TRẮNG BAO TRỌN GAME (GIỐNG LISTEN & CLICK) --- */}
      <div className="listen-drag-card">
        <GameEmbed projectId="1235043346" />
      </div>

    </div>
  );
};

export default ListenAndDrag;
