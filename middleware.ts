import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async (req) => {
    const url = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // If no token, redirect to home
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const { subscription, roles = [] } = token as any;
    const isAdmin = roles.includes("admin");
    const isSubscribed = ["active", "trialing", "past_due"].includes(
      subscription?.status
    );

    // Allow free access to these routes
    if (url.startsWith("/subscribe") || url.startsWith("/unsubscribe")) {
      return NextResponse.next();
    }

    // Protect /app
    if (url.startsWith("/app")) {
      if (!isSubscribed && !isAdmin) {
        return NextResponse.redirect(new URL("/subscribe", req.url));
      }
    }

    // Protect /admin
    if (url.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }
    if (url.startsWith("/api/admin") && !isAdmin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          message: "You are not authorized to access this resource.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/api/invoices/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
    "/api/dashboard/:path*",
    "/api/payment/:path*",
    "/api/subscribe/:path*",
    "/api/vaildate-reset/:path*",
    "/api/interviews/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
  ],
};
