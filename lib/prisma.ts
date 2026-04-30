import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Prisma 7 specific: datasourceUrl (singular) is the correct key for direct overrides
    datasourceUrl: process.env.DATABASE_URL,
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
