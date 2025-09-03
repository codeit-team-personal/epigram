"use client";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Logo from "./Logo";
import { useAuthStore } from "@/stores/authStore";

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className='lg:hidden md:hidden text-black mr-5 hover:bg-gray-50 p-2 rounded-md'
        aria-label='메뉴 열기'
      >
        <AnimatePresence mode='wait' initial={false}>
          {open ? (
            <motion.div
              key='x-icon'
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.25 }}
            >
              <X className='w-6 h-6' />
            </motion.div>
          ) : (
            <motion.div
              key='menu-icon'
              initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
              transition={{ duration: 0.25 }}
            >
              <Menu className='w-6 h-6 ' />
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverTrigger>

      <PopoverContent className='w-30 text-center [&>div]:cursor-pointer  [&>div]:py-2 [&>div]:hover:bg-gray-50  [&>div]:hover:rounded-lg'>
        <div>피드</div>
        <div>검색</div>
      </PopoverContent>
    </Popover>
  );
}

function DesktopNav() {
  return (
    <nav className='hidden md:block lg:block [&>span]:text-black-600 [&>span]:text-sm [&>span]:lg:text-base'>
      <span className='lg:mr-10 mr-7 cursor-pointer hover:text-gray-400'>
        피드
      </span>
      <span className='cursor-pointer hover:text-gray-400'>검색</span>
    </nav>
  );
}

function UserProfile({ nickName, image }: { nickName: string; image: string }) {
  return (
    <div className='flex items-center'>
      <div className='relative size-6 mr-2'>
        {image ? (
          <Image src={`${image}`} alt='user' fill />
        ) : (
          <Image src='/images/user.png' alt='user' fill />
        )}
      </div>
      <span className='text-gray-300 text-sm'>{nickName}</span>
    </div>
  );
}

export default function MainGlobalNavigationBar() {
  const { user } = useAuthStore();
  return (
    <header className='max-w-[1920px] lg:h-[80px] md:h-[60px] h-[52px] flex items-center justify-between lg:px-50 md:px-10 px-5 bg-white border'>
      <div className='flex items-center'>
        <MobileMenu />

        <div className='mr-10'>
          <Logo />
        </div>

        <DesktopNav />
      </div>
      <UserProfile nickName={user!.nickname} image={user!.image} />
    </header>
  );
}
