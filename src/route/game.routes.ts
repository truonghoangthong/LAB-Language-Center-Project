import express from 'express';
import type { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';

const gameRoutes = express.Router();

// Retrieve game lessons based on game type

export { gameRoutes };