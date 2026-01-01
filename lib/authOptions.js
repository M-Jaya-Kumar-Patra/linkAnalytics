import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const authOptions = {
  providers: [
    // ✅ GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    // ✅ EMAIL / PASSWORD LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || user.provider !== "credentials") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        };
      }
    })
  ],

  callbacks: {
  async signIn({ user, account }) {
    await connectDB();

    if (account.provider === "google") {
      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          provider: "google"
        });
      }

      // IMPORTANT: attach MongoDB id
      user.id = dbUser._id.toString();
    }

    return true;
  },

  async jwt({ token, user }) {
    if (user?.id) {
      token.id = user.id; // MongoDB _id
    }
    return token;
  },

  async session({ session, token }) {
    if (token?.id) {
      session.user.id = token.id; // MongoDB _id
    }
    return session;
  }
},


  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/auth"
  },

  secret: process.env.NEXTAUTH_SECRET
};
