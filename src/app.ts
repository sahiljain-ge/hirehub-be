import type { Application, Request, Response } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';

const app: Application = express();

app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, '../docs/API.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => res.send('Working'));

app.use(errorHandler);

export default app;