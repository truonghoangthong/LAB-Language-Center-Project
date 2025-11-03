import './nav-bar.css';
import { Icon } from '@iconify/react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src="src/assets/lab-logo.png" alt="Logo" />
      <ul className="nav-links">
        <li>
          <Icon icon="material-symbols:home-rounded" width="28" height="28" />
          <span>Home</span>
        </li>
        <li>
          <Icon icon="fa6-solid:headphones" width="28" height="28" />
          <span>Listening</span>
        </li>
        <li>
          <Icon icon="famicons:game-controller" width="28" height="28" />
          <span>Game</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;