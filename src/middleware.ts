import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/experts",
  "/customer/marketplace",
  "/login",
  "/register",
  "/api/auth",
];

// Check if a path is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token?.role as string) || undefined;

    // Allow access to public routes without authentication
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Not logged in and trying to access protected route → force login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Farmers only
    if (pathname.startsWith("/farmer") && role !== "FARMER") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    // Customers only
    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    // Admins only
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/farmer/:path*",
    "/customer/:path*",
    "/admin/:path*",
    "/dashboard",
  ],
};
