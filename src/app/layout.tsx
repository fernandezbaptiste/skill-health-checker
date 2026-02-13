import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Health Checker — Rate your Tessl skill",
  description:
    "Paste a GitHub link to a tessl skill and instantly see your eval score with actionable improvement guidance.",
  openGraph: {
    title: "Skill Health Checker",
    description:
      "Paste a GitHub link to a tessl skill and instantly see your eval score.",
    type: "website",
    siteName: "Skill Health Checker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Health Checker",
    description:
      "Paste a GitHub link to a tessl skill and instantly see your eval score.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-mono antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
