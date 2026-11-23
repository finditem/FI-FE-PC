import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "찾아줘!",
  description: "분실물 등록·조회 및 지도 기반 위치 확인 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
