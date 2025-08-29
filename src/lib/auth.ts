import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@/prisma/generated/prisma";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            logger.auth.loginAttempt("unknown", false, {
              reason: "missing_credentials",
            });
            return null;
          }

          // Sanitize email
          const email = credentials.email.toLowerCase().trim();

          // Find user in database
          logger.database.query("findUnique", "User", { email });
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            logger.auth.loginAttempt(email, false, {
              reason: "user_not_found_or_no_password",
            });
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            logger.auth.loginAttempt(email, false, {
              reason: "invalid_password",
              userId: user.id,
            });
            return null;
          }

          // Successful login
          logger.auth.loginAttempt(email, true, {
            userId: user.id,
            role: user.role,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image ?? null,
            role: user.role,
          };
        } catch (error) {
          logger.database.error("authorize", "User", error, {
            email: credentials?.email || "unknown",
          });
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as "FARMER" | "CUSTOMER" | "ADMIN";
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle OAuth users who need role selection
      if (url.includes("/setup-role")) {
        return url;
      }

      // Default redirect
      return baseUrl;
    },

    async signIn({ user, account }) {
      // For OAuth providers, we need to handle new vs returning users
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              role: true,
              farmName: true,
              farmLocation: true,
              createdAt: true,
            },
          });

          // If this is a completely new user (first OAuth login)
          if (!existingUser) {
            logger.info(
              "New OAuth user detected, will redirect to role setup",
              {
                email: user.email,
                provider: account.provider,
                action: "new_oauth_user",
              }
            );
            // The user will be created by Prisma adapter,
            // but we'll catch them in the redirect callback
            return true;
          }

          // Existing user - check if they need role setup
          const userNeedsRoleSetup =
            existingUser.role === "CUSTOMER" &&
            !existingUser.farmName &&
            !existingUser.farmLocation;

          if (userNeedsRoleSetup) {
            logger.info("OAuth user needs role setup", {
              userId: existingUser.id,
              email: user.email,
              action: "oauth_role_setup_needed",
            });
          }
        } catch (error) {
          logger.error("Error checking user role during OAuth sign in", error);
        }
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);
