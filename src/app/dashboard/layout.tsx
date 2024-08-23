import { cn } from "@/lib/utils";
export default function okRootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body 
          className={cn(
            'antialiased',
           
          )}
        >
          {children}
          </body>
      </html>
    );
  }