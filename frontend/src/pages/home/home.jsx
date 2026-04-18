import './home.css';
import {Icon} from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
  return (
    <div className="home-container">
		  <div className='left-column'>
      	<p className="home-text bold">E-COURSE PLATFORM</p>
      	<h1 className="home-title">
      	<span className='highlight'>Explore </span>Your
      	<br />
      	Language
      	<br />
      	Journey</h1>
      	<p className="home-text">Learn Finnish by playing!</p>

				<div className='sections-container'>
					<div className='section-gr'>
						<Icon className='home-icon' icon="fa6-solid:headphones" />
						<p className="home-text dela">Listening</p>
						<button className="learn-more-button" onClick={() => navigate('/listening')}>Learn more →</button>
					</div>
					<div className='section-gr'>
						<Icon className='home-icon' icon="famicons:game-controller" />
						<p className="home-text dela">Game</p>
						<button className="learn-more-button" onClick={() => navigate('/game')}>Learn more →</button>
					</div>
				</div>
			</div>		
			<img src="src/assets/LAB1.png" alt="Home" className="image-style" />
		</div>	
  );
};

export default Home;
