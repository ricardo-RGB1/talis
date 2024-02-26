import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  /**
   * Performs post-authentication logic.
   * If the user is logged in and on a public route, it redirects to the organization selection page.
   * If the user is not logged in and not on a public route, it redirects to the sign-in page.
   * If the user is logged in but does not have an orgId and is not on the org selection page, it redirects to the org selection page.
   * @param auth - The authentication information.
   * @param req - The request object.
   * @returns A NextResponse object for redirection or undefined.
   */
  afterAuth(auth, req) {
    // Redirect to org selection page if user is logged in and on a public route
    if (auth.userId && auth.isPublicRoute) {
      // If user is logged in and on a public route
      let path = "/select-org";
      if (auth.orgId) {
        // If user is logged in and on a public route and has an orgId
        path = `/organization/${auth.orgId}`;
      }
      const orgSelection = new URL(path, req.url); // Create a new URL object with the path
      return NextResponse.redirect(orgSelection);
    }

    // If user is not logged in and not on a public route
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If user is logged in but does not have an orgId and is not on the org selection page
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
