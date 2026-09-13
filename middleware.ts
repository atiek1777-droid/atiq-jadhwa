import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

/**
 * Resolves the active locale from the URL and forwards it as a request
 * header so the root layout (which owns the single <html> tag for the app)
 * can set lang/dir correctly on the server — no client-side flash, no
 * hydration mismatch.
 */
export function middleware(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const locale = (locales as readonly string[]).includes(segment) ? segment : defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|fonts|images|favicon.ico).*)"],
};
