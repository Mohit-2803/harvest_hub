import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token?.role as string) || undefined;

    // Not logged in → force login
    if (
      !req.nextauth.token &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register")
    ) {
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
