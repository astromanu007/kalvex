import { Role, ApplicationStatus } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      maskedId: string
      role: Role
      sessionId?: string
      applicationStatus?: ApplicationStatus | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    maskedId: string
    role: Role
    applicationStatus?: ApplicationStatus | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    maskedId: string
    role: Role
    sessionId?: string
    applicationStatus?: ApplicationStatus | null
  }
}
