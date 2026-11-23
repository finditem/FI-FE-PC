import type { Config } from "tailwindcss";

// 디자인 토큰과 커스텀 플러그인은 6단계(디자인 기반)에서 FI-FE 설정으로 교체한다.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
