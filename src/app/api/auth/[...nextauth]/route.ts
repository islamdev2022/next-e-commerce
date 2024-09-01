// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          return null;
        }
      
        const admin = await prisma.admin.findUnique({
          where: { name: credentials.username },
        });
      
        console.log("Fetched admin:", admin); // Debugging log
      
        if (!admin) {
          console.log("No admin found with the given username");
          throw new Error("Invalid username or password");
        }
      
        if (credentials.password === admin.password) {
          console.log("Password matched");
          return { id: admin.id.toString(), name: admin.name ?? 'Admin' };
        } else {
          console.log("Password did not match");
          throw new Error("Invalid username or password");
        }
      }
      
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/api/auth/signin", // Set your custom sign-in page
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
