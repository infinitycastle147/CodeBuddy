import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GitHubProvider from "next-auth/providers/github";
// import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        // EmailProvider({
        //     server: process.env.EMAIL_SERVER,
        //     from: process.env.EMAIL_FROM
        // }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID || "",
        //     clientSecret: process.env.GITHUB_SECRET || "",
        // }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username" },
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials: any) {
                await dbConnect();

                // Accept either email or username for login
                const identifier = credentials.email || credentials.username;
                if (!identifier || !credentials.password) {
                    throw new Error("Email/Username and password are required");
                }

                const user = await UserModel.findOne({
                    $or: [
                        { email: identifier },
                        { username: identifier }
                    ]
                });

                if (!user) {
                    throw new Error("No user found with the provided username/email");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return user;
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
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    callbacks: {
        async session({ session, user, token }) {

            if (token) {
                session.user._id = token.sub;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
            }

            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {

            if (user) {
                token.isVerified = user.isVerified;
                token.id = user._id?.toString();
                token.username = user.username;
                token.email = user.email ?? undefined;
            }

            return token
        }
    },
}