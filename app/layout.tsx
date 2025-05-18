import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../lib/authContext";
import "./globals.css";

// Load the pixel font
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CDG STATTRAKR",
  description: "Solo levelling typa shyt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixelFont.variable}>
      <body className="bg-[#1e1f2e] text-white">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
