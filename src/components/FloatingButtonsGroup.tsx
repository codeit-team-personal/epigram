"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const FloatingButtonsGroup: React.FC = () => {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className='fixed bottom-20 right-6 flex flex-col items-end gap-4'>
      <Button
        onClick={() => router.push(`/create`)}
        className={`
        flex items-center gap-1 px-4 py-2 lg:w-[194px] lg:h-[64px] w-[145px] h-[48px]
        bg-blue-900 text-white rounded-full shadow-2xl
        hover:bg-blue-950 transition-all cursor-pointer
      `}
      >
        <Plus className='!size-6' />
        <span className='lg:text-xl text-sm font-semibold'>
          에피그램 만들기
        </span>
      </Button>

      <div
        className={`
          transition-all duration-500 ease-in-out
          ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`
        flex items-center px-4 py-2 lg:size-[64px] size-[48px]
       bg-blue-900 text-white rounded-full shadow-2xl
        hover:bg-blue-950 transition-all cursor-pointer
      `}
        >
          <ChevronUp className='lg:!size-12 !size-8' />
        </Button>
      </div>
    </div>
  );
};
