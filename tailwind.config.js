const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)", "sans-serif"],
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
        iropke: [
          "var(--font-iropke)",
          "Apple SD Gothic Neo",
          "Noto Serif KR",
          "Malgun Gothic",
          "Batang",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
