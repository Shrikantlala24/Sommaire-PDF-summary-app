import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

const isProtectedRoute = createRouteMatcher([
  '/upload(.*)', 
  '/dashboard(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl;

  // If user is signed in and tries to access public auth pages, redirect to upload
  if (userId && (url.pathname === '/sign-in' || url.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/upload', req.url));
  }

  // If user is signed in and on landing page, redirect to upload
  if (userId && url.pathname === '/') {
    return NextResponse.redirect(new URL('/upload', req.url));
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
