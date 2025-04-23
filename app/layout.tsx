import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Base URL for Open Graph images - replace if you host it elsewhere
const siteBaseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

export const metadata: Metadata = {
  // Use a template for titles, allowing pages to set their specific part
  title: {
    template: '%s | Stock News Analyzer',
    default: 'Stock News Analyzer', // Default title if template is not used by child
  },
  description: "Analyze stock market news and sentiment using AI. Get insights on stock performance, trends, and financial data.",
  // Add relevant keywords
  keywords: ['stock market', 'news analysis', 'sentiment analysis', 'AI', 'finance', 'investment', 'stock data'],
  // Add authors if applicable
  authors: [{ name: 'Your Name or Company Name', url: 'your-website-url' }], // Replace with actual details
  // Control search engine indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Basic Open Graph tags for social sharing previews
  openGraph: {
    title: 'Stock News Analyzer',
    description: 'Analyze stock market news and sentiment using AI.',
    url: siteBaseUrl,
    siteName: 'Stock News Analyzer',
    // Provide a default image for sharing (e.g., logo or banner)
    // Create an image file (e.g., public/og-image.png) and update the path
    images: [
      {
        url: `${siteBaseUrl}/og-image.png`, // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'Stock News Analyzer Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Basic Twitter card tags
  twitter: {
    card: 'summary_large_image',
    title: 'Stock News Analyzer',
    description: 'Analyze stock market news and sentiment using AI.',
    // images: [`${siteBaseUrl}/og-image.png`], // Use the same image as Open Graph
    // creator: '@yourTwitterHandle', // Add your Twitter handle if applicable
  },
  // Link to icons
  icons: {
    icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png', // Add apple touch icon if you have one
  },
  // Manifest file for PWA capabilities (optional)
  // manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
