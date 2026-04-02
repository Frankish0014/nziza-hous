import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

if (env.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api', routes);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(errorMiddleware);

export default app;

