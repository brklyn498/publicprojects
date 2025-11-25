import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import ProfileProvider from "@/components/profile/ProfileProvider";

export const metadata: Metadata = {
  title: "GameHub - Play & Track Your Progress",
  description: "A collection of fun games with player profiles and achievements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-warm-gray dark:bg-dark-bg min-h-screen transition-colors duration-300">
        <ProfileProvider>
          <ThemeToggle />
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
