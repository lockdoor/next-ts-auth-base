import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import connectDB from "@/controller/connectDB";
// import type { NextApiRequest, NextApiResponse } from 'next'
import { signin } from "@/controller/user";

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    role: string;
    image: string
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        return await signin(email, password);
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      const { name, email } = user;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        await User.create({
          name,
          email,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        if (!user.role) {
          await connectDB();
          const userData = await User.findOne({ email: user.email });
          token.role = userData.role;
        } else {
          token.role = user.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
};
export default NextAuth(authOptions);
