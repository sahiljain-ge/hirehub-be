import type { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';
import { allowedOrigins } from './config/server-config.js'; 
import AppError from './utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else if (!origin) {
        callback(null, true)
      }
      else {
        callback(new AppError('Not allowed by CORS', StatusCodes.FORBIDDEN), false); 
      }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, '../docs/API.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => res.send('Working'));
app.use('/api', apiRoutes);
app.use(errorHandler);

export default app;
