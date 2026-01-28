import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { User } from "@prisma/client";
export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name:"credentials",
      credentials:{
          email:{label:"Email",type:"email"},
          password:{label:"Password",type:"password"}
      },
      async authorize(credentials: any) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (!user || !user.password) {
          return null;
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
          return null;
        }
        return user as User;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Runs at login
  
      if (user) {
        // Credentials login already returns DB user
        token.userId = user.id;
      }
  
      // OAuth login (Google/GitHub)
      if (account && account.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
  
        if (existingUser) {
          token.userId = existingUser.id;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              username: token.email!,
              image: token.picture,
            },
          });
          token.userId = newUser.id;
        }
      }
  
      return token;
    },
  
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.userId as string; // ✅ Always DB ID
      }
      return session;
    },
  }
  
  // callbacks: {
  //   async jwt({ token, account, profile }: any) {
  //     token.UserId = token.sub;
  //     return token;
  //   },
  //   async session({ session, token, user }: any) {
  //     session.user.id = token.UserId;
  //     return session;
  //   },
  //   async signIn({ user, account, profile }: any) {
  //     const userData = await prisma.user.findFirst({
  //       where: {
  //         id: user.id,
  //       },
  //     });
  //     if (!userData) {
  //       const data = await prisma.user.create({
  //         data: {
  //           id: user.id,
  //           email: user.email,
  //           username: user.email,
  //           image: user.image,
  //         },
  //       });
  //     }
  //     return true;
  //   },
  // },
};

