import express from 'express';
import type { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { timeTransformed } from '../utils/timeTransformed';


const listeningRoutes = express.Router();
// Retrieve listening lessons based on Finnish proficiency level and lesson type
listeningRoutes.get('/:level/:type', async (req: Request, res: Response) => {
    const { level, type } = req.params as { level: string; type: string };
    if (!level || !type) {
        return res.status(400).json({ error: 'Missing level or type parameter' });
    }
    else {
        const queryLesson = query(collection(db, 'lessons'), where('level', '==', level), where('type', '==', type));
        const querySnapshot = await getDocs(queryLesson);
        try {
            if (querySnapshot.empty) {
                return res.status(404).json({ error: 'No lessons found for the specified level and type' });
            } else {
                const result = querySnapshot.docs.map (doc => {
                    const data = doc.data();
                    return {
                        lessonName: data.lessonName,
                        level: data.level,
                        module: data.module,
                        type: data.type,
                        createdAt: timeTransformed(data.createdAt?.seconds * 1000)
                    };
                });
                return res.status(200).json({result});
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error retrieving lessons' });
        }
    }
});

export { listeningRoutes } ;