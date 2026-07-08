import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Set NEXT_PUBLIC_SITE_URL to the production origin so OG/canonical URLs resolve
// correctly; falls back to localhost in development.
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Sanctuaire",
  description: "Search and explore museum artworks from around the world",
  keywords: "Sanctuaire, art gallery, museum artwork, human creativity, art search, paintings, sculptures, Cleveland Museum of Art, Art Institute of Chicago",
  openGraph: {
    title: "Sanctuaire",
    description: "Search and explore museum artworks from around the world",
    siteName: "Sanctuaire",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: "Sanctuaire - Museum Art Search",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sanctuaire",
    description: "Human creativity from museums around the world",
    images: ["/android-chrome-512x512.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
