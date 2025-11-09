import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/home'
import Navbar from './components/nav-bar/nav-bar'
import Title from './components/listening-title/title'
import Listening from './pages/listening/listening'
import ListenAndClick from './pages/listen-click/listen-click'

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/test" element={<></>} />
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<></>} />
            <Route path="/listening" element={<>  <Listening   /> </>} />
            <Route path="/listening/:level/:type/:topic" element={<ListenAndClick />} />
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