import { PrismaClient } from '../generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from './server-config.js';

const adapter = new PrismaPg({ 
  connectionString: DATABASE_URL 
});
const db = new PrismaClient({ adapter });

export default db