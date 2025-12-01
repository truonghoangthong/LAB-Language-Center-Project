import React from "react";
import { useNavigate } from "react-router-dom";

const SanapyramidiItem = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = (topic) => {
    if (!topic) return;
    const formattedTopic = topic.toLowerCase().replace(/\s+/g, "_");
    navigate(`/game/sanapyramidi/${formattedTopic}`);
  };

  return (
    <div className="sanapyramidi-list">
      {data.map((item) => (
        <div
          key={item.lessonId} // dùng lessonId làm key
          className="sanapyramidi-topic"
          onClick={() => handleClick(item.lessonName)}
        >
          {item.lessonName}
        </div>
      ))}
    </div>
  );
};

export default SanapyramidiItem;
