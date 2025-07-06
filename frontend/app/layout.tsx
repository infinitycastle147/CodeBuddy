import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { QueryProvider } from "./context/QueryProvider";
import { QueryErrorBoundary } from "@/components/error-boundary/QueryErrorBoundary";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Buddy",
  description: "One Codebase. Infinite Perspective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <QueryErrorBoundary>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
