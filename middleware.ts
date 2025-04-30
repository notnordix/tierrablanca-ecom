import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are considered admin routes
  const isAdminRoute = path.startsWith("/admin") && !path.startsWith("/admin/login")

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("tierrablanca-admin-auth")

  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login, redirect to dashboard
  if (path === "/admin/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
