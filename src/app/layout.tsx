import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: {
    template: '%s | Zwandude Studio',
    default: 'Zwandude Studio — Videography, Editing & Talent',
  },
  description:
    'Zwandude Studio is the portfolio of Azwan — a Malaysian videographer, video editor, and on-screen talent. Browse projects across videography, editing, and presenting.',
  keywords: ['videography', 'video editing', 'talent', 'portfolio', 'Malaysia', 'Azwan', 'Zwandude Studio'],
  authors: [{ name: 'Azwan' }],
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    siteName: 'Zwandude Studio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="noise">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#181818',
                color: '#f5f5f5',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '2px',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
