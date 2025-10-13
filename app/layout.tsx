import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const geistSans = localFont({
  src: [
    {
      path: "../public/assets/fonts/Geist-VariableFont_wght.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: [
    {
      path: "../public/assets/fonts/GeistMono-VariableFont_wght.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Fenmiao Tracker",
  description:
    "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
