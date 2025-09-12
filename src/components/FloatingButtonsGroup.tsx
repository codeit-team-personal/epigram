"use client";

import React from "react";
import { FloatingButton } from "./FloatingButton";
import { ChevronUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const FloatingButtonsGroup: React.FC = () => {
  const router = useRouter();
  return (
    <div className='fixed bottom-14 right-6 flex flex-col items-end gap-4'>
      <FloatingButton
        label='에피그램 만들기'
        icon={<Plus size={16} />}
        // onClick={() => alert("에피그램 만들기 클릭됨")}
        onClick={() => router.push(`/create`)}
      />
      <FloatingButton
        icon={<ChevronUp size={18} />}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
};
