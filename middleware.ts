import {
  NextRequest,
  NextResponse,
} from "next/server";
import Negotiator from "negotiator";

const AVAILABLE_LOCALES = [
  "en",
  "ja",
];
const DEFAULT_LOCALE = AVAILABLE_LOCALES[0];

/**
 * Middleware function that handles internationalization (i18n) routing.
 * 
 * This middleware intercepts incoming requests and:
 * - Checks if the URL already contains a locale prefix
 * - If not, determines the user's preferred locale from the Accept-Language header
 * - Redirects the user to the appropriate localized URL
 * 
 * @param {NextRequest} request - The incoming Next.js request object
 * @returns {NextResponse} NextResponse - Either continues to the next middleware/page or redirects to localized URL
 * 
 * @example
 * // Request to "/" with Accept-Language: "ja,en;q=0.9"
 * // → Redirects to "/ja/"
 * 
 * // Request to "/en/about"
 * // → Continues without redirect
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstPathSegment = pathname.split("/")[1];
  if (AVAILABLE_LOCALES.includes(firstPathSegment)) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language");
  let locale = DEFAULT_LOCALE;
  if (acceptLanguage) {
    const negotiator = new Negotiator({ headers: { "accept-language": acceptLanguage } });
    locale = negotiator.language(AVAILABLE_LOCALES) || DEFAULT_LOCALE;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
}