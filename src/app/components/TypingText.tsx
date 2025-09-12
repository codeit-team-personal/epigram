"use client";

import { useEffect, useRef, useState } from "react";

export default function TypingText() {
  const text = "나만 갖고 있기엔\n아까운 글이 있지 않나요?";

  const [displayText, setDisplayText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const iRef = useRef(0); // 현재 타이핑 위치
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const speed = 100; // ms

    const tick = () => {
      const i = iRef.current;

      // i는 0..text.length 범위로만 증가
      if (i <= text.length) {
        // 안전하게 앞에서부터 i글자까지만 잘라서 렌더
        setDisplayText(text.slice(0, i));

        iRef.current = i + 1;

        if (iRef.current <= text.length) {
          timerRef.current = window.setTimeout(tick, speed);
        } else {
          setIsFinished(true); // 마지막 글자까지 표시 완료
        }
      }
    };

    tick();

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <h1 className='lg:text-[40px] md:text-[32px] text-2xl font-medium text-black-500 lg:mb-12 md:mb-7 mb-3 font-iropke whitespace-pre-line'>
      {displayText}
      {!isFinished && <span className='animate-pulse'>|</span>}
    </h1>
  );
}
