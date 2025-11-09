import './listening.css';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const ListenAndClick = () => {
  const [activeBox, setActiveBox] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('finnish1'); 
  const navigate = useNavigate(); 

  const levelData = {
    finnish1: {
      click: [
        { id: 1, name: 'Kotisanasto 1' },
        { id: 2, name: 'Kotisanasto 2' },
      ],
      drag: [
        { id: 1, name: 'Verbit 1' },
        { id: 2, name: 'Verbit 2' },
      ],
      dialog: [
        { id: 1, name: 'Keskustelu A' },
        { id: 2, name: 'Keskustelu B' },
      ],
    },
    finnish2: {
      click: [
        { id: 1, name: 'Advanced Vocabulary 1' },
        { id: 2, name: 'Advanced Vocabulary 2' },
      ],
      drag: [
        { id: 1, name: 'Complex Verbs 1' },
        { id: 2, name: 'Complex Verbs 2' },
      ],
      dialog: [
        { id: 1, name: 'Business Dialog' },
        { id: 2, name: 'Social Dialog' },
      ],
    },
    finnish3: {
      click: [
        { id: 1, name: 'Professional Terms 1' },
        { id: 2, name: 'Professional Terms 2' },
      ],
      drag: [
        { id: 1, name: 'Advanced Verbs 1' },
        { id: 2, name: 'Advanced Verbs 2' },
      ],
      dialog: [
        { id: 1, name: 'Formal Discussion' },
        { id: 2, name: 'Interview Practice' },
      ],
    },
    finnish4: {
      click: [
        { id: 1, name: 'Expert Vocabulary 1' },
        { id: 2, name: 'Expert Vocabulary 2' },
      ],
      drag: [
        { id: 1, name: 'Master Verbs 1' },
        { id: 2, name: 'Master Verbs 2' },
      ],
      dialog: [
        { id: 1, name: 'Academic Discussion' },
        { id: 2, name: 'Debate Practice' },
      ],
    },
    finnishforwork: {
      click: [
        { id: 1, name: 'Workplace Terms 1' },
        { id: 2, name: 'Workplace Terms 2' },
      ],
      drag: [
        { id: 1, name: 'Professional Verbs' },
        { id: 2, name: 'Business Phrases' },
      ],
      dialog: [
        { id: 1, name: 'Meeting Practice' },
        { id: 2, name: 'Client Conversation' },
      ],
    },
  };

  const boxes = [
    {
      icon: 'fluent:speaker-2-24-filled',
      title: 'Listen and Click',
      type: 'click',
    },
    {
      icon: 'fluent:hand-left-28-filled',
      title: 'Listen and Drag',
      type: 'drag',
    },
    {
      icon: 'fluent:chat-bubbles-question-24-filled',
      title: 'Listen and Dialog',
      type: 'dialog',
    },
  ];

  const levels = [
    'finnish1',
    'finnish2', 
    'finnish3',
    'finnish4',
    'finnishforwork',
  ];

  const handleBoxClick = (index) => {
    setActiveBox(activeBox === index ? null : index);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleStart = (boxType, topicName) => {
    const path = `/listening/${selectedLevel}/${boxType}/${topicName.toLowerCase().replace(/\s+/g, '')}`;
    navigate(path);
  };

  const getDisplayName = (label) => {
    if (label === 'finnishforwork') return 'Finnish for Work';
    return label.replace('finnish', 'Finnish ').toUpperCase();
  };

  const getCurrentTopics = (boxType) => {
    return levelData[selectedLevel]?.[boxType] || [];
  };

  return (
    <div className="listening">
      <div className="title-row">
        <Icon icon="famicons:book" width="30" height="30" />
        <h1 className="section-title">Listening section</h1>
      </div>

      <div className="sub-nav-bar">
        {levels.map((level, index) => (
          <button
            key={level}
            className={selectedLevel === level ? 'active' : ''}
            onClick={() => handleLevelClick(level)}
          >
            <div className="button-content">
              <span className="button-label">{getDisplayName(level)}</span>
              <span
                className={`button-index ${
                  index < 2
                    ? 'green'
                    : index < 4
                    ? 'yellow'
                    : 'red'
                }`}
              >
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="boxes-container">
        {boxes.map((box, index) => (
          <div
            key={index}
            className={`box ${activeBox === index ? 'active' : ''}`}
            onClick={() => handleBoxClick(index)}
          >
            <div className="icon-container">
              <Icon icon={box.icon} width="30" height="30" className="icon" />
            </div>

            <h3 className="box-title">
              Listen and{' '}
              <span
                className={
                  box.title.includes('Click')
                    ? 'click-text'
                    : box.title.includes('Drag')
                    ? 'drag-text'
                    : 'dialog-text'
                }
              >
                {box.title.split(' ')[2]}
              </span>
            </h3>

            <div
              className={`topic-wrapper ${
                activeBox === index ? 'show' : ''
              }`}
            >
              <div className="topic-list">
                {getCurrentTopics(box.type).map((topic) => (
                  <div key={topic.id} className="topic-item">
                    <span className="topic-label">
                      {topic.id}. {topic.name}
                    </span>
                    <button
                      className="start-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleStart(box.type, topic.name);
                      }}
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListenAndClick;