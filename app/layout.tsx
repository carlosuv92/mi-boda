import type { Metadata } from "next";
import { Cormorant_Garamond, Tangerine } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const tangerine = Tangerine({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mi-boda-one.vercel.app'),
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
      className={`${cormorant.variable} ${tangerine.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
