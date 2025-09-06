"use client";

import Image from "next/image";
export default function OauthLogin() {
  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      "&response_type=code" +
      "&scope=openid%20email%20profile&prompt=consent";

    window.location.href = googleAuthUrl;
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    // 카카오 OAuth 로그인 URL
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className='flex gap-3 justify-center items-center'>
      {/* <div className='lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center'>
        <button
          onClick={handleGoogleLogin}
          className='relative lg:size-[27px] size-[18px] cursor-pointer'
        >
          <Image src={"/images/logo_google.png"} fill alt='logo' />
        </button>
      </div> */}
      <div className='lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center'>
        <button
          onClick={handleKakaoLogin}
          className='relative lg:w-[30px] w-[20px] lg:h-[27px] h-[18px] cursor-pointer'
        >
          <Image src={"/images/logo_kakao.png"} fill alt='logo' />
        </button>
      </div>
    </div>
  );
}
