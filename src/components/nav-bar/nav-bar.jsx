import './nav-bar.css';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img src="src/assets/lab-logo.png" alt="Logo" />
      <ul className="nav-links">
        <li
          tabIndex={0}
          role="button"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Icon icon="material-symbols:home-rounded" width="25" height="25" />
          <span>Home</span>
        </li>
        <li
          tabIndex={0}
          role="button"
          onClick={() => navigate('/listening')}
          style={{ cursor: 'pointer' }}
        >
          <Icon icon="fa6-solid:headphones" width="25" height="25" />
          <span>Listening</span>
        </li>
        <li
          tabIndex={0}
          role="button"
          onClick={() => navigate('/game')}
          style={{ cursor: 'pointer' }}
        >
          <Icon icon="famicons:game-controller" width="25" height="25" />
          <span>Game</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
