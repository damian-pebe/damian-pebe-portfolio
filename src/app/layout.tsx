import type { Metadata } from "next";
import {
  Cherry_Bomb_One,
  Geist,
  Geist_Mono,
  Lobster,
  Plaster,
  Poppins,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const plaster = Plaster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plaster",
});
export const metadata: Metadata = {
  title: "Damian Pebe",
  description: "Damian Pebe's Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lobster.variable} ${poppins.variable} ${plaster.variable} antialiased`}
      >
        <div
          className="absolute inset-0 blur-sm -z-10 bg-white"
          style={{
            background: `linear-gradient(17deg,rgba(242, 242, 242, 1) 0%, rgba(209, 209, 209, 1) 12%, rgba(242, 242, 242, 1) 24%, rgba(209, 209, 209, 1) 36%, rgba(242, 242, 242, 1) 50%, rgba(209, 209, 209, 1) 64%, rgba(242, 242, 242, 1) 77%, rgba(209, 209, 209, 1) 88%, rgba(242, 242, 242, 1) 100%)`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
