import './nav-bar.css';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom'; 
import labLogo from "../../assets/lab-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img src={labLogo} alt="Logo" />
      <ul className="nav-links">
        <li tabIndex={0} role="button" onClick={() => navigate('/')}>
          <Icon icon="material-symbols:home-rounded" width="25" height="25" />
          <span>Home</span>
        </li>
        <li tabIndex={0} role="button" onClick={() => navigate('/listening')}>
          <Icon icon="fa6-solid:headphones" width="25" height="25" />
          <span>Listening</span>
        </li>
        <li tabIndex={0} role="button" onClick={() => navigate('/game')}>
          <Icon icon="famicons:game-controller" width="25" height="25" />
          <span>Game</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
