// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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
        // Implement your authentication logic here
        if (
          credentials?.username === process.env.AUTH_USERNAME &&
          credentials?.password === process.env.AUTH_PASSWORD
        ) {
          // Return user object if authentication is successful
          return { id: '1', name: 'Admin' };
        } else {
          // Return null if authentication fails
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "api/auth/signin", // Set your custom sign-in page
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
