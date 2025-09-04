"use client";

import "./globals.css";
import { pretendard, iropke } from "@/lib/fonts";
import Providers from "./providers";
import GlobalNavigationBar from "@/components/GlobalNavigationBar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const authGNBPaths = ["/login", "/signup"];
  const isAuthPath = authGNBPaths.includes(pathname);
  return (
    <html lang='ko'>
      <body className={`${pretendard.variable} ${iropke.variable} font-sans`}>
        <Providers>
          {isAuthPath ? (
            <GlobalNavigationBar isAuth={isAuthPath} />
          ) : (
            <GlobalNavigationBar />
          )}

          {children}
        </Providers>
      </body>
    </html>
  );
}
