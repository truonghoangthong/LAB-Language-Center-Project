import React from "react";
import "./listening-title.css";

const Title = ({ type, lesson, instruction }) => {
  if (!type) {
    console.error("[Title] 'type' prop is required");
    return null;
  }

  const formatLesson = (text) => {
    if (!text) return "";
    const withSpaces = text.replace(/_/g, " ");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  };

  const taskType = type.toLowerCase();

  const renderTask = () => {
    switch (taskType) {
      case "click":
        return (
          <>
            Listen and <span className="title-highlight-click">Click</span>
          </>
        );
      case "drag":
        return (
          <>
            Listen and <span className="title-highlight-drag">Drag</span>
          </>
        );
      case "dialog":
        return (
          <>
            Listen and <span className="title-highlight-dialog">Dialogues</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="title-wrapper" role="group" aria-label="Task title">
      <h2 className="title-task">{renderTask()}</h2>
      <h2 className="title-lesson">{formatLesson(lesson)}</h2>
      <p className="title-instruction">{instruction}</p>
    </div>
  );
};

export default Title;
