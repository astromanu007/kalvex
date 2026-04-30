import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import prisma from "./prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs" // Need to install bcryptjs

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Assuming new Google sign-ups are USER by default
          role: Role.USER,
          // maskedId gets generated in DB when creating user, or we mock it here if needed
          maskedId: "KV-" + Math.floor(1000 + Math.random() * 9000).toString()
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (passwordsMatch) return user

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.id as string
        token.role = user.role as Role
        token.maskedId = user.maskedId as string
        token.applicationStatus = user.applicationStatus
      }
      
      // Allow session updates (e.g. upgrading role)
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as Role
        session.user.maskedId = token.maskedId as string
        session.user.applicationStatus = token.applicationStatus as "PENDING" | "APPROVED" | "REJECTED" | null
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
})
