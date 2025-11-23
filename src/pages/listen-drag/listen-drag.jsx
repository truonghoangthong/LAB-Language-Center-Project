import React from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/listening-title/title";
import GameEmbed from "../../components/gamelinks/GameEmbed"; // bước 0 nếu bạn chưa tạo thì tạo y chang như đã hướng dẫn
import "../../components/gamelinks/game-embed.css";
import "./listen-drag.css";


const ListenAndDrag = () => {
  // Dùng param để đồng bộ hiển thị (level/topic nếu cần)
  const { level, topic } = useParams();

  // Bạn có thể map topic thành chữ đẹp nếu muốn
  const lessonLabel = topic ? decodeURIComponent(topic) : "Kotisanasto 1";

  return (
    <div className="listen-drag-page">
      <Title
        type="drag"
        lesson={lessonLabel}
        instruction="Kuuntele seuraava keskustelu"
      />

      {/* 1 game duy nhất */}
      <GameEmbed projectId="1235043346" />
      {/*
        Hoặc:
        <GameEmbed src="https://scratch.mit.edu/projects/1235043346/embed" />
      */}
    </div>
  );
};

export default ListenAndDrag;
