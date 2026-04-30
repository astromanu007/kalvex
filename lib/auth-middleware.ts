import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// This exported 'auth' will be used in middleware.ts
// It is Edge-compatible because it doesn't import Prisma.
export const { auth } = NextAuth(authConfig)
