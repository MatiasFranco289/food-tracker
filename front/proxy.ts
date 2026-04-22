// proxy.ts
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const HOME_URL = "/home";
const LOGIN_URL = "/";
const JWT_SECRET = process.env.JWT_SECRET!;

function verifyJWT(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const isAuthenticated = token ? verifyJWT(token) : false;
  const isLoginPage = pathname === LOGIN_URL;

  // Logged-in user hits the login page → send them home
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL(HOME_URL, req.url));
  }

  // Unauthenticated user hits any page other than login → send to login
  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match ALL paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public folder files (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
