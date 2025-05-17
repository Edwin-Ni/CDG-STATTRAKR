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
  title: "CDG Stat Tracker",
  description: "Some friendly competition :)",
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
      >
        {/* <header className="bg-gray-900 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">CDG Stat Tracker</h1>
            <p className="text-sm">Some friendly competition :)</p>
          </div>
        </header> */}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
