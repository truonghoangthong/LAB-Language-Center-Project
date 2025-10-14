import express from 'express';
 import type { Request, Response } from 'express';
 import cors from 'cors';
 import dotenv from 'dotenv';
 dotenv.config();
 const app = express();
 const port = process.env.PORT || 3000;
 app.use(express.json());
 app.use(cors());
 app.get('/', (req: Request, res: Response) => {
    res.send(`Đm`);
 });
 app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello' });
 });
 app.listen(port, () => {
    console.log(`Server chạy ở http://localhost:${port}`);
 });