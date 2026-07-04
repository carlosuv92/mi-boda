import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Felipe y Lilian - Nuestra Boda",
  description: "Estás invitado a nuestra boda. Celebramos nuestro amor el 15 de abril de 2027.",
  openGraph: {
    title: "Felipe y Lilian - Nuestra Boda",
    description: "Estás invitado a nuestra boda. Celebramos nuestro amor el 15 de abril de 2027.",
    type: "website",
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: '/og',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${greatVibes.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
