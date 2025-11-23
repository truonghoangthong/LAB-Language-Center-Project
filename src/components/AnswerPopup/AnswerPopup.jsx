import React, { useEffect } from "react";
import "./answer-popup.css";

/**
 * Dùng chung cho Module 1, 2... Backward-compatible với phiên bản cũ.
 */
const AnswerPopup = ({
  isCorrect,
  image,
  script,
  ipa,
  onClose,

  // --- optional / mở rộng ---
  autoCloseWrongMs = 1200,
  nextLabel = "Jatka →",
  onReplay,                 // nếu muốn hiện nút Replay trong popup đúng
  showTabs = false,         // nếu muốn render dãy tab trạng thái
  tabs = [],                // ["idle"|"active"|"correct"|"wrong"]
  onPracticeAgain,          // hiện nút luyện lại khi hoàn tất
}) => {
  // Auto close khi sai (giữ như module 1)
  useEffect(() => {
    if (!isCorrect && autoCloseWrongMs > 0) {
      const timeout = setTimeout(() => {
        onClose?.();
      }, autoCloseWrongMs);
      return () => clearTimeout(timeout);
    }
  }, [isCorrect, autoCloseWrongMs, onClose]);

  const renderTabs = () => {
    if (!showTabs || !tabs?.length) return null;
    return (
      <div className="question-tabs" aria-label="question progress">
        {tabs.map((state, idx) => {
          const n = (idx + 1).toString().padStart(2, "0");
          const cls =
            state === "correct"
              ? "tab correct"
              : state === "wrong"
              ? "tab wrong"
              : state === "active"
              ? "tab active"
              : "tab";
          return (
            <div key={idx} className={cls}>
              {n}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="answer-popup" role="dialog" aria-modal="true">
      <div className={`popup-card ${isCorrect ? "correct" : "wrong"}`}>
        <div className="popup-header">
          <span className="popup-icon" aria-hidden>
            {isCorrect ? "🎉" : "❌"}
          </span>
        </div>

        {isCorrect ? (
          <>
            <p className="popup-message success">
              <span style={{ color: "#4CAF50" }}>✔</span> Oikein! Hienoa työtä{" "}
              <span className="popup-celebrate"></span>
            </p>

            {image && (
              <img
                src={image}
                alt={script || "Answer image"}
                className="popup-image"
                loading="lazy"
              />
            )}

            {script && <p className="popup-word">{script}</p>}
            {ipa && <p className="popup-ipa">{ipa}</p>}

            {/* nút Replay tùy chọn */}
            {typeof onReplay === "function" && (
              <button
                type="button"
                className="popup-button popup-button-secondary"
                onClick={onReplay}
              >
                Kuuntele uudelleen
              </button>
            )}

            {/* nút Next/Jatka */}
            <button type="button" className="popup-button" onClick={onClose}>
              {nextLabel}
            </button>

            {/* khu vực luyện lại sau khi hoàn tất (tuỳ chọn) */}
            {typeof onPracticeAgain === "function" && (
              <div className="practice-again-wrapper">
                <button
                  type="button"
                  className="popup-button"
                  onClick={onPracticeAgain}
                >
                  Harjoittele uudelleen
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="popup-message fail" role="alert">
            Väärin, yritä uudelleen
          </p>
        )}

        {/* dãy tab trạng thái (tuỳ chọn) */}
        {renderTabs()}
      </div>
    </div>
  );
};

export default AnswerPopup;
