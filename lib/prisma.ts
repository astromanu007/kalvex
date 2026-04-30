import { PrismaClient } from '@prisma/client'

// Use a simple singleton without any constructor overrides to avoid
// type and runtime validation errors in Prisma 7 + Turbopack.
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
