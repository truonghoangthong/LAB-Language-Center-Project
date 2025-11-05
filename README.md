# API Documentation: Finnish Interative Learning Platform

---
## Overview
This API provides comprehensive endpoints for a Finnish language learning platform that supports interactive lessons, vocabulary management,...The platform is designed to help users learn Finnish through structured courses, practice exercises, and personalized learning paths.

## System Architecture Overview
- **Backend:** Node.js v24.4.0
- **Database:** Firestore Database
- **Image storage:** Google cloud storage
- **Text-to-Speech:** AWS Polly

---
## Deployment Environment

### Development Setup

- **Default Port**: `3000`

#### Starting the Development Server

```bash
yarn dev
```
#### The backend API will be accessible at http://localhost:3000 when running in development mode.
---
## API Overview

## **API Endpoints**
### 1. **Get Listening Lessons Information related Level and Type**
- **Description:** Retrieves basic lesson information including lessonName, level, module, type, and creation date for lessons belonging to the specified level.
- **Method:** `GET`
-  **URL:** `/listening/:level/:type`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `level` | string | URL path | Yes | The level identifier to filter lessons. Accepted values: finnish_1, finnish_2, finnish_3, finnish_4, finnish_for_work |
| `type` | string | URL path | Yes | The type identifier to filter lessons. Accepted values: click, drag, dialogues |

#### Request Example
```bash
curl -X GET "http://localhost:3000/listening/finnish_3/click"
```

#### Response Format
Success Response (200 OK)
```bash
{
  "result": [
    {
      "lessonName": "kotisanasto",
      "level": "finnish_3",
      "module": "listening",
      "type": "click",
      "createdAt": "14.10.2025 klo 00.00"
    },
    {
      "lessonName": "Fuck you mother fucker",
      "level": "finnish_3",
      "module": "listening",
      "type": "click",
      "createdAt": "28.10.2025 klo 22.17"
    }
  ]
}
```

### 2. **Get Listening Lesson detail related Level, Type, Name and Part**
- **Description:** Retrieves specific study content for a lesson's level,type, name, and part.
- **Method:** `GET`
-  **URL:** `/listening/:level/:type/:name/:part`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `level` | string | URL path | Yes | The level identifier to filter lessons. Accepted values: finnish_1, finnish_2, finnish_3, finnish_4, finnish_for_work |
| `type` | string | URL path | Yes | The type identifier to filter lessons. Accepted values: click, drag, dialogues |
| `name` | string | URL path | Yes | The lesson name identifier in lowercase with underscores (e.g., kahvitauolla_1) |
| `part` | string | URL path | Yes | The part identifier (e.g., part1, part2) |
#### Request Example
```bash
curl -X GET "http://localhost:3000/listening/finnish_3/click/kotisanasto/part1"
```

#### Response Format
Success Response (200 OK)
```bash
{
  "result": {
    "part1": {
      "question8": {
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/katto.mp3",
        "script": "katto",
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/katto_image.png"
      },
      "question11": {
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/ovi.mp3",
        "script": "ovi",
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/ovi_image.png"
      },
      "question1": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/kerrostalo_image.png",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/kerrostalo.mp3",
        "script": "kerrostalo"
      },
      "question4": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/piha,%20puutarha_image.png",
        "script": "piha, puutarha",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/piha%2C%20puutarha.mp3"
      },
      "question2": {
        "script": "omakotitalo",
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/omakotitalo_image.png",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/omakotitalo.mp3"
      },
      "question6": {
        "script": "varasto",
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/varasto_image.png",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/varasto.mp3"
      },
      "question12": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/parveke_image.png",
        "script": "parveke",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/parveke.mp3"
      },
      "question7": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/seinä_image.png",
        "script": "seinä",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/seina%CC%88.mp3"
      },
      "question3": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/rivitalo_image.png",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/rivitalo.mp3",
        "script": "rivitalo"
      },
      "question9": {
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/lattia_image.png",
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/lattia.mp3",
        "script": "lattia"
      },
      "question5": {
        "audioLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/parkkipaikka.mp3",
        "imageLink": "https://finnishplatform.work.gd/Finnish%203/click/Kotisanasto/part%201/parkkipaikka_image.png",
        "script": "parkkipaikka"
      }
    }
  }
}
```

#### Audio Features
- **Voice**: Finnish female voice (Suvi)
- **Engine**: AWS Polly Neural engine
- **Language**: Finnish (fi-FI)

#### Notes
- All four parameters (level, type, name, part) are required
- **Lesson naming convention**: Must be in lowercase with words separated by underscores

### 3. **Get Game Lessons Information related Type**
- **Description:** Retrieves basic lesson information including lessonName, module, type, lessonId, and creation date for game belonging to the specified type.
- **Method:** `GET`
-  **URL:** `/game/:type`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `type` | string | URL path | Yes | The type identifier to filter lessons. Accepted values: tutor, sanapyramidi |

#### Request Example
```bash
curl -X GET "http://localhost:3000/game/tutor"
```

#### Response Format
Success Response (200 OK)
```bash
{
  "result": [
    {
      "lessonName": "Game 2",
      "module": "game",
      "type": "tutor",
      "lessonId": "tutor02",
      "createAt": "18.11.2025 klo 18.33"
    },
    {
      "lessonName": "Game 1",
      "module": "game",
      "type": "tutor",
      "lessonId": "tutor01",
      "createAt": "15.10.2025 klo 00.00"
    }
  ]
}
```

### 4. **Get game Lesson detail related Type and lessonid**
- **Description:** Retrieves specific study content for a lesson's type and lessonid.
- **Method:** `GET`
-  **URL:** `/listening/:type/:lessonid`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `type` | string | URL path | Yes | The type identifier to filter lessons. Accepted values: sanapyramidi, tutor |
| `lessonid` | string | URL path | Yes | The lessonid identifier (e.g., sana01, tutor01) |
#### Request Example
```bash
curl -X GET "http://localhost:3000/game/tutor/tutor01"
```

#### Response Format
Success Response (200 OK)
```bash
{
  "result": {
    "part1": {
      "question_6": {
        "answer": "pesukone",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_6.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_6.mp3",
        "script": "Tämä pesee sinun vaatteet. Tämä on kylpyhuoneessa."
      },
      "question_1": {
        "answer": "sohva",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_1.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_1.mp3",
        "script": "Voit istua tai maata tässä. Se on usein olohuoneessa."
      },
      "question_2": {
        "answer": "sänky",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_2.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_2.mp3",
        "script": "Voit nukkua tässä. Se on yleensä makuuhuoneessa."
      },
      "question_7": {
        "answer": "tiskikone /astianpesukone",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_7.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_7.mp3",
        "script": "Tämä on yleensä keittiössä. Tämä pesee likaiset astiat."
      },
      "question_9": {
        "answer": "taulu",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_9.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_9.mp3",
        "script": "Tämä on seinällä. Tämä on koriste. Tässä on usein kuva."
      },
      "question_12": {
        "answer": "suihku",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_12.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_12.mp3",
        "script": "Tämä on kylpyhuoneessa. Tästä tulee vettä. Menet tähän paikkaan, kun haluat peseytyä."
      },
      "question_11": {
        "answer": "mikro / mikrouuni",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_11.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_11.mp3",
        "script": "Jos sinä haluat nopeasti lämmintä ruokaa, mihin laitat ruoan. Tämä on keittiössä."
      },
      "question_14": {
        "answer": "varasto / pyörävarasto",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_14.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_14.mp3",
        "script": "Tämä on kerrostalon alakerrassa. Täällä on paljon tavaraa ja polkupyörät."
      },
      "question_10": {
        "answer": "matto",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_10.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_10.mp3",
        "script": "Tämä on lattialla. Tämä on pehmeä."
      },
      "question_4": {
        "answer": "jääkaappi",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_4.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_4.mp3",
        "script": "Tämä on keittiössä. Sisällä on ruokaa. Se on kylmä."
      },
      "question_13": {
        "answer": "parveke",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_13.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_13.mp3",
        "script": "Tämä on yleensä kerrostalossa tai rivitalossa. Tämä on ulkona. Täällä voi ottaa aurinkoa tai kasvattaa kukkia. Joka asunnossa on oma."
      },
      "question_5": {
        "answer": "kirjahylly",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_5.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_5.mp3",
        "script": "Tämä on yleensä olohuoneessa. Tämän päällä on esimerkiksi monta kirjaa."
      },
      "question_8": {
        "answer": "vaatekaappi / kaappi",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_8.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_8.mp3",
        "script": "Tämä on usein makuuhuoneessa. Sen sisällä on vaatteita. Siinä on monta hyllyä."
      },
      "question_3": {
        "answer": "pöytä / ruokapöytä",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_3.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_3.mp3",
        "script": "Tämä on usein keittiössä. Tämä ympärillä voit syödä."
      },
      "question_15": {
        "answer": "sauna",
        "answerAudioLink": "https://finnishplatform.work.gd/Tutor/game_1/answer_15.mp3",
        "audioLink": "https://finnishplatform.work.gd/Tutor/game_1/question_15.mp3",
        "script": "Tämä on kuuma paikka. Tämä on Suomessa tärkeä osa kulttuuria. Siellä käydään esimerkiksi lauantaina."
      }
    }
  }
}
```

#### Audio Features
- **Voice**: Finnish female voice (Suvi)
- **Engine**: AWS Polly Neural engine
- **Language**: Finnish (fi-FI)

#### Notes
- All four parameters (type, lessonId) are required
- **Lesson id convention**: Must be in lowercase with words separated by underscores

---
## Complete Data Structure Mapping
### 1. **Fetch Listening lessons** ( /listening/:level/:type )
```json
{
  "result": [
    {
      "lessonName": ".....",
      "level": ".....",
      "module": ".....",
      "type": ".....",
      "createdAt": .....
    },
    {
      "lessonName": "......",
      "level": ".....",
      "module": ".....",
      "type": ".....",
      "createdAt": "....."
    }
  ]
}
```

### 2. **Fetch Listening lesson detail** ( /listening/:level/:type/:name/:part )
### 2a. type click
```json
{
  "result": {
    "part1": {
      "question1": { imageLink, script, audioLink },
      "question2": { imageLink, script, audioLink },
      "question3": { imageLink, script, audioLink },
      "question5": { imageLink, script, audioLink },
      "question6": { imageLink, script, audioLink },
      ........
    }
  }
}
```
```json
{
  "result": {
    "part2": {
      "question1": { imageLink, script, audioLink },
      "question2": { imageLink, script, audioLink },
      "question3": { imageLink, script, audioLink },
      "question5": { imageLink, script, audioLink },
      "question6": { imageLink, script, audioLink },
      ........
    }
  }
}
```

```json
{
  "result": {
    "part3": {
      "question1": { imageLink, script, audioLink },
      "question2": { imageLink, script, audioLink },
      "question3": { imageLink, script, audioLink },
      "question5": { imageLink, script, audioLink },
      "question6": { imageLink, script, audioLink },
      ........
    }
  }
}
```
### 2b. type dialogues (

## Naming Convention: `people_{speakerId}_{utteranceNumber}`

| Component | Description |
|-----------|-------------|
| `speakerId` | Identifies the speaker (1st number) |
| `utteranceNumber` | Tracks utterance sequence (2nd number) |

### Example

In a dialogue between two speakers:

| Order | Key | Speaker | Turn |
|-------|-----|---------|------|
| 1st | `people_1_1` | Speaker 1 | First utterance |
| 2nd | `people_2_1` | Speaker 2 | First utterance |
| 3rd | `people_1_2` | Speaker 1 | Second utterance |
| 4th | `people_2_2` | Speaker 2 | Second utterance |

> 💡 Each speaker maintains their own sequential count while alternating turns.

### Example Dialogue Flow
```
people_1_1 → people_2_1 → people_1_2 → people_2_2
```

```json
{
  "result": {
    "part1": {
      "people_1_1": { imageLink, script, audioLink },
      "people_1_2": { imageLink, script, audioLink },
      "people_1_3": { imageLink, script, audioLink },
      ........
      "people_2_1": { imageLink, script, audioLink },
      "people_2_2": { imageLink, script, audioLink },
      "people_2_3": { imageLink, script, audioLink },
      ........
    }
  }
}
```
### 3. **Fetch game lessons** ( /game/:type )

```json
{
  "result": [
    {
      "lessonName": ".....",
      "module": ".....",
      "type": ".....",
      "lessonId": ".....",
      "createAt": "....."
    },
    {
      "lessonName": ".....",
      "module": ".....",
      "type": ".....",
      "lessonId": ".....",
      "createAt": "....."
    }
  ]
}
```

### 4. **Fetch game lesson detail** ( //:type/:lessonid )
### 4a. type sanapyramidi

```json
{
  "result": {
    "part1": {
      "level_1": {
        "topic": ".....",
        "word_1": "....."
      },
      "level_2": {
        "topic": ".....",
        "word_1": ".....",
        "word_2": "....."
      },
      "level_3": {
        "topic": ".....",
        "word_1": ".....",
        "word_2": ".....",
        "word_3": "....."
      },
      "level_4": {
        "topic": ".....",
        "word_1": ".....",
        "word_2": ".....",
        "word_3": ".....",
        "word_4": "....."
      },
      "level_5": {
        "topic": ".....",
        "word_1": ".....",
        "word_2": ".....",
        "word_3": ".....",
        "word_4": ".....",
        "word_5": "....."
      }
    }
  }
}
```

### 4b. type tutor
```json
{
  "result": {
    "part1": {
      "question1": { answer, answerAudioLink, script, audioLink },
      "question2": { answer, answerAudioLink, script, audioLink },
      "question3": { answer, answerAudioLink, script, audioLink },
      "question5": { answer, answerAudioLink, script, audioLink },
      "question6": { answer, answerAudioLink, script, audioLink },
      "question7": { answer, answerAudioLink, script, audioLink },
      "question8": { answer, answerAudioLink, script, audioLink },
      ........
    }
  }
}
```
