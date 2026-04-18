# Interactive Platform for Learning Finnish

A full-stack web application designed for international students at LAB and LUT universities to learn Finnish effectively through listening exercises and interactive games.

---

## Authors

| Name | Role |
|------|------|
| [Thong Truong](https://github.com/truonghoangthong) | Project Manager, Backend Dev, Deployer, Database Administrator, Tester |
| [Thanh Nguyen](https://github.com/Thanhnguyenjolie) | Designer, Frontend Dev |
| [Phu Trieu](https://github.com/Phu-trieu24) | Backend Dev, Tester |
| [Nhi Nguyen](https://github.com/nhingnguyen) | Designer, Frontend Dev |

---

## Project Structure

```
LAB-Language-Center-Project/
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Page-level components
│   │   │   ├── home/
│   │   │   ├── listening/
│   │   │   ├── listen-click/
│   │   │   ├── listen-drag/
│   │   │   ├── listen-dialogue/
│   │   │   └── game/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                   # Node.js + Express REST API
    ├── src/
    │   ├── config/            # Firebase configuration
    │   ├── middleware/        # HTTP logger (Morgan + Winston)
    │   ├── route/             # API route handlers
    │   │   ├── listening.routes.ts
    │   │   ├── game.routes.ts
    │   │   └── log.routes.ts
    │   ├── utils/             # Logger, time utilities
    │   └── server.ts
    ├── nodemon.json
    ├── tsconfig.json
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v7, Tailwind CSS v4, Vite |
| Backend | Node.js v24, Express v5, TypeScript |
| Database | Firebase Firestore |
| Image storage | Google Cloud Storage |
| Text-to-speech | AWS Polly (Finnish female voice — Suvi, Neural engine) |
| Logging | Winston + Morgan (daily rotating log files) |
| Hosting | Azure VM |

---

## Prerequisites

- Node.js >= 20
- yarn or npm
- A Firebase project with Firestore enabled
- AWS credentials with Polly access (for TTS generation)
- Google Cloud Storage bucket

---

## Getting Started

### Backend

#### 1. Install dependencies

```bash
cd backend
yarn install
```

#### 2. Configure environment variables

Create a `.env` file in `backend/`:

```env
HOST=0.0.0.0
PORT=3000

FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### 3. Start the development server

```bash
yarn dev
```

The API will be available at `http://localhost:3000`.

---

### Frontend

#### 1. Install dependencies

```bash
cd frontend
npm install
```

#### 2. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> Make sure the backend is running before starting the frontend.

---

## API Endpoints

### Listening

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/listening/:level/:type` | List lessons by level and type |
| `GET` | `/listening/:level/:type/:name/:part` | Get lesson content by part |

**Accepted values:**

- `level`: `finnish_1`, `finnish_2`, `finnish_3`, `finnish_4`, `finnish_for_work`
- `type`: `click`, `drag`, `dialogues`

**Example:**

```bash
GET /listening/finnish_3/click
GET /listening/finnish_3/click/kotisanasto/part1
```

### Game

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/game/:type` | List game lessons by type |
| `GET` | `/game/:type/:lessonid` | Get game lesson content |

**Accepted values:**

- `type`: `tutor`, `sanapyramidi`

**Example:**

```bash
GET /game/tutor
GET /game/tutor/tutor01
```

### Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/log` | Retrieve log entries (`?type=app&date=YYYY-MM-DD&lines=100`) |
| `GET` | `/log/files` | List all available log files |
| `GET` | `/log/search` | Search logs by keyword (`?q=keyword`) |
| `DELETE` | `/log/:filename` | Delete a specific log file |

---

## Features

### Listening module

Three exercise types, each with multiple levels (Finnish 1–4 and Finnish for Work):

- **Listen and Click** — hear a word and click the matching image from a grid
- **Listen and Drag** — drag words to match audio (embedded Scratch/TurboWarp game)
- **Listen and Dialogues** — automated dialogue playback with transcript toggle

### Game module

- **Arvaa sana! (Guess the word)** — a tutor bot asks Finnish riddles; the learner types the answer in a chat-style interface
- **Sanapyramidi (Word pyramid)** — group words by theme and arrange them into a pyramid; each layer contains words that share a common topic

---

## Logging

Log files are stored in `backend/logs/` and rotate daily:

- `app-YYYY-MM-DD.log` — all application logs (kept 14 days)
- `error-YYYY-MM-DD.log` — error-only logs (kept 30 days)

Logs are also printed to the terminal in development with color-coded output.

---
