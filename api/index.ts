import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Root & Health Check routes (handles /, /api, /health, /api/health)
app.get(['/', '/api', '/health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BOUNDUP API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Lazy load API routes on demand
app.use('/api', (req, res, next) => {
  try {
    const routes = require('../apps/api/src/routes').default;
    const { connectDB } = require('../apps/api/src/config/db');
    connectDB().catch(() => {});
    return routes(req, res, next);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'API Route Error' });
  }
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
