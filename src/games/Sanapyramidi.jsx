import React, { useState, useEffect, useRef } from "react";

function Sanapyramidi() {
    const ALL_WORDS = [
        "Parveke",
        "matto",
        "verhot",
        "kahvikeitin",
        "pesukone",
        "uuni",
        "farkut",
        "paita",
        "hattu",
        "sukat",
        "punainen",
        "musta",
        "sininen",
        "pinkki",
        "ruskea",
    ];
    const GROUPS = [
        {
            size: 1,
            words: ["Parveke"],
            // theme: "Parveke",
            // subtitle: "(Ei kuulu mihinkään ryhmään)",
            color: "gradient-red",
        },
        {
            size: 2,
            words: ["matto", "verhot"],
            theme: "Kodin tekstiilit",
            color: "gradient-orange",
        },
        {
            size: 3,
            words: ["kahvikeitin", "pesukone", "uuni"],
            theme: "Kodinkoneet",
            color: "gradient-green",
        },
        {
            size: 4,
            words: ["farkut", "paita", "hattu", "sukat"],
            theme: "Vaatteet",
            color: "gradient-blue",
        },
        {
            size: 5,
            words: ["punainen", "musta", "sininen", "pinkki", "ruskea"],
            theme: "Värit",
            color: "gradient-purple",
        },
    ];

    const [shuffledWords, setShuffledWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [placedGroups, setPlacedGroups] = useState({});
    const [wrongs, setWrongs] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [hintActive, setHintActive] = useState(null);
    const resultsRef = useRef(null);

    // Shuffle words on start and reset
    const shuffleWords = () => {
        return [...ALL_WORDS].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        setShuffledWords(shuffleWords());
    }, []);

    // Scroll to results on win/lose
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
            speak(word); // Pronounce on select
        }
        setHintActive(null); // Clear hint
    };

    const checkSelection = () => {
        const selSet = new Set(selectedWords);
        const matchingGroup = GROUPS.find(
            (g) =>
                g.words.every((w) => selSet.has(w)) &&
                selSet.size === g.words.length
        );

        if (matchingGroup) {
            // Correct!
            setPlacedGroups((prev) => ({
                ...prev,
                [matchingGroup.size]: matchingGroup,
            }));
            setSelectedWords([]);
            speak("Oikein"); // "Correct"

            // Check win
            if (Object.keys(placedGroups).length + 1 === GROUPS.length) {
                setGameWon(true);
            }
        } else {
            // Wrong
            setWrongs((w) => w + 1);
            setSelectedWords([]);
            speak("Väärin"); // "Wrong"

            if (wrongs + 1 >= 4) {
                setGameLost(true);
            }
        }
    };

    const getHint = () => {
        const remainingGroups = GROUPS.filter(
            (g) => !placedGroups[g.size] && g.size > 1
        ); // Exclude size 1 for hint
        if (remainingGroups.length > 0) {
            // Bottommost = largest size
            const bottomGroup = remainingGroups.sort(
                (a, b) => b.size - a.size
            )[0];
            const firstWord = bottomGroup.words[0];
            setHintActive(firstWord);
            speak(firstWord);
        }
    };

    const resetGame = () => {
        setShuffledWords(shuffleWords());
        setSelectedWords([]);
        setPlacedGroups({});
        setWrongs(0);
        setGameWon(false);
        setGameLost(false);
        setHintActive(null);
    };

    const layerWidths = {
        1: "w-[15rem]",
        2: "w-[25rem]",
        3: "w-[35rem]",
        4: "w-[45rem]",
        5: "w-[55rem]",
    };

    // Available words: exclude placed groups' words
    const availableWords = shuffledWords.filter(
        (w) => !Object.values(placedGroups).some((g) => g.words.includes(w))
    );

    // Assign slices to remaining layers dynamically
    let offset = 0;
    const layerAssignments = {};
    [1, 2, 3, 4, 5].forEach((size) => {
        if (!placedGroups[size]) {
            layerAssignments[size] = availableWords.slice(
                offset,
                offset + size
            );
            offset += size;
        }
    });

    const renderLayer = (size, layerWords) => {
        const group = placedGroups[size];
        const layerClass = `${layerWidths[size]} mx-auto`;
        if (group) {
            // Placed: single large box
            let bgStyle = {};
            switch (group.color) {
                case "gradient-red":
                    bgStyle = {
                        backgroundImage:
                            "linear-gradient(to right, #FF6347, #FF4500)",
                    };
                    break;
                case "gradient-orange":
                    bgStyle = {
                        backgroundImage:
                            "linear-gradient(to right, #FFA500, #FF8C00)",
                    };
                    break;
                case "gradient-green":
                    bgStyle = {
                        backgroundImage:
                            "linear-gradient(to right, #90EE90, #228B22)",
                    };
                    break;
                case "gradient-blue":
                    bgStyle = {
                        backgroundImage:
                            "linear-gradient(to right, #ADD8E6, #4169E1)",
                    };
                    break;
                case "gradient-purple":
                    bgStyle = {
                        backgroundImage:
                            "linear-gradient(to right, #EC4899, #A855F7)",
                    };
                    break;
                default:
                    bgStyle = {};
            }
            return (
                <div className={layerClass}>
                    <div
                        style={bgStyle}
                        className={`flex justify-center items-center text-white px-8 py-6 rounded-xl shadow-2xl border-4 border-gray-800 text-xl font-bold text-center`}
                    >
                        <div>
                            {group.theme}
                            <p className="text-sm mt-1 opacity-90">
                                {group.subtitle || group.words.join(", ")}
                            </p>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Not placed: separate boxes with assigned words
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
            {/* Header
            <header className="w-full max-w-6xl flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        X
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Yle Sanapyramidi - Helpot: Peli 1
                    </h1>
                </div>
                <nav className="flex space-x-6">
                    <div className="flex flex-col items-center text-gray-700 hover:text-teal-600 transition cursor-pointer">
                        <span className="text-2xl mb-1">🏠</span>
                        <span className="text-sm">Home</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-700 hover:text-teal-600 transition cursor-pointer">
                        <span className="text-2xl mb-1">🎧</span>
                        <span className="text-sm">Listen</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-700 hover:text-teal-600 transition cursor-pointer">
                        <span className="text-2xl mb-1">🎮</span>
                        <span className="text-sm">Game</span>
                    </div>
                </nav>
            </header> */}

            {/* Instructions */}
            <div className="text-center mb-12 max-w-2xl">
                {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Helpot: Peli 1
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                    Klikkaa sanoja pyramidissa missä tahansa kerroksessa, jotka
                    kuuluvat samaan ryhmään. Tarkista valinta. Kun oikein, ryhmä
                    yhdistyy teemaksi pyramidissa. Löydä myös outo sana (size
                    1). 4 väärää → peli päättyy. Vihje: Ensimmäinen sana
                    alimmasta ryhmästä.
                </p>
                <p className="text-sm text-gray-500">
                    Klikkaa sanaa kuullaksesi ääntämisen 🇫🇮
                </p> */}
                <div className="mt-4 text-sm text-gray-600">
                    Väärät:{" "}
                    <span className="font-bold text-red-500">{wrongs}/4</span>
                </div>
            </div>

            {/* Pyramid */}
            <div className="flex flex-col items-center space-y-6 mb-12 w-full max-w-4xl">
                {/* Layers 1-5 */}
                {[1, 2, 3, 4, 5].map((size) => (
                    <React.Fragment key={size}>
                        {renderLayer(size, layerAssignments[size] || [])}
                    </React.Fragment>
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
                    disabled={
                        Object.keys(placedGroups).length === GROUPS.length ||
                        gameWon ||
                        gameLost
                    }
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
                        <h3 className="text-4xl font-bold text-green-800 mb-6">
                            🎉 Onneksi olkoon! Ratkaisit pyramidin! 🏆
                        </h3>
                        <p className="text-xl mb-4">
                            Väärät yritykset: {wrongs}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            {GROUPS.map((g) => (
                                <div
                                    key={g.size}
                                    className="bg-white p-4 rounded-xl shadow"
                                >
                                    <strong>{g.theme}</strong>:{" "}
                                    {g.subtitle || g.words.join(", ")}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameLost && (
                    <div className="p-12 bg-red-100 border-8 border-red-400 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl">
                        <h3 className="text-4xl font-bold text-red-800 mb-6">
                            😔 Peli päättyi! 4 väärää.
                        </h3>
                        <button
                            onClick={resetGame}
                            className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
                        >
                            Yritä uudelleen
                        </button>
                    </div>
                )}
            </div>

            {/* Footer
            <footer className="mt-20 text-gray-500 text-sm text-center">
                © Yle Oppiminen | Clone: Sanapyramidi Helpot Peli 1 | Äännetty
                selaimen puheella
            </footer> */}
        </div>
    );
}

export default Sanapyramidi;
