// in progress
import './sub-nav-bar.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SubNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [buttons, setButtons] = useState(['Test', 'Button 2', 'Button 3']);

  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    if (pathname.includes('/listening')) {
      setButtons(['Finnish 1', 
                  'Finnish 2', 
                  'Finnish 3', 
                  'Finnish 4', 
                  'Finnish for work']);
    } else if (pathname.includes('/game')) {
      setButtons(['sanapyramidi', 
                  'arvaa sana!']);
    }
  }, []);

  return (
    <div className="sub-nav-bar">
      {buttons.map((label, idx) => (
        <button key={idx} className="sub-nav-bar-button">
          <div className="button-index">{idx + 1}</div>
          <div className="button-label">{label}</div>
        </button>
      ))}
    </div>
  );
};

export default SubNavBar;