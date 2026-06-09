import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectDB, User } from "@chat/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if(!email || !password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: email.toLowerCase(),
        });

        if(!user) {
          return null;
        }

        const validPassword = await compare(
          password,
          user.password
        );

        if(!validPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        token.id = user.id;
        token.username = user.username;
      }


      return token;
    },

    async session({ session, token }) {
      if(session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }

      return session;
    }
  }
}) 
