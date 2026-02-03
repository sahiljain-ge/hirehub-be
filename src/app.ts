import type { Application, Request, Response } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';

//  -----  Routes Import  ----- 
import apiRouter from './routes/index.js';


const app: Application = express();

app.use(express.json());
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, '../docs/API.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => res.send('Working'));


//  -----  Routes Use  ----- 
app.use('/api/v1', apiRouter)
app.use(errorHandler);

export default app;