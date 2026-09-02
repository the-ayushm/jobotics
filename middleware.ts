import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Define public paths that do not require authentication
  const isPublicPath =
    path === "/" ||
    path.startsWith("/auth/") ||
    path.startsWith("/api/auth");

  if (isPublicPath) {
    // If authenticated user visits login/signup, redirect to their dashboard
    if (token && path.startsWith("/auth/")) {
      const userRole = token.role;
      if (userRole === "hr") {
        return NextResponse.redirect(new URL("/dashboard/hr", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    return NextResponse.next();
  }

  // If no token exists, redirect to appropriate signin page
  if (!token) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized: Access denied." }, { status: 401 });
    }
    if (path.startsWith("/dashboard/hr")) {
      return NextResponse.redirect(new URL("/auth/hr/signin", req.url));
    }
    return NextResponse.redirect(new URL("/auth/user/signin", req.url));
  }

  // Enforce role-based access control
  const userRole = token.role;

  // HR Routes
  if (path.startsWith("/dashboard/hr") || path.startsWith("/api/hr")) {
    if (userRole !== "hr") {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ message: "Forbidden: HR role required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }

  // Profile route is accessible to any authenticated user (both HR and candidate)
  if (path === "/api/user/profile") {
    return NextResponse.next();
  }

  // User / Candidate Routes
  if (path.startsWith("/dashboard/user") || path.startsWith("/api/user")) {
    if (userRole !== "user") {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ message: "Forbidden: Candidate role required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard/hr", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
