import { PrismaClient } from '@prisma/client'

// Use a singleton pattern to ensure only one Prisma client is created
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Prisma 7 requirement: ensure we have a URL during build-time analysis
    datasourceUrl: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
