// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sushi Go Score Tracker",
  description: "Track scores for Sushi Go card game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}