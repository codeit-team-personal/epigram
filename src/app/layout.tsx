import type { Metadata } from 'next';
import './globals.css';
import { pretendard, iropke } from '@/lib/fonts';
import Providers from './providers';
import GlobalNavigationBar from '@/components/GlobalNavigationBar';

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
        <Providers>
          <GlobalNavigationBar isAuth={true} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
