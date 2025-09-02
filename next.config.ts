import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com", // 외부 이미지 도메인
        pathname: "/**", // 전체 경로 허용
      },
      {
        protocol: "https",
        hostname: "**", // 외부 이미지 도메인
      },
    ],
  },
};

export default nextConfig;
