import { PrismaClient } from '@prisma/client'

// Final Fix for Prisma 7 + Next.js 16 (Turbopack)
// This ensures a database URL exists during build-time analysis 
// without breaking the Prisma constructor types.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/dummy"
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
