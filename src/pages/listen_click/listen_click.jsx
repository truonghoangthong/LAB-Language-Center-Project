import './listen_click.css';
import { Icon } from '@iconify/react';
import SubNavBar from '../../components/sub-nav-bar/sub-nav-bar';
import { useState } from 'react';

const ListenAndClick = () => {
  const [activeBox, setActiveBox] = useState(null);

  const boxes = [
    {
      icon: 'fluent:speaker-2-24-filled',
      title: 'Listen and Click',
      topics: [
        { id: 1, name: 'Kotisanasto 1' },
        { id: 2, name: 'Kotisanasto 2' },
      ],
    },
    {
      icon: 'fluent:hand-left-28-filled',
      title: 'Listen and Drag',
      topics: [
        { id: 1, name: 'Verbit 1' },
        { id: 2, name: 'Verbit 2' },
      ],
    },
    {
      icon: 'fluent:chat-bubbles-question-24-filled',
      title: 'Listen and Dialog',
      topics: [
        { id: 1, name: 'Keskustelu A' },
        { id: 2, name: 'Keskustelu B' },
      ],
    },
  ];

  const handleBoxClick = (index) => {
    setActiveBox(activeBox === index ? null : index);
  };

  return (
    <div className="listen-click">
      <div className="title-row">
        <Icon icon="famicons:book" width="30" height="30" />
        <h1 className="section-title">Listening section</h1>
      </div>

      <SubNavBar />

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
                {box.topics.map((topic) => (
                  <div key={topic.id} className="topic-item">
                    <span className="topic-label">
                      {topic.id}. {topic.name}
                    </span>
                    <button className="start-btn">Start</button>
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
