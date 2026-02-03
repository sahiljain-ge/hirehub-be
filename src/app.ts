import type { Application, Request, Response } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import morgan from 'morgan';
import cors from 'cors';

//  -----  Routes Import  ----- 
import skillRouter from './routes/skills.route.js';
import jobCategoriesRouter from './routes/job-categories.routes.js';


const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, '../docs/API.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => res.send('Working'));


//  -----  Routes Use  ----- 
app.use('/api/v1/skills', skillRouter)
app.use('/api/v1/job-categories', jobCategoriesRouter)

app.use(errorHandler);

export default app;