import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import  SessionProvider  from "@/components/SessionProvider";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})
const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})
export const metadata: Metadata = {
  title: "Anime Figures Store", 
  description: "The best place to buy anime figures online 🎉, with a wide range of figures from your favorite anime series.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  const cookieStore = cookies()
  console.log("cookies");
  const posthogCookie = cookieStore.get('ph_phc_JHXDEpCWQRLpHDZe6tMJdo4lVl62hy1P8n13cvMcqDU_posthog');

  // Step 2: Parse the JSON string
  const posthogData = posthogCookie ? JSON.parse(posthogCookie.value) : null;

  // Step 3: Access the session ID from the `$sesid` array
  const sessionId = posthogData?.$sesid?.[1];

  console.log('Session ID:', sessionId);
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <SessionProvider session={session}>

        {children}
        </SessionProvider> 
        <Toaster />
        </body>
    </html>
  );
}
