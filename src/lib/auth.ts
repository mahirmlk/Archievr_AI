import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

function envValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim().length > 0) return value;
  }
  return undefined;
}

const githubId = envValue("GITHUB_ID", "GITHUB_CLIENT_ID");
const githubSecret = envValue("GITHUB_SECRET", "GITHUB_CLIENT_SECRET");
const googleId = envValue("GOOGLE_CLIENT_ID", "GOOGLE_ID");
const googleSecret = envValue("GOOGLE_CLIENT_SECRET", "GOOGLE_SECRET");

const providers = [
  ...(githubId && githubSecret
    ? [
        GitHubProvider({
          clientId: githubId,
          clientSecret: githubSecret,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : []),
  ...(googleId && googleSecret
    ? [
        GoogleProvider({
          clientId: googleId,
          clientSecret: googleSecret,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : []),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export function getSession() {
  return getServerSession(authOptions);
}
