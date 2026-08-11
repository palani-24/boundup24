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

const clientUrl = process.env.CLIENT_URL || '*';

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

setupSocketHandlers(io);

// Make socket.io instance accessible in controllers via req.app.get('io')
app.set('io', io);

// Auto-connect DB middleware for Serverless & standalone environments
app.use(async (_req, _res, next) => {
  await connectDB();
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
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Serve static uploads
const uploadsDir = path.join(process.cwd(), '..', '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', routes);

// Base Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BOUNDUP API', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'BOUNDUP API', timestamp: new Date().toISOString() });
});

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
