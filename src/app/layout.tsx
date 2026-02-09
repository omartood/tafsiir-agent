import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit"
});

export const metadata: Metadata = {
  title: "Tafsiir Qur'aan AI | Somali Quran Assistant",
  description: "Tafsiirka iyo tarjumaadda Qur'aanka Kariimka ah af Soomaaliga. Weydii su'aalo ku saabsan aayadaha, suuradaha, iyo macnahooda.",
  keywords: ["Quran", "Tafsiir", "Somali", "AI", "Tafsir", "Qur'aan", "Tarjumaad", "Aayadaha"],
  authors: [{ name: "Tafsiir AI" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Tafsiir Qur'aan AI",
    description: "Tafsiirka iyo Tarjumaadda Qur'aanka af Soomaaliga",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="so" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=s==="dark"||(!s&&d);document.documentElement.classList.toggle("dark",dark);})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body 
        className={cn(
          outfit.variable, 
          "h-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary font-sans"
        )}
      >
        {children}
      </body>
    </html>
  );
}
