import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FinanceOS - Master Your Money',
    template: '%s | FinanceOS',
  },
  description:
    'Comprehensive personal finance management application. Track expenses, manage budgets, set goals, and gain financial insights.',
  keywords: [
    'personal finance',
    'budget tracking',
    'expense tracker',
    'financial goals',
    'money management',
    'bank sync',
    'plaid integration',
  ],
  authors: [{ name: 'FinanceOS Team' }],
  creator: 'FinanceOS',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'FinanceOS - Master Your Money',
    description:
      'Comprehensive personal finance management application. Track expenses, manage budgets, set goals, and gain financial insights.',
    siteName: 'FinanceOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceOS - Master Your Money',
    description:
      'Comprehensive personal finance management application. Track expenses, manage budgets, set goals, and gain financial insights.',
    creator: '@financeos',
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ibmPlexSans.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
