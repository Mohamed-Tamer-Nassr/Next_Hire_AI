import ClientWrapper from "@/components/ClientWrapper";
import Footer from "@/components/footer/Footer";
import HeaderAccouncement from "@/components/header/HeaderAccouncement";
import Navbar from "@/components/header/Navbar";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import HeroProvider from "./HeroUIProvider";

// ✅ Import Plus Jakarta Sans instead of Geist
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Adjust weights as needed
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | NextHire AI",
    default: "NextHire AI - The Next Generation of Smart Hiring",
  },
  description:
    "AI-powered interview preparation and recruitment for the next generation of professionals.",
  icons: {
    icon: "/LogoIcon.png",
    shortcut: "/LogoIcon.png",
    apple: "/LogoIcon.png",
  },
  creator: "Mohamed Tamer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <Toaster />
          <HeroProvider
            themeProps={{ attribute: "class", defaultTheme: "dark" }}
          >
            <HeaderAccouncement />
            <div className="flex flex-col relative h-screen w-full">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-4 grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-4">
                <Footer />
              </footer>
            </div>
          </HeroProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
