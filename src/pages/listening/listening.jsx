import './listening.css';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const ListenAndClick = () => {
  const [activeBox, setActiveBox] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('finnish_1'); 
  const [topics, setTopics] = useState({});
  const navigate = useNavigate(); 

  const boxes = [
    { icon: 'fluent:speaker-2-24-filled', title: 'Listen and Click', type: 'click' },
    { icon: 'fluent:hand-left-28-filled', title: 'Listen and Drag', type: 'drag' },
    { icon: 'fluent:chat-bubbles-question-24-filled', title: 'Listen and Dialog', type: 'dialogues' },
  ];

  const levels = [
    'finnish_1',
    'finnish_2', 
    'finnish_3',
    'finnish_4',
    'finnish_for_work',
  ];

  const fetchTopics = async (level, type) => {
    try {
      const res = await fetch(`http://localhost:3000/listening/${level}/${type}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setTopics(prev => ({ ...prev, [`${level}_${type}`]: data.result }));
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setTopics(prev => ({ ...prev, [`${level}_${type}`]: [] })); 
    }
  };

  const handleBoxClick = (index) => {
    const box = boxes[index];
    const key = `${selectedLevel}_${box.type}`;
    if (!topics[key]) {
      fetchTopics(selectedLevel, box.type);
    }
    setActiveBox(activeBox === index ? null : index);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setActiveBox(null); 
  };

  const handleStart = (topicName, boxType) => {
    const path = `/listening/${selectedLevel}/${boxType}/${topicName.toLowerCase().replace(/\s+/g, '')}`;
    navigate(path);
  };

  const getDisplayName = (label) => {
    if (label === 'finnish_for_work') return 'Finnish for Work';
    return label.replace('finnish_', 'Finnish ').toUpperCase();
  };

  const getCurrentTopics = (boxType) => {
    return topics[`${selectedLevel}_${boxType}`] || [];
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
                  index < 2 ? 'green' : index < 4 ? 'yellow' : 'red'
                }`}
              >
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="boxes-container">
        {boxes.map((box, index) => {
          const currentTopics = getCurrentTopics(box.type);
          const noTopics = currentTopics.length === 0;

          return (
            <div
              key={index}
              className={`box ${activeBox === index ? 'active' : ''}`}
              onClick={() => !noTopics && handleBoxClick(index)}
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

              {noTopics && <div className="no-topic-box">There is no topic</div>}

              <div className={`topic-wrapper ${activeBox === index ? 'show' : ''}`}>
                <div className="topic-list">
                  {currentTopics.map((topic, i) => (
                    <div key={i} className="topic-item">
                      <span className="topic-label">
                        {i + 1}. {topic.lessonName}
                      </span>
                      <button
                        className="start-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(topic.lessonName, box.type);
                        }}
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListenAndClick;
