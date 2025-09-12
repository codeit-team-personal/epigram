"use client";

import React, { useRef } from "react";
import { ChevronsDown } from "lucide-react"; // 아이콘 패키지 사용

export default function ScrollButton() {
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (divRef.current) {
      const nextSection = divRef.current.closest("section")?.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      className='flex flex-col text-blue-400 cursor-pointer absolute bottom-30 animate-bounce'
    >
      <span className='sm:text-[16px] text-[12px]'>더 알아보기</span>
      <span className='mx-auto'>
        <ChevronsDown className='size-6' />
      </span>
    </div>
  );
}
