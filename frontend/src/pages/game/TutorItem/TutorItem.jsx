import "./TutorItem.css";
import React from 'react';

const TutorItem = ({ data, onLessonSelect  }) => {
    const groupByCharacter = (dataArray) => {
        return dataArray.reduce((groups, item) => {
        const character = item.character || "No Character";        
        if (!groups[character]) {
            groups[character] = [];
        }
        groups[character].push(item);
        return groups;
    }, {}); 
    };

    const handleLessonClick = (item) => {
        onLessonSelect(item);  
    };
    const groupedData = groupByCharacter(data);
    return (
        <div className="tutor-list">
            {Object.entries(groupedData).map(([character, items]) => {
                const imageLink = items[0]?.imageLink || "";
                return (
                    <div key={character} className="tutor-card">
                        <div className="tutor-avatar">
                            <img src={imageLink} alt={character} />
                        </div>
                        <div className="tutor-content">
                            <h2 className="tutor-name">{character}</h2>
                            <div className="tutor-lessons">
                                {items.map((item) => (
                                    <button onClick={() => handleLessonClick(item)} key={item.lessonId} className="lesson-tag">
                                        {item.lessonName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TutorItem;