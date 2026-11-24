import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// TODO(수현): 7단계에서 FI-FE의 보호 라우트 접근 제어와 /admin 리다이렉트를 handleRequest에 옮긴다.
function handleRequest(request: NextRequest) {
  return intlMiddleware(request);
}

const LOCALE_SESSION_COOKIE = "locale_session";

const hasLocalePrefix = (pathname: string) =>
  routing.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

export function middleware(request: NextRequest) {
  const fetchDestination = request.headers.get("sec-fetch-dest");
  const isPageRequest = fetchDestination == null || fetchDestination === "document";

  if (request.cookies.has(LOCALE_SESSION_COOKIE) || !isPageRequest) {
    return handleRequest(request);
  }

  const { pathname, search } = request.nextUrl;
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const shouldRestoreLocale =
    hasLocale(routing.locales, savedLocale) &&
    savedLocale !== routing.defaultLocale &&
    !hasLocalePrefix(pathname);

  const localePathname = pathname === "/" ? "" : pathname;
  const localeRedirectPath = `/${savedLocale}${localePathname}${search}`;
  const response = shouldRestoreLocale
    ? NextResponse.redirect(new URL(localeRedirectPath, request.url))
    : handleRequest(request);

  response.headers.append("Set-Cookie", `${LOCALE_SESSION_COOKIE}=1; Path=/`);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
