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
    adapter: MongoDBAdapter(client),
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
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
        }
    },
}