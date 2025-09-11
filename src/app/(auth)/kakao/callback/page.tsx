// app/(auth)/kakao/callback/page.tsx
import KakaoCallbackClient from "./KakaoCallbackClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  // searchParams는 Promise이므로 await 필요
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;

  return <KakaoCallbackClient code={code} />;
}
