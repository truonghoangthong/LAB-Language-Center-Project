import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Navbar from "./components/nav-bar/nav-bar";
import Listening from "./pages/listening/listening";
import ListenAndClick from "./pages/listen-click/listen-click";
import ListenDialog from "./pages/listen-dialogue/listenDialog";
import ListenAndDrag from "./pages/listen-drag/listen-drag";

import Sanapyramidi from "./games/Sanapyramidi"; // anh Bi thêm

function App() {
    return (
        <div className="app">
            <Router>
                <Navbar />
                <div className="page-content">
                    <Routes>
                        <Route path="/test" element={<ListenDialog />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<></>} />
                        <Route path="/listening" element={<Listening />} />

                        <Route
                            path="/games/sanapyramidi"
                            element={<Sanapyramidi />}
                        />
                        <Route
                            path="/listening/:level/drag/:topic"
                            element={<ListenAndDrag />}
                        />
                        <Route
                            path="/listening/:level/dialogues/:topic"
                            element={<ListenDialog />}
                        />
                        <Route
                            path="/listening/:level/:type/:topic"
                            element={<ListenAndClick />}
                        />
                    </Routes>
                </div>
                <footer className="footer">
                    <p>&copy; 2025 LAB UAS. All rights reserved.</p>
                </footer>
            </Router>
        </div>
    );
}

export default App;