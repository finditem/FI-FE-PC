import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { PRODUCTION_HOST } from "@/constants/PRODUCTION_HOST";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");

  // release, Vercel 미리보기 등 운영이 아닌 호스트는 전체 크롤링을 막는다.
  // 이미 링크가 퍼진 주소는 next.config.ts의 X-Robots-Tag 헤더로 색인에서도 뺀다.
  if (host !== PRODUCTION_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const disallowPaths = ["/mypage/", "/chat", "/write", "/alert"];
  const localizedDisallowPaths = routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .flatMap((locale) => disallowPaths.map((path) => `/${locale}${path}`));

  // TODO(수현): 사이트맵을 가져올 때 FI-FE처럼 sitemap: `${SITE_URL}/sitemap.xml`을 추가한다.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...disallowPaths, ...localizedDisallowPaths],
    },
  };
}
