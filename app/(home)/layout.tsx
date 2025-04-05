import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Athlete | Votre compagnon fitness personnel",
  description:
    "Team Athlete vous aide à atteindre vos objectifs fitness avec des programmes personnalisés, un suivi professionnel et une communauté motivante.",
  keywords:
    "fitness, entraînement personnel, coach sportif, santé, bien-être, musculation, nutrition",
  authors: [{ name: "Team Athlete" }],
  creator: "Team Athlete",
  publisher: "Team Athlete",
  robots: "index, follow",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://teamathlete.fr",
    title: "Team Athlete | Votre compagnon fitness personnel",
    description:
      "Team Athlete vous aide à atteindre vos objectifs fitness avec des programmes personnalisés, un suivi professionnel et une communauté motivante.",
    siteName: "Team Athlete",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Athlete | Votre compagnon fitness personnel",
    description:
      "Team Athlete vous aide à atteindre vos objectifs fitness avec des programmes personnalisés.",
    creator: "@teamathlete",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
