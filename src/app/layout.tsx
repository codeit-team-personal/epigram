
import type { Metadata } from 'next';
import './globals.css';
import { pretendard, iropke } from '@/lib/fonts';

export const metadata: Metadata = {
  title: "Epigram",
  description: "Sharing feelings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${pretendard.variable} ${iropke.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
