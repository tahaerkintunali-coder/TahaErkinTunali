import type { Metadata } from "next";
import "./globals.css";
import "./interactions.css";
import "./engine-study.css";
import "./portfolio-projects.css";
import "./contact-links.css";

export const metadata: Metadata = {
  title: "Taha Erkin Tunalı — Engineering in Motion",
  description: "Mechanical engineer at Ford Otosan. Powertrain and engine brake systems, thermal management, CAE simulation, and published research in electric vehicle efficiency.",
  icons: {
    icon: "/TahaErkinTunali/favicon.svg",
    shortcut: "/TahaErkinTunali/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/TahaErkinTunali/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
