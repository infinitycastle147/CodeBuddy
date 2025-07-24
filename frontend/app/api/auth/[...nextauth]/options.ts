import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      async profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "user",
          isVerified: profile.email ? true : false,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email/Username and password are required");
        }

        try {
          await dbConnect();

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with the provided credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            image: user.image,
            isVerified: user.isVerified || false,
            role: user.role || 'user', 
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout", 
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day instead of 30 days for security
    updateAge: 2 * 60 * 60, // Update session every 2 hours
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.sub = user.id; 
        token.picture = user.image;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.id = user.id; // Keep this for backwards compatibility
        token.name = user.name;
        token.role = user.role || 'user'; // 🔥 ADD THIS - Store role in JWT
      }

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.expires_at = account.expires_at;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string; // 🔥 ADD THIS - Include role in session
        
        // OAuth tokens (optional - for calling external APIs)
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
        session.expires_at = token.expires_at as number;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          await dbConnect();

          // Check if user exists by email
          const existingUser = await UserModel.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for GitHub OAuth
            const newUser = new UserModel({
              username:
                user.username ||
                user.name?.toLowerCase().replace(/\s+/g, "") ||
                `github_${account.providerAccountId}`,
              email: user.email,
              name: user.name,
              image: user.image,
              isVerified: true,
              role: 'user',
              accounts: [
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                },
              ],
            });
            
            const savedUser = await newUser.save();
            
            // Update user object with database data
            user.id = savedUser._id.toString();
            user.role = savedUser.role;
            user.name = savedUser.name;
            
          } else {
            // Update existing user with GitHub account info if not already linked
            const hasGitHubAccount = existingUser.accounts?.some(
              (acc: { provider: string; providerAccountId: string }) =>
                acc.provider === "github" &&
                acc.providerAccountId === account.providerAccountId
            );

            if (!hasGitHubAccount) {
              existingUser.accounts = existingUser.accounts || [];
              existingUser.accounts.push({
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
              });

              // Update image if not set
              if (!existingUser.image && user.image) {
                existingUser.image = user.image;
              }

              await existingUser.save();
            }
            
            // Update user object with existing database data
            user.id = existingUser._id.toString();
            user.role = existingUser.role || 'user';
            user.name = existingUser.name;
            user.username = existingUser.username;
            user.isVerified = existingUser.isVerified;
          }
          return true;
        } catch (error) {
          console.error("Error during GitHub sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
};