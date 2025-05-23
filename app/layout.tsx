import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <body className={`relative inset-0 ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div 
        className="absolute inset-0 blur-lg -z-10"
        style={{
          background: ` linear-gradient(17deg,rgba(242, 242, 242, 1) 0%, rgba(209, 209, 209, 1) 12%, rgba(242, 242, 242, 1) 24%, rgba(209, 209, 209, 1) 36%, rgba(242, 242, 242, 1) 50%, rgba(209, 209, 209, 1) 64%, rgba(242, 242, 242, 1) 77%, rgba(209, 209, 209, 1) 88%, rgba(242, 242, 242, 1) 100%)`,
        }}
      />
      {children}
    </body>
  </html>
);

}
