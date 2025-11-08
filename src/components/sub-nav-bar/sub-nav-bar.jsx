import './sub-nav-bar.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [buttons, setButtons] = useState([]);
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    const { pathname } = window.location;

    if (pathname.includes('/listening')) {
      setButtons([
        'Finnish 1',
        'Finnish 2',
        'Finnish 3',
        'Finnish 4',
        'Finnish for Work',
      ]);
    } else if (pathname.includes('/game')) {
      setButtons(['Sanapyramidi', 'Arvaa sana!']);
    } else {
      setButtons(['Test', 'Button 2', 'Button 3']);
    }
  }, [location.pathname]);

  const handleButtonClick = (label) => {
    setActiveButton(label);
  };

  return (
    <div className="sub-nav-bar">
      {buttons.map((label, index) => (
        <button
          key={label}
          className={activeButton === label ? 'active' : ''}
          onClick={() => handleButtonClick(label)}
        >
          <div className="button-content">
            <span className="button-label">{label}</span>
            {location.pathname.includes('/listening') && (
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
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SubNavBar;
