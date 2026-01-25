import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/api/auth",
  "/2fa", // ✅ 2FA challenge page
  "/api/auth/2fa", // ✅ 2FA API endpoints
  "/logo.png", // ✅ Static assets
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes bypass auth (including 2FA pending sessions)
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log("🌐 Public route:", pathname);
    return NextResponse.next();
  }

  // Protected routes require full session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log("🛡️ Proxy session check:", !!session?.user?.id, pathname);

  if (!session?.user) {
    console.log("🚫 No session, redirecting to signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
