// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuthStore } from "@/stores/authStore";
// import api from "@/lib/axios";

// export default function KakaoCallbackPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const code = searchParams.get("code");
//   const { setTokens, setUser } = useAuthStore();

//   useEffect(() => {
//     const loginWithKakao = async () => {
//       if (!code) return;

//       try {
//         const res = await api.post("/auth/signIn/KAKAO", {
//           token: code,
//           redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
//         });

//         // 토큰/유저 정보 zustand store 저장
//         setUser(res.data.user);
//         setTokens(res.data.accessToken, res.data.refreshToken);

//         router.push("/");
//       } catch (err) {
//         console.error("카카오 로그인 실패:", err);
//         router.push("/login?error=kakao");
//       }
//     };

//     loginWithKakao();
//   }, [code, router]);

//   return (
//     <div className='flex h-screen items-center justify-center'>
//       <div className='flex flex-col items-center space-y-4'>
//         {/* 스피너 */}
//         <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />

//         {/* 안내 문구 */}
//         <p className='text-gray-600'>카카오 계정으로 로그인 중입니다...</p>
//       </div>
//     </div>
//   );
// }
