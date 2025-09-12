"use client";

import React, { useEffect, useState } from "react";
import { FloatingButton } from "./FloatingButton";
import { ChevronUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className='fixed bottom-14 right-6 flex flex-col items-end gap-4'>
      <FloatingButton
        label='에피그램 만들기'
        icon={<Plus size={16} />}
        onClick={() => router.push(`/create`)}
      />
      <div
        className={`
          transition-all duration-500 ease-in-out
          ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        <FloatingButton
          icon={<ChevronUp size={18} />}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </div>
    </div>
  );
};
