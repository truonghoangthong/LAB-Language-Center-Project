import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Sanapyramidi() {
  const { lessonId } = useParams(); // Lấy lessonId từ URL
  const [allWords, setAllWords] = useState([]);
  const [groups, setGroups] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [placedGroups, setPlacedGroups] = useState({});
  const [wrongs, setWrongs] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [hintActive, setHintActive] = useState(null);
  const resultsRef = useRef(null);

  const layerWidths = {
    1: "w-[15rem]",
    2: "w-[25rem]",
    3: "w-[35rem]",
    4: "w-[45rem]",
    5: "w-[55rem]",
  };

  // Fetch API khi component mount hoặc lessonId thay đổi
  useEffect(() => {
    if (!lessonId) return;
    console.log("Fetching sanapyramidi data for lessonId:", lessonId);

    axios
      .get(`http://localhost:3000/game/sanapyramidi/${lessonId}`)
      .then((response) => {
        const data = response.data.result.part1;
        const tempGroups = [];
        const tempWords = [];

        Object.keys(data).forEach((levelKey) => {
          const level = data[levelKey];
          const wordList = Object.keys(level)
            .filter((k) => k.startsWith("word_"))
            .map((k) => level[k]);

          tempGroups.push({
            size: wordList.length,
            words: wordList,
            theme: level.topic,
            color: "", // sẽ map màu theo size sau
          });

          tempWords.push(...wordList);
        });

        // Gán màu gradient theo size
        const colors = [
          "gradient-red",
          "gradient-orange",
          "gradient-green",
          "gradient-blue",
          "gradient-purple",
        ];
        const tempGroupsWithColor = tempGroups.map((g, idx) => ({
          ...g,
          color: colors[idx] || "gradient-gray",
        }));

        setGroups(tempGroupsWithColor);
        setAllWords(tempWords);
        setShuffledWords([...tempWords].sort(() => Math.random() - 0.5));
      })
      .catch((err) => console.error(err));
  }, [lessonId]);

  // Scroll to results
  useEffect(() => {
    if ((gameWon || gameLost) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [gameWon, gameLost]);

  const speak = (word) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "fi-FI";
      speechSynthesis.speak(utterance);
    }
  };

  const toggleWord = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
      speak(word);
    }
    setHintActive(null);
  };

  const checkSelection = () => {
    const selSet = new Set(selectedWords);
    const matchingGroup = groups.find(
      (g) =>
        g.words.every((w) => selSet.has(w)) &&
        selSet.size === g.words.length &&
        !Object.values(placedGroups).some(
          (pg) => pg.words.join() === g.words.join()
        )
    );

    if (matchingGroup) {
      setPlacedGroups((prev) => ({
        ...prev,
        [matchingGroup.size]: matchingGroup,
      }));
      setSelectedWords([]);
      speak("Oikein");

      if (Object.keys(placedGroups).length + 1 === groups.length) {
        setGameWon(true);
      }
    } else {
      setWrongs((w) => w + 1);
      setSelectedWords([]);
      speak("Väärin");

      if (wrongs + 1 >= 4) {
        setGameLost(true);
      }
    }
  };

  const getHint = () => {
    const remainingGroups = groups.filter(
      (g) => !placedGroups[g.size] && g.size > 1
    );
    if (remainingGroups.length > 0) {
      const bottomGroup = remainingGroups.sort((a, b) => b.size - a.size)[0];
      const firstWord = bottomGroup.words[0];
      setHintActive(firstWord);
      speak(firstWord);
    }
  };

  const resetGame = () => {
    setShuffledWords([...allWords].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setPlacedGroups({});
    setWrongs(0);
    setGameWon(false);
    setGameLost(false);
    setHintActive(null);
  };

  // Words available (exclude placed groups)
  const availableWords = shuffledWords.filter(
    (w) => !Object.values(placedGroups).some((g) => g.words.includes(w))
  );

  // Assign words to layers
  let offset = 0;
  const layerAssignments = {};
  [1, 2, 3, 4, 5].forEach((size) => {
    if (!placedGroups[size]) {
      layerAssignments[size] = availableWords.slice(offset, offset + size);
      offset += size;
    }
  });

  const renderLayer = (size, layerWords) => {
    const group = placedGroups[size];
    const layerClass = `${layerWidths[size]} mx-auto`;

    const getGradientStyle = (color) => {
      switch (color) {
        case "gradient-red":
          return { backgroundImage: "linear-gradient(to right, #FF6347, #FF4500)" };
        case "gradient-orange":
          return { backgroundImage: "linear-gradient(to right, #FFA500, #FF8C00)" };
        case "gradient-green":
          return { backgroundImage: "linear-gradient(to right, #90EE90, #228B22)" };
        case "gradient-blue":
          return { backgroundImage: "linear-gradient(to right, #ADD8E6, #4169E1)" };
        case "gradient-purple":
          return { backgroundImage: "linear-gradient(to right, #EC4899, #A855F7)" };
        default:
          return {};
      }
    };

    if (group) {
      return (
        <div className={layerClass}>
          <div
            style={getGradientStyle(group.color)}
            className="flex justify-center items-center text-white px-8 py-6 rounded-xl shadow-2xl border-4 border-gray-800 text-xl font-bold text-center"
          >
            <div>
              {group.theme}
              <p className="text-sm mt-1 opacity-90">{group.words.join(", ")}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`${layerClass} flex justify-between space-x-2`}>
          {layerWords.map((word) => (
            <button
              key={word}
              onClick={() => toggleWord(word)}
              className={`flex-1 p-4 rounded-xl shadow-lg transition-all text-lg font-medium cursor-pointer hover:scale-105 active:scale-95 ${
                selectedWords.includes(word)
                  ? "bg-blue-500 text-white shadow-2xl ring-4 ring-blue-300"
                  : hintActive === word
                  ? "bg-green-400 text-white shadow-2xl ring-4 ring-green-300 animate-bounce"
                  : "bg-gray-200 hover:bg-gray-300 shadow-md hover:shadow-xl text-gray-800"
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center py-8 px-4 font-sans">
      {/* Game Info */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="mt-4 text-sm text-gray-600">
          Väärät: <span className="font-bold text-red-500">{wrongs}/4</span>
        </div>
      </div>

      {/* Pyramid */}
      <div className="flex flex-col items-center space-y-6 mb-12 w-full max-w-4xl">
        {[1, 2, 3, 4, 5].map((size) => (
          <React.Fragment key={size}>{renderLayer(size, layerAssignments[size] || [])}</React.Fragment>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
        <button
          onClick={checkSelection}
          disabled={selectedWords.length === 0 || gameWon || gameLost}
          className="px-12 py-4 bg-teal-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          Tarkista ({selectedWords.length})
        </button>
        <button
          onClick={getHint}
          disabled={Object.keys(placedGroups).length === groups.length || gameWon || gameLost}
          className="px-12 py-4 bg-yellow-500 text-gray-900 font-bold text-xl rounded-2xl shadow-xl hover:bg-yellow-600 transition-all disabled:bg-gray-400"
        >
          Vihje
        </button>
        <button
          onClick={resetGame}
          className="px-12 py-4 bg-gray-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:bg-gray-700 transition-all"
        >
          Uusi peli
        </button>
      </div>

      {/* Results */}
      <div ref={resultsRef}>
        {gameWon && (
          <div className="p-12 bg-green-100 border-8 border-green-400 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-4xl font-bold text-green-800 mb-6">🎉 Onneksi olkoon! Ratkaisit pyramidin! 🏆</h3>
            <p className="text-xl mb-4">Väärät yritykset: {wrongs}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              {groups.map((g) => (
                <div key={g.size} className="bg-white p-4 rounded-xl shadow">
                  <strong>{g.theme}</strong>: {g.words.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}
        {gameLost && (
          <div className="p-12 bg-red-100 border-8 border-red-400 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-4xl font-bold text-red-800 mb-6">😔 Peli päättyi! 4 väärää.</h3>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
            >
              Yritä uudelleen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sanapyramidi;
