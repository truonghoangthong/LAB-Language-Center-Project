import './nav-bar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">MyApp</h2>
      <ul className="nav-links">
        <li>Home</li>
        <li>About</li>
      </ul>
    </nav>
  );
};

export default Navbar;
