import express from "express";
import type { Request, Response } from "express";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { timeTransformed } from "../utils/timeTransformed";
import logger from "../utils/logger";
import { httpLogger } from "../middleware/httpLogger";
import logRoutes from "./log.routes";

const listeningRoutes = express.Router();
listeningRoutes.use(httpLogger);

// Retrieve listening lessons based on Finnish proficiency level and lesson type
listeningRoutes.get("/:level/:type", async (req: Request, res: Response) => {
    const { level, type } = req.params as { level: string; type: string };
    if (!level || !type) {
        return res
            .status(400)
            .json({ error: "Missing level or type parameter" });
        logger.error("Missing parameters", { level, type });
    } else {
        logger.info("Fetching lessons");
        const queryLesson = query(
            collection(db, "lessons"),
            where("module", "==", "listening"),
            where("level", "==", level),
            where("type", "==", type)
        );
        const querySnapshot = await getDocs(queryLesson);
        try {
            if (querySnapshot.empty) {
                return res
                    .status(404)
                    .json({
                        error: "No lessons found for the specified level and type",
                    });
            } else {
                const result = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        lessonName: data.lessonName,
                        level: data.level,
                        module: data.module,
                        type: data.type,
                        createdAt: timeTransformed(
                            data.createdAt?.seconds * 1000
                        ),
                    };
                });
                logger.info("Lessons fetched", { level, type });
                return res.status(200).json({ result });
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error("Failed to fetch lessons", { error: message });
            return res.status(500).json({ error: "Error retrieving lessons" });
        }
    }
});

// Retrieve listening lesson detail based on Finnish proficiency level, lesson type and lesson name
listeningRoutes.get("/:level/:type/:name/:part", async (req: Request, res: Response) => {
    const { level, type, name, part } = req.params as { level: string; type: string; name: string; part: string };
    if (!level || !type || !name || !part) {
        return res
            .status(400)
            .json({ error: "Missing level, type or name parameter" });
        logger.error("Missing parameters", { level, type, name, part });
    } else {
        logger.info("Fetching lessons");
        const queryLesson = query(
            collection(db, "lessons"),
            where("level", "==", level),
            where("type", "==", type),
            where("lessonName", "==", name)
        );
        const querySnapshot = await getDocs(queryLesson);
        const data = querySnapshot.docs[0].data();
        const selectedPart = data?.[part];
        if (!selectedPart) {
            return res
                .status(404)
                .json({ error: `${part} not found in lesson ${name}` });
            logger.error("Part not found", { part, lesson: name });
        }
        try {
            if (querySnapshot.empty) {
                return res
                    .status(404)
                    .json({
                        error: "No lessons found for the specified level and type",
                    });
            } else {
                const result = {
                    [part]: selectedPart // show part object
                };
                for (const questionKey of Object.keys(result[part])) {
                    const script = result[part][questionKey].script;
                    const audioLink = result[part][questionKey].audioLink;
                    if ( result[part][questionKey].imageLink ) {
                        const imageLink = result[part][questionKey].imageLink;
                    }
                }
                logger.info("Lessons fetched", { part, lesson: name, level, type });
                return res.status(200).json({ result });
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error("Failed to fetch lessons", { error: message });
            return res.status(500).json({ error: "Error retrieving lessons" });
        }
    }
});

listeningRoutes.use((err: Error, req: any, res: any, next: any) => {
    logger.error("Unhandled error", {
        error: err.message,
        stack: err.stack,
        url: req.url,
    });
    res.status(500).json({ error: "Internal server error" });
});

export { listeningRoutes };
