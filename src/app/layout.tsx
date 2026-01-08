import "./globals.css";
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {NuqsAdapter} from "nuqs/adapters/next/app";

import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import Header from "@/components/header";
import {ImpersonationIndicator} from "@/features/auth/components/impersonation-indicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Project Reviews",
    default: "Project Reviews",
  },
  description: "Project reviews ai sass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <Header />
            <main>
              {children}
              <ImpersonationIndicator />
            </main>
            <Toaster closeButton={true} position="top-right" />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
