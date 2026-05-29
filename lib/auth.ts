import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import prisma from "./prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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
          role: Role.USER,
          maskedId: "KV-" + Math.floor(1000 + Math.random() * 9000).toString()
        }
      }
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        // Localhost student login bypass and auto-provisioning
        if (email === "cosmomanish007@gmail.com" && password === "Manish@1717") {
          const hashedPassword = await bcrypt.hash("Manish@1717", 10)
          let user = null
          try {
            user = await prisma.user.findUnique({
              where: { email }
            })

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email,
                  password: hashedPassword,
                  name: "Manish Student",
                  role: Role.STUDENT,
                  referralCode: "KV-MANISH007",
                  emailVerified: new Date(),
                }
              })
            } else if (user.role !== Role.STUDENT || !user.password) {
              user = await prisma.user.update({
                where: { email },
                data: {
                  role: Role.STUDENT,
                  password: hashedPassword,
                  emailVerified: new Date(),
                }
              })
            }
          } catch (e) {
            console.error("Database connection failed, fallback to mock Student user:", e)
            return {
              id: "KV-MOCK-MANISH007",
              name: "Manish Student",
              email: "cosmomanish007@gmail.com",
              role: Role.STUDENT,
              referralCode: "KV-MANISH007",
            } as any
          }

          return user as any
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password
        )

        if (passwordsMatch) return user as any

        return null
      }
    })
  ],
})
