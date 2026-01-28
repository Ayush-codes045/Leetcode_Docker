// import Credentials from "next-auth/providers/credentials";
// import { prisma } from "./db";
// import bcryptjs from "bcryptjs";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import { User } from "@prisma/client";
// export const NEXT_AUTH = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//     Credentials({
//       name:"credentials",
//       credentials:{
//           email:{label:"Email",type:"email"},
//           password:{label:"Password",type:"password"}
//       },
//       async authorize(credentials: any) {
//         const email = credentials.email;
//         const password = credentials.password;
//         const user = await prisma.user.findFirst({
//           where: {
//             email,
//           },
//         });
//         if (!user || !user.password) {
//           return null;
//         }
//         const isMatch = await bcryptjs.compare(password, user.password);
//         if (!isMatch) {
//           return null;
//         }
//         return user as User;
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/",
//     error: "/signin",
//   },
//   callbacks: {
//     async jwt({ token, account, profile }: any) {
//       token.UserId = token.sub;
//       return token;
//     },
//     async session({ session, token, user }: any) {
//       session.user.id = token.UserId;
//       return session;
//     },
//     async signIn({ user, account, profile }: any) {
//       const userData = await prisma.user.findFirst({
//         where: {
//           id: user.id,
//         },
//       });
//       if (!userData) {
//         const data = await prisma.user.create({
//           data: {
//             id: user.id,
//             email: user.email,
//             username: user.email,
//             image: user.image,
//           },
//         });
//       }
//       return true;
//     },
//   },
// };

import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { User } from "@prisma/client";

const providers: any[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials: any) {
      try {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email;
        const password = credentials.password;
        
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        
        if (!user || !user.password) {
          console.log("User not found or no password set");
          return null;
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);
        
        if (!isMatch) {
          console.log("Password mismatch");
          return null;
        }
        
        console.log("User authenticated successfully:", user.email);
        return user as User;
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    },
  }),
];

// Only add Google provider if credentials are properly set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID.trim() !== '' && process.env.GOOGLE_CLIENT_SECRET.trim() !== '') {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Only add GitHub provider if credentials are properly set
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET &&
    process.env.GITHUB_CLIENT_ID.trim() !== '' && process.env.GITHUB_CLIENT_SECRET.trim() !== '') {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const NEXT_AUTH = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      token.UserId = token.sub;
      return token;
    },
    async session({ session, token, user }: any) {
      if (session?.user) {
        session.user.id = token.UserId;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      try {
        // For OAuth providers, ensure user exists in database
        if (account?.provider !== 'credentials') {
          const userData = await prisma.user.findFirst({
            where: {
              id: user.id,
            },
          });
          
          if (!userData) {
            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email,
                username: user.name || user.email,
                image: user.image,
              },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
  },
};
