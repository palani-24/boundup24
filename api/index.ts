import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../apps/api/src/routes';
import { connectDB } from '../apps/api/src/config/db';
import { errorHandler } from '../apps/api/src/middleware/error';

const app = express();

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (_) {}
  next();
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get(['/', '/health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BOUNDUP API (Serverless)',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);
app.use(errorHandler);

export default function handler(req: any, res: any) {
  return app(req, res);
}
