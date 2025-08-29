import type { Metadata } from 'next';
import './globals.css';
import { pretendard, iropke } from '@/lib/fonts';
import Providers from './providers';

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
      <body className={`${pretendard.variable} ${iropke.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
