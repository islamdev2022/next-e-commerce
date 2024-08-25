import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import  SessionProvider  from "@/components/SessionProvider";
import { redirect } from "next/navigation";
export default async function okRootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const session = await getServerSession();
  if (!session) {
    redirect("../api/auth/signin");
  }
    return (
      <html lang="en">
       
          <SessionProvider session={session}>
          {children}
          </SessionProvider>
         
      </html>
    );
  }