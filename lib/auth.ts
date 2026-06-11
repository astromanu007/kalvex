import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import prisma from "./prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { headers } from "next/headers"

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

        // Predefined roles bypass credentials to assist with local testing (even when DB is down)
        const bypassUsers = [
          {
            email: "cosmomanish007@gmail.com",
            password: "Manish@1717",
            name: "Manish Student",
            role: Role.STUDENT,
            referralCode: "KV-MANISH007",
          },
          {
            email: "manishdhatrak1121@gmail.com",
            password: "Manish@1717",
            name: "Manish Admin",
            role: Role.ADMIN,
            referralCode: "KV-ADMIN1121",
          },
          {
            email: "manish@gmail.com",
            password: "ManishDev123!",
            name: "Manish Developer",
            role: Role.DEVELOPER,
            referralCode: "KV-MANISH",
          },
          {
            email: "cosmo@gmail.com",
            password: "CosmoWriter123!",
            name: "Cosmo Writer",
            role: Role.WRITER,
            referralCode: "KV-COSMO",
          },
          {
            email: "student@example.com",
            password: "StudentPass123!",
            name: "Student User",
            role: Role.STUDENT,
            referralCode: "KV-STUDENT",
          },
          {
            email: "jamesbond007@gmail.com",
            password: "JamesBond007!",
            name: "James Bond",
            role: Role.DEVELOPER,
            referralCode: "KV-BOND",
          },
        ]

        const matchedBypass = bypassUsers.find(
          (u) => u.email === email && u.password === password
        )

        if (matchedBypass) {
          const hashedPassword = await bcrypt.hash(password, 10)
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
                  name: matchedBypass.name,
                  role: matchedBypass.role,
                  referralCode: matchedBypass.referralCode,
                  emailVerified: new Date(),
                }
              })
            } else if (user.role !== matchedBypass.role || !user.password) {
              user = await prisma.user.update({
                where: { email },
                data: {
                  role: matchedBypass.role,
                  password: hashedPassword,
                  emailVerified: new Date(),
                }
              })
            }
          } catch (e) {
            console.error(`Database connection failed, fallback to mock ${matchedBypass.role} user:`, e)
            return {
              id: `KV-MOCK-${matchedBypass.referralCode}`,
              name: matchedBypass.name,
              email: matchedBypass.email,
              role: matchedBypass.role,
              referralCode: matchedBypass.referralCode,
            } as any
          }

          return user as any
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          )

          if (passwordsMatch) {
            return user as any;
          } else {
            // Log failed login attempt
            let ipAddress = null;
            let userAgent = null;
            try {
              const headersList = await headers();
              ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
              userAgent = headersList.get("user-agent");
            } catch (err) {}

            try {
              await prisma.auditLog.create({
                data: {
                  userId: user.id,
                  role: user.role,
                  action: "FAILED_LOGIN_ATTEMPT",
                  ipAddress,
                  userAgent,
                  metadata: { reason: "Incorrect password" }
                }
              });
            } catch (err) {
              console.error("Failed to write failed login audit log:", err);
            }
          }
        } catch (e) {
          console.error("Credentials authorization database error:", e)
        }

        return null
      }
    })
  ],
  events: {
    async signIn({ user }) {
      if (user && user.id) {
        let ipAddress = null;
        let userAgent = null;
        try {
          const headersList = await headers();
          ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
          userAgent = headersList.get("user-agent");
        } catch (err) {}

        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              role: (user as any).role || Role.USER,
              action: "LOGIN",
              ipAddress,
              userAgent,
            }
          });
        } catch (err) {
          console.error("Failed to write signIn audit log:", err);
        }
      }
    },
    async signOut(message: any) {
      const { session, token } = message;
      const userId = session?.user?.id || token?.sub || token?.id;
      if (userId) {
        let ipAddress = null;
        let userAgent = null;
        try {
          const headersList = await headers();
          ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
          userAgent = headersList.get("user-agent");
        } catch (err) {}

        try {
          await prisma.auditLog.create({
            data: {
              userId,
              role: (session?.user as any)?.role || (token as any)?.role || Role.USER,
              action: "LOGOUT",
              ipAddress,
              userAgent,
            }
          });
        } catch (err) {
          console.error("Failed to write signOut audit log:", err);
        }
      }
    }
  }
})
