import express from 'express';
import type { Request, Response } from 'express';
import { httpLogger } from '../middleware/httpLogger';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * GET /api/logs
 * Query params:
 * - type: 'app' | 'error' (default: 'app')
 * - date: YYYY-MM-DD (default: today)
 * - lines: number (default: 100, max: 1000)
 */
router.get('/', (req, res) => {
  try {
    const type = (req.query.type as string) || 'app';
    const date = (req.query.date as string) || getTodayDate();
    const lines = Math.min(parseInt(req.query.lines as string) || 100, 1000);

    // Validate type
    if (!['app', 'error'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid type. Use "app" or "error"'
      });
    }

    // Build filename
    const filename = `${type}-${date}.log`;
    const filepath = path.join(process.cwd(), 'logs', filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: `Log file not found: ${filename}`,
        hint: 'Try a different date or check if logs exist'
      });
    }

    // Read file
    const content = fs.readFileSync(filepath, 'utf-8');
    const allLines = content.split('\n').filter(line => line.trim());

    // Get last N lines
    const logLines = allLines.slice(-lines);

    // Parse JSON logs
    const parsedLogs = logLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });

    logger.info('Logs retrieved', {
      type,
      date,
      count: parsedLogs.length
    });

    res.json({
      success: true,
      data: {
        file: filename,
        date,
        type,
        totalLines: allLines.length,
        returnedLines: parsedLogs.length,
        logs: parsedLogs
      }
    });
  } catch (error: any) {
    logger.error('Failed to read logs', { error: error.message });
    res.status(500).json({
      error: 'Failed to read logs',
      message: error.message
    });
  }
});

/**
 * GET /api/logs/files
 * List all available log files
 */
router.get('/files', (req, res) => {
  try {
    const logsDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logsDir)) {
      return res.json({
        success: true,
        data: { files: [] }
      });
    }

    const files = fs.readdirSync(logsDir)
      .filter(file => file.endsWith('.log'))
      .map(file => {
        const filepath = path.join(logsDir, file);
        const stats = fs.statSync(filepath);
        return {
          name: file,
          size: `${(stats.size / 1024).toFixed(2)} KB`,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());

    res.json({
      success: true,
      data: {
        count: files.length,
        files
      }
    });
  } catch (error: any) {
    logger.error('Failed to list log files', { error: error.message });
    res.status(500).json({
      error: 'Failed to list files',
      message: error.message
    });
  }
});

/**
 * GET /api/logs/search
 * Search logs by keyword
 * Query params:
 * - q: search keyword (required)
 * - type: 'app' | 'error' (default: 'app')
 * - date: YYYY-MM-DD (default: today)
 */
router.get('/search', (req, res) => {
  try {
    const keyword = req.query.q as string;
    const type = (req.query.type as string) || 'app';
    const date = (req.query.date as string) || getTodayDate();

    if (!keyword) {
      return res.status(400).json({
        error: 'Missing search keyword. Use ?q=keyword'
      });
    }

    const filename = `${type}-${date}.log`;
    const filepath = path.join(process.cwd(), 'logs', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: `Log file not found: ${filename}`
      });
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const allLines = content.split('\n').filter(line => line.trim());

    // Search in logs (case-insensitive)
    const matchedLines = allLines.filter(line =>
      line.toLowerCase().includes(keyword.toLowerCase())
    );

    const parsedLogs = matchedLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });

    logger.info('Logs searched', {
      keyword,
      type,
      date,
      matches: parsedLogs.length
    });

    res.json({
      success: true,
      data: {
        keyword,
        file: filename,
        totalLines: allLines.length,
        matches: parsedLogs.length,
        logs: parsedLogs
      }
    });
  } catch (error: any) {
    logger.error('Failed to search logs', { error: error.message });
    res.status(500).json({
      error: 'Failed to search logs',
      message: error.message
    });
  }
});

/**
 * DELETE /api/logs/:filename
 * Delete a specific log file
 */
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;

    // Validate filename
    if (!filename.endsWith('.log')) {
      return res.status(400).json({
        error: 'Invalid filename. Must end with .log'
      });
    }

    const filepath = path.join(process.cwd(), 'logs', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: `Log file not found: ${filename}`
      });
    }

    // Delete file
    fs.unlinkSync(filepath);
    logger.warn('Log file deleted', { filename });

    res.json({
      success: true,
      message: `Deleted ${filename}`
    });
  } catch (error: any) {
    logger.error('Failed to delete log file', { error: error.message });
    res.status(500).json({
      error: 'Failed to delete file',
      message: error.message
    });
  }
});

// Helper function
function getTodayDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Helsinki',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default router;


