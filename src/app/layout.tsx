import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "./context/AuthProvider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Footer from "@/components/footer";
import { CartCountProvider } from "./context/CartProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Harvest Hub",
    default: "Harvest Hub",
  },
  description: "Connecting farmers, buyers, and experts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartCountProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3500}
            />
            <Analytics />
          </CartCountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
