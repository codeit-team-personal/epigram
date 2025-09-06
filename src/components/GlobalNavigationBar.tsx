"use client";

import { User, Search } from "lucide-react";
import LogoImage from "./Logo";
import { usePathname } from "next/navigation";
import MainGlobalNavigationBar from "./MainGlobalNavigatinBar";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const landingPath = ["/"];
  const authGNBPaths = ["/login", "/signup"];
  const isLandingPath = landingPath.includes(pathname);
  const isAuthPath = authGNBPaths.includes(pathname);

  const { user } = useAuthStore();

  if (!(isLandingPath || isAuthPath) && user) {
    return <MainGlobalNavigationBar />;
  }

  return (
    <div className='lg:h-[80px] md:h-[60px] h-[52px] flex items-center bg-white border'>
      <div className='flex lg:px-20 md:px-15 px-5 justify-between items-center grow'>
        {isAuthPath ? (
          <div className='mx-auto'>
            <LogoImage type={"sm"} />
          </div>
        ) : (
          <>
            <Link href='/search' aria-label='검색 페이지로 이동'>
              <Search className='lg:size-9 size-5' />
            </Link>
            <LogoImage />
            <Link href='/mypage' aria-label='마이 페이지로 이동'>
              <User className='lg:size-9 size-5' />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
