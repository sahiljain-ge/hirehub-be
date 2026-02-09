import type { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { CLIENT_URL } from './config/server-config.js';

//  -----  Routes Import  ----- 
import skillRouter from './routes/skills.route.js';
import jobCategoriesRouter from './routes/job-categories.routes.js';

const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, '../docs/API.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => res.send('Working'));
//  -----  Routes Use  ----- 
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/job-categories', jobCategoriesRouter);
app.use('/api', apiRoutes);
app.use(errorHandler);

export default app;
