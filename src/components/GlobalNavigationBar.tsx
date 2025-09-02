"use client";
import { User, Search } from "lucide-react";
import Link from "next/link";
import LogoImage from "./Logo";
import { useAuthStore } from "@/stores/authStore";
import MainGlobalNavigationBar from "./MainGlobalNavigatinBar";

export default function GlobalNavigationBar({
  isAuth = false,
}: {
  isAuth?: boolean;
}) {
  const { user } = useAuthStore();
  if (user) {
    return <MainGlobalNavigationBar />;
  }
  return (
    <div className='lg:h-[80px] md:h-[60px] h-[52px] flex items-center bg-white border'>
      <div className='flex lg:px-20 md:px-15 px-5 justify-between items-center grow'>
        {isAuth ? (
          <div className='mx-auto'>
            <LogoImage type={"sm"} />
          </div>
        ) : (
          <>
            <Link href='/search' aria-label='검색 페이지로 이동'>
              <Search className='lg:size-9 size-5' />
            </Link>
            <LogoImage />
            <Link href='/profile' aria-label='마이 페이지로 이동'>
              <User className='lg:size-9 size-5' />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
