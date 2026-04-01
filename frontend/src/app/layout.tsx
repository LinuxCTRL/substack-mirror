import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const Operator = localFont({
  src: './../../public/OperatorMonoLig-Book.otf'
})
export const metadata: Metadata = {
  title: "Substack Mirror",
  description: "Your personal Substack archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", Operator.className)}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
