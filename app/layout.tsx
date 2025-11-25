import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Crossword Puzzle",
  description: "A beautiful, NYT-inspired crossword puzzle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-warm-gray dark:bg-dark-bg min-h-screen transition-colors duration-300">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
