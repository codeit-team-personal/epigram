import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/PretendardVariable.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const iropke = localFont({
  src: [
    {
      path: "../../public/fonts/IropkeBatangM.woff",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-iropke",
  display: "swap",
});
