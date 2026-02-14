import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Premium, geometric sans
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartKete | Smart Shopping, Cheeky Savings",
  description: "The NZ Grocery Budget Optimiser. Eat well for less.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
