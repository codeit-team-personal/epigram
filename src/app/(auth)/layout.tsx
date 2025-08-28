import GlobalNavigationBar from '@/components/GlobalNavigationBar';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
    <GlobalNavigationBar isAuth={true} />
      {children}
    </>
  );
}
