import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from '../config/env.js';
import { DB_DEFAULTS } from '@/config/constants';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaMariaDb({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  connectionLimit: DB_DEFAULTS.CONNECTION_LIMIT,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
