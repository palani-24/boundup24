import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { Request } from 'express';
import { AppError } from '../middleware/error';

const isVercel = process.env.VERCEL === '1';
const uploadDir = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('[MediaService] Storage directory notice:', err);
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `boundup-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file format. Only JPEG, PNG, WEBP, MP4, and WEBM are allowed.', 400) as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
});

export const getFileUrl = (filename: string): string => {
  const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};
