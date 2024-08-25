import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt" as const, // Specify that JWT should be used
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Use a secure, random secret
  },
  debug: true, // Enable debug mode for more detailed error messages
};

// Export NextAuth handler for both GET and POST requests
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
