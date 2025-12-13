import 'prismjs/themes/prism-tomorrow.css';
import './globals.css';
import type { Metadata } from 'next';
import { Space_Mono, Raleway, Poppins, Dancing_Script } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LoadingProvider } from '@/components/providers/loading-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'], 
  variable: '--font-space-mono' 
});
const raleway = Raleway({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-raleway' 
});
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-poppins' 
});
const dancingScript = Dancing_Script({ 
  weight: ['400', '700'],
  subsets: ['latin'], 
  variable: '--font-dancing' 
});

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@syntactic_dev",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/cat_ani.gif" as="image" />
      </head>
      <body className={`${raleway.variable} ${spaceMono.variable} ${poppins.variable} ${dancingScript.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <LoadingProvider>
              <Header />
              {children}
              <Footer />
              <Toaster position="top-center" richColors />
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
