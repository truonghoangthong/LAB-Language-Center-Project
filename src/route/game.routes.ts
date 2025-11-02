// src/routes/game.routes.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { timeTransformed } from "../utils/timeTransformed";
import logger from "../utils/logger";
import { httpLogger } from "../middleware/httpLogger";

const gameRoutes = express.Router();
gameRoutes.use(httpLogger);

// ==================== CONSTANTS ====================
const VALID_GAME_TYPES = ["sanapyramidi", "tutor"] as const;
type GameType = (typeof VALID_GAME_TYPES)[number];

// ==================== VALIDATORS ====================
const isValidGameType = (type: string): type is GameType => {
    return VALID_GAME_TYPES.includes(type as GameType);
};

// ==================== ROUTES ====================
// ==================== ROUTE 1: LẤY DANH SÁCH (đã có) ====================
/**
 * GET /game/:type
 * Lấy danh sách bài học game theo loại (sanapyramidi | tutor)
 * Response: { result: [...] }
 */
gameRoutes.get("/:type", async (req: Request, res: Response): Promise<any> => {
    const { type } = req.params;
    const cleanType = type.trim().toLowerCase();

    if (!isValidGameType(cleanType)) {
        logger.warn("Invalid game type requested", { requestedType: type });
        return res.status(400).json({
            result: [], // Trả result rỗng nếu invalid
        });
    }

    logger.info("Fetching game lessons", { type: cleanType });

    try {
        // Query: module == "game"
        const q = query(
            collection(db, "lessons"),
            where("module", "==", "game")
        );

        const snapshot = await getDocs(q);

        // Filter type trong code
        const filteredDocs = snapshot.docs.filter((doc) => {
            const data = doc.data();
            const docType = data.type?.toString().trim().toLowerCase();
            return docType === cleanType;
        });

        // Map đúng format yêu cầu
        const result = filteredDocs.map((doc) => {
            const data = doc.data();
            const timestamp = data.createdAt;
            let createAt = null;

            if (timestamp?.seconds) {
                createAt = timeTransformed(timestamp.seconds * 1000);
            } else if (timestamp?.toDate) {
                createAt = timestamp.toDate().toISOString();
            }

            return {
                lessonName: data.lessonName || "Unknown Lesson",
                module: data.module || "game",
                type: data.type?.toString().trim() || cleanType,
                createAt, // Tên field đúng: createAt
            };
        });

        logger.info("Successfully fetched game lessons", {
            type: cleanType,
            count: result.length,
        });

        // TRẢ VỀ ĐÚNG FORMAT YÊU CẦU
        return res.status(200).json({ result });
    } catch (error: any) {
        logger.error("Failed to fetch game lessons", {
            type: cleanType,
            error: error.message,
        });
        return res.status(500).json({ result: [] }); // Trả result rỗng khi lỗi
    }
});

// ==================== ROUTE 2: LẤY CHI TIẾT GAME THEO TYPE + LESSONID ====================

/**
 * GET /api/game/:type/:lessonid
 * Lấy nội dung chi tiết game (sanapyramidi | tutor)
 */
gameRoutes.get("/:type/:lessonid", async (req: Request, res: Response) => {
    const { type, lessonid } = req.params;
    const cleanType = type.trim().toLowerCase();
    const cleanLessonId = lessonid.trim();

    // Validate type
    if (!isValidGameType(cleanType)) {
        logger.warn("Invalid game type", { type, lessonid: cleanLessonId });
        return res.status(400).json({ result: {} });
    }

    // Validate lessonid
    if (!cleanLessonId) {
        logger.warn("Missing lessonid", { type: cleanType });
        return res.status(400).json({ result: {} });
    }

    logger.info("Fetching game detail", {
        type: cleanType,
        lessonid: cleanLessonId,
    });

    try {
        // Tìm document theo lessonId + type + module=game
        const lessonsRef = collection(db, "lessons");
        const q = query(
            lessonsRef,
            where("module", "==", "game"),
            where("type", "==", cleanType),
            where("lessionId", "==", cleanLessonId) // hoặc "lessonId"
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            logger.info("Game lesson not found", {
                type: cleanType,
                lessonid: cleanLessonId,
            });
            return res.status(404).json({ result: {} });
        }

        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        // Xử lý part1 theo type
        let part1: any = {};

        if (cleanType === "sanapyramidi") {
            // Lấy nguyên part1 (đã có cấu trúc level_1, level_2...)
            part1 = data.part1 || {};
        }

        if (cleanType === "tutor") {
            // Chỉ lấy các field question_* trong part1
            const rawPart1 = data.part1 || {};
            part1 = {};

            Object.keys(rawPart1)
                .filter((key) => key.startsWith("question_"))
                .forEach((key) => {
                    const q = rawPart1[key];
                    part1[key] = {
                        answer: q.answer || "",
                        answerAudioLink: q.answerAudioLink || "",
                        audioLink: q.audioLink || "",
                        script: q.script || "",
                    };
                });
        }

        // Response đúng format
        const result = { part1 };

        logger.info("Game detail fetched successfully", {
            type: cleanType,
            lessonid: cleanLessonId,
            questionCount:
                cleanType === "tutor" ? Object.keys(part1).length : undefined,
        });

        return res.status(200).json({ result });
    } catch (error: any) {
        logger.error("Failed to fetch game detail", {
            type: cleanType,
            lessonid: cleanLessonId,
            error: error.message,
        });
        return res.status(500).json({ result: {} });
    }
});

// ==================== ERROR HANDLER (giữ nguyên) ====================
gameRoutes.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error("Unhandled error in game routes", {
            error: err.message,
            url: req.originalUrl,
        });
        res.status(500).json({ result: [] });
    }
);

export { gameRoutes };
