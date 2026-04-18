import React from "react";
import { useNavigate } from "react-router-dom";
import "./sanapyramidiItem.css"; 

const SanapyramidiItem = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = (lessonId) => {
    if (!lessonId) return;
    navigate(`/game/sanapyramidi/${lessonId}`);
  };

  return (
    <div className="sanapyramidi-list">
      {data.map((item, index) => (
        <div
          key={item.lessonId}
          className="sanapyramidi-topic"
          onClick={() => handleClick(item.lessonId)}
        >
          <span className="topic-index">{index + 1}.</span>
          <span className="topic-name">{item.lessonName}</span>
        </div>
      ))}
    </div>
  );
};

export default SanapyramidiItem;
