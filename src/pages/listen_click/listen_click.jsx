import './listen_click.css';
import { Icon } from '@iconify/react';
import SubNavBar from '../../components/sub-nav-bar/sub-nav-bar';
import { useState } from 'react';

const ListenAndClick = () => {
  const [activeBox, setActiveBox] = useState(null);

  const boxes = [
    {
      icon: 'fluent:speaker-2-24-filled',
      title: 'Listen and Click'
    },
    {
      icon: 'fluent:hand-left-28-filled',
      title: 'Listen and Drag'
    },
    {
      icon: 'fluent:chat-bubbles-question-24-filled',
      title: 'Listen and Dialog'
    }
  ];

  const handleBoxClick = (index) => {
    setActiveBox(index);
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
            <h3 className="box-title">{box.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListenAndClick;