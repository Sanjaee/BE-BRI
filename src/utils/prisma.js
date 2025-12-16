import { PrismaClient } from '@prisma/client';

// Prisma 7 automatically reads connection URL from prisma.config.ts
// PrismaClient will use the configuration defined there
const prisma = new PrismaClient();

export default prisma;
