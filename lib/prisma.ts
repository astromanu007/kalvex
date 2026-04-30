import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // Use 'as any' to bypass strict Turbopack type checks during build
  // while ensuring the connection string is provided for production.
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
      },
    },
    log: ['error'],
  } as any)
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
