const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        iropke: [
          'var(--font-iropke)',
          'Apple SD Gothic Neo',
          'Noto Serif KR',
          'Malgun Gothic',
          'Batang',
          'serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
