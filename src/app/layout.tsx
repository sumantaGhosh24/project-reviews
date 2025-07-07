import {cn} from "@/lib/utils";
import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";

import "./globals.css";

import {Toaster} from "@/components/ui/sonner";

import {ThemeProvider} from "./_components/theme-provider";
import Header from "./_components/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AI Agent",
    default: "AI Agent",
  },
  description: "AI Agent website using next js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
