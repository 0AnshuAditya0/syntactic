import 'prismjs/themes/prism-tomorrow.css';
import './globals.css';
import type { Metadata } from 'next';
import { Space_Mono, Raleway, Poppins } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Syntactic - Code Playground & Developer Blog',
  description: 'Write, run, and share code. Create interactive blog posts with live code examples.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} ${spaceMono.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
