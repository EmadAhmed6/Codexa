import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication Proxy / Middleware logic
 * - Redirects authenticated users accessing /auth/* routes to '/'
 * - Redirects unauthenticated users accessing protected routes (e.g. '/') to '/auth/login'
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");

  // 1. If user HAS a token and attempts to access an auth page (/auth/*) -> redirect to '/'
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user DOES NOT have a token and attempts to access root '/' -> redirect to '/auth/login'
  if (!token && !isAuthRoute && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export default proxy;
