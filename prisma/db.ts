import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 5000, // default: 2000
      timeout: 30000, // default: 5000
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
