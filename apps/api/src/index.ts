import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { setupSocketHandlers } from './sockets/socketHandler';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });
dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') });
dotenv.config();

const app = express();
const server = http.createServer(app);

// Conditionally setup Socket.IO for non-serverless environments
let io: Server | null = null;
if (process.env.VERCEL !== '1') {
  try {
    io = new Server(server, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });
    setupSocketHandlers(io);
  } catch (err) {
    console.warn('[BOUNDUP API] Socket.IO Notice:', err);
  }
}

app.set('io', io);

// Synchronously await DB Connection for Serverless requests
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[BOUNDUP API] DB Middleware Error:', err);
  }
  next();
});

// Security & Utility Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Health Check Endpoints
app.get(['/health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BOUNDUP API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`[BOUNDUP API] Server listening on port ${PORT}`);
    });
  });
}

export default app;
