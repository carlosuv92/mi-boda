import type { Metadata } from "next";
import { Cormorant_Garamond, Tangerine, Courgette, Noto_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["italic"],
  display: "swap",
});

const dancingScript = Tangerine({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const courgette = Courgette({
  variable: "--font-courgette",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mi-boda-one.vercel.app'),
  title: "Felipe y Lilian - Nuestra Boda",
  description: "Estás invitado a nuestra boda. Celebramos nuestro amor el 26 de septiembre de 2026.",
  openGraph: {
    title: "Felipe y Lilian - Nuestra Boda",
    description: "Estás invitado a nuestra boda. Celebramos nuestro amor el 26 de septiembre de 2026.",
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
      className={`${cormorant.variable} ${dancingScript.variable} ${courgette.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
