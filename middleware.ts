import { NextResponse } from "next/server";
export function middleware(req: Request) {
  const url = new URL(req.url);

  // Only log API calls (e.g., /api/session, /api/cases)
  if (url.pathname.startsWith("/api/")) {
    console.log("[instrument] api", {
      path: url.pathname,
      method: (req as any).method ?? "GET",
    });
  }

  return NextResponse.next();
}

// Apply to everything except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
