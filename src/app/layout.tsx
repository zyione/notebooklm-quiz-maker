import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizForge — PDF to Flashcards",
  description:
    "Upload any PDF and instantly generate Anki-style flashcards using AI. Study smarter, not harder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Decorative background blobs */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
