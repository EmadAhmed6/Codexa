import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isAuthRoute && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export default proxy;
