import {
  NextRequest,
  NextResponse,
} from "next/server";
import Negotiator from "negotiator";

const AVAILABLE_LANGUAGES = [
  "en",
  "ja",
];
const DEFAULT_LANGUAGE = AVAILABLE_LANGUAGES[0];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstPathSegment = pathname.split("/")[1];
  if (AVAILABLE_LANGUAGES.includes(firstPathSegment)) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language");
  let language = DEFAULT_LANGUAGE;
  if (acceptLanguage) {
    const negotiator = new Negotiator({ headers: { "accept-language": acceptLanguage } });
    language = negotiator.language(AVAILABLE_LANGUAGES) || DEFAULT_LANGUAGE;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${language}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
}
