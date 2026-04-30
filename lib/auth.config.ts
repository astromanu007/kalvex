import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard") || 
                          nextUrl.pathname.startsWith("/admin") || 
                          nextUrl.pathname.startsWith("/writer") || 
                          nextUrl.pathname.startsWith("/developer") || 
                          nextUrl.pathname.startsWith("/affiliate");
      
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // This will be overridden in lib/auth.ts with Prisma logic
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
