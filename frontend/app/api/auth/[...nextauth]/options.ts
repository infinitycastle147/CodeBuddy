import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/user";

const client = new MongoClient(process.env.MONGODB_URI!);

export const authOptions: NextAuthOptions = {
    // Remove adapter for JWT strategy to avoid account linking conflicts
    // adapter: MongoDBAdapter(client),
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
                    placeholder: "Enter your email or username" 
                },
                password: { 
                    label: "Password", 
                    type: "password", 
                    placeholder: "Enter your password" 
                }
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
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with the provided credentials");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.username,
                        username: user.username,
                        isVerified: user.isVerified || false,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Authentication failed");
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                try {
                    await dbConnect();
                    
                    // Check if user exists by email
                    const existingUser = await UserModel.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create new user for GitHub OAuth
                        const newUser = new UserModel({
                            username: user.username || user.name?.toLowerCase().replace(/\s+/g, '') || `github_${account.providerAccountId}`,
                            email: user.email,
                            image: user.image,
                            isVerified: true,
                            accounts: [{
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                type: account.type,
                            }]
                        });
                        await newUser.save();
                    } else {
                        // Update existing user with GitHub account info if not already linked
                        const hasGitHubAccount = existingUser.accounts?.some(
                            acc => acc.provider === 'github' && acc.providerAccountId === account.providerAccountId
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
                    }
                    return true;
                } catch (error) {
                    console.error("Error during GitHub sign-in:", error);
                    return false;
                }
            }
            return true;
        }
    },
}