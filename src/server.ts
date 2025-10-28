import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

// Import routes
import { listeningRoutes } from './route/listening.routes';
import { gameRoutes } from './route/game.routes';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// Use routes
app.use('/listening', listeningRoutes);
app.use('/game', gameRoutes);

app.listen(port, () => {
    console.log(`Server chạy ở http://localhost:${port}`);
});