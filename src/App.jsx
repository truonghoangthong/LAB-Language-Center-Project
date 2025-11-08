import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import SubNavBar from './components/sub-nav-bar/sub-nav-bar'
import Home from './pages/home/home'
import Navbar from './components/nav-bar/nav-bar'
import Title from './components/listening-title/title'
import ListenAndClick from './pages/listen_click/listen_click'

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/test" element={<SubNavBar />} />
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<SubNavBar />} />
            <Route path="/listening" element={<>  <ListenAndClick /> </>} />
          </Routes>
        </div>
        <footer className="footer">
          <p>&copy; 2025 LAB UAS. All rights reserved.</p>
        </footer>
      </Router>
    </div>
  )
}

export default App