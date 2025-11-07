// app/api/auth/[...nextauth]/route.ts
import dbConnect from "@/backend/config/dbConnect";
import { User } from "@/backend/config/models/user.model";
import { checkLoginRateLimit } from "@/backend/middleware/rateLimiter";
import { securityLogger } from "@/backend/utils/securityLogger";
import NextAuth, {
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// ✅ Extended type definitions with subscription
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      emailVerified: boolean;
      profilePicture: {
        id: string;
        url: string | null;
      };
      subscription?: {
        id: string;
        status: string;
        customerId: string;
        currentPeriodEnd: Date | null;
        startDate: Date | null;
      };
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    roles: string[];
    emailVerified: boolean;
    passwordChangedAt?: Date;
    profilePicture: {
      id: string;
      url: string | null;
    };
    subscription?: {
      id: string;
      status: string;
      customerId: string;
      currentPeriodEnd: Date | null;
      startDate: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    emailVerified: boolean;
    passwordChangedAt?: Date;
    profilePicture: {
      id: string;
      url: string | null;
    };
    subscription?: {
      id: string;
      status: string;
      customerId: string;
      currentPeriodEnd: Date | null;
      startDate: Date | null;
    };
  }
}

// ✅ SOLUTION 1: Keep authOptions internal (not exported)
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        await dbConnect();
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Please enter email and password");
        }

        const rateLimitCheck = await checkLoginRateLimit(email);
        if (!rateLimitCheck.allowed) {
          securityLogger.logFailedAuthentication(
            email,
            rateLimitCheck.error || "Login rate limit exceeded"
          );
          throw new Error(
            rateLimitCheck.error || "Too many login attempts. Try again later."
          );
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          securityLogger.logFailedAuthentication(
            email,
            "User not found during login attempt"
          );
          throw new Error("Invalid Email or Password");
        }

        const isPassword = await user.comparePassword(password);

        if (!isPassword) {
          securityLogger.logFailedAuthentication(
            email,
            "Invalid password provided"
          );
          throw new Error("Invalid Email or Password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email to log in");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          roles: user.roles,
          passwordChangedAt: user.passwordChangedAt,
          profilePicture: user.profilePicture,
          subscription: user.subscription
            ? {
                id: user.subscription.id,
                status: user.subscription.status,
                customerId: user.subscription.customerId,
                currentPeriodEnd: user.subscription.currentPeriodEnd,
                startDate: user.subscription.startDate,
              }
            : undefined,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await dbConnect();

      // A. Handle Session Update (from update() call)
      if (trigger === "update") {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.roles = dbUser.roles;
          token.passwordChangedAt = dbUser.passwordChangedAt;
          token.profilePicture = dbUser.profilePicture;
          token.emailVerified = dbUser.emailVerified;

          if (session?.subscription) {
            token.subscription = session.subscription;
          } else if (dbUser.subscription) {
            token.subscription = {
              id: dbUser.subscription.id,
              status: dbUser.subscription.status,
              customerId: dbUser.subscription.customerId,
              currentPeriodEnd: dbUser.subscription.currentPeriodEnd,
              startDate: dbUser.subscription.startDate,
            };
          }
        }
        return token;
      }

      // B. Handle Initial Sign-In
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.emailVerified = dbUser.emailVerified;
          token.roles = dbUser.roles;
          token.profilePicture = dbUser.profilePicture;
          token.passwordChangedAt = dbUser.passwordChangedAt;

          if (dbUser.subscription) {
            token.subscription = {
              id: dbUser.subscription.id,
              status: dbUser.subscription.status,
              customerId: dbUser.subscription.customerId,
              currentPeriodEnd: dbUser.subscription.currentPeriodEnd,
              startDate: dbUser.subscription.startDate,
            };
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      try {
        await dbConnect();

        // A. Password Change Security Check
        if (token.passwordChangedAt) {
          const dbUser = await User.findOne({ email: token.email }).select(
            "passwordChangedAt"
          );

          if (
            dbUser?.passwordChangedAt &&
            token.passwordChangedAt &&
            new Date(token.passwordChangedAt) <
              new Date(dbUser.passwordChangedAt)
          ) {
            throw new Error(
              "Your session has expired due to a password change. Please log in again."
            );
          }
        }

        // B. Expose Custom Data to Frontend
        if (session.user && token) {
          session.user.id = token.id;
          session.user.roles = token.roles;
          session.user.profilePicture = token.profilePicture;
          session.user.emailVerified = token.emailVerified;

          if (token.subscription) {
            session.user.subscription = token.subscription;
          }
        }

        return session;
      } catch (error: any) {
        console.error("Session callback error:", error);
        throw error;
      }
    },

    async signIn({ user, account }) {
      try {
        await dbConnect();

        if (account?.provider !== "credentials") {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              emailVerified: true,
              profilePicture: {
                url: user.image,
              },
              authProviders: [
                {
                  provider: account?.provider!,
                  providerId: account?.providerAccountId!,
                },
              ],
            });
          } else {
            const hasProvider = existingUser.authProviders.some(
              (p: any) => p.provider === account?.provider
            );

            if (!hasProvider) {
              existingUser.authProviders.push({
                provider: account?.provider!,
                providerId: account?.providerAccountId!,
              });
              existingUser.emailVerified = true;
              await existingUser.save();
            }
          }
        }

        return true;
      } catch (error: any) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// ✅ Only export GET and POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
