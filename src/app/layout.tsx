import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Developer Groups Madurai | Community for Madurai’s Tech Minds",
  description:
    "Where local developers meet to build, share, and scale with Google tech. Welcome to Google Developer Groups Madurai.",
  keywords: [
    "GDG Madurai",
    "Google Developer Groups",
    "Google Developers Madurai",
    "Madurai Tech Community",
    "DevFest Madurai",
  ],
  authors: [{ name: "GDG Madurai Community" }],
  icons: {
    icon: "/images/GDG_Logo.png",
    shortcut: "/images/GDG_Logo.png",
    apple: "/images/GDG_Logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Google+Sans+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/GDG_Logo.png" />
      </head>
      <body className="antialiased min-h-screen bg-white text-[#202124] selection:bg-[#4285F4]/20 selection:text-[#202124]">
        {children}
      </body>
    </html>
  );
}
