// utils/highlight.tsx (선택: 파일로 분리해도 되고 컴포넌트 안에 둬도 됩니다)
import * as React from "react";

/** 정규식 특수문자 이스케이프 */
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 안전한 하이라이트: 어떤 타입이 와도 동작 */
export function highlightText(
  rawText: unknown,
  rawKeyword: unknown
): React.ReactNode {
  const text = typeof rawText === "string" ? rawText : String(rawText ?? "");
  const keyword = typeof rawKeyword === "string" ? rawKeyword.trim() : "";

  if (!keyword) return text;

  const escaped = escapeRegExp(keyword);
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className='text-illustration-sky'>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
