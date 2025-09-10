import * as React from "react";

/** 정규식 특수문자 이스케이프 */
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
