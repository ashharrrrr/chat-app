import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Navbar />
          {children}
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
