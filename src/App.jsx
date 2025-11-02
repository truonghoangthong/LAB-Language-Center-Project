import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import SubNavBar from './components/sub-nav-bar/sub-nav-bar'
import Home from './pages/home/home'
import Navbar from './components/nav-bar/nav-bar'
function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/test" element={<SubNavBar />} />
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<SubNavBar />} />
          <Route path="/listening" element={<Listening />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
