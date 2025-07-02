// app/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Define public paths accessible to anyone (no authentication required)
  // IMPORTANT: Include /api/auth/ for NextAuth's internal calls
  const publicPaths = [
    "/",
    "/auth/hr/signin",
    "/auth/user/signin",
    "/auth/hr/signup",
    "/auth/user/signup",
    "/api/auth/", // Crucial for NextAuth's internal redirects/callbacks
  ];

  // If the path starts with any of the public paths, let it pass immediately
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }
  
  // If no token exists (user is not authenticated) AND the path is not public,
  // redirect them to the homepage.
  if (!token) {
    console.log(`[Middleware] No token for protected path '${path}'. Redirecting to '/'`);
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  // User is authenticated (token exists)
  // Now enforce role-based access control
  const userRole = token.role; // Access the role from the token
  console.log(`[Middleware] Authenticated. Path: '${path}', Role: '${userRole}'`);

  // Corrected dashboard paths: /dashboard/hr and /dashboard/user
  if (path.startsWith("/dashboard/hr")) { // Use specific dashboard path
    if (userRole !== "hr") {
      console.log(`Access Denied: User role "${userRole}" tried to access HR dashboard.`);
      return NextResponse.redirect(new URL("/dashboard/user", req.url)); // Redirect to user dashboard
    }
  } else if (path.startsWith("/dashboard/user")) { // Use specific dashboard path
    if (userRole !== "user") {
      console.log(`Access Denied: User role "${userRole}" tried to access user dashboard.`);
      return NextResponse.redirect(new URL("/dashboard/hr", req.url)); // Redirect to HR dashboard
    }
  }

  // If authenticated and authorized by role, allow access
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except static files, _next, and specified public paths
  // This matcher is generally good, but relies on publicPaths to handle /api/auth correctly.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
