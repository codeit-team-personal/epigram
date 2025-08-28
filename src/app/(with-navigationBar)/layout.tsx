import MainGlobalNavigationBar from '@/components/MainGlobalNavigatinBar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MainGlobalNavigationBar />

      {children}
    </div>
  );
}
