import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from './server-config.js';

const adapter = new PrismaPg({ 
  connectionString: DATABASE_URL 
});
const db = new PrismaClient({ adapter });

export default db