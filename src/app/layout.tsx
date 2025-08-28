import type { Metadata } from 'next';
import GlobalNavigationBar from '@/components/GlobalNavigationBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Epigram',
  description: 'Sharing feelings',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <GlobalNavigationBar />
        {children}
      </body>
    </html>
  );
}
