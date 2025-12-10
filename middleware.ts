import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Define route permissions
const rolePermissions: Record<string, string[]> = {
  ADMIN: ["/dashboard/admin", "/admin", "/pos", "/kitchen", "/api"],
  CASHIER: ["/dashboard/cashier", "/pos", "/api/products", "/api/categories", "/api/orders"],
  BARISTA: ["/dashboard/barista", "/kitchen", "/api/orders"],
}

// Public routes (no auth required)
const publicRoutes = ["/auth/login", "/auth/register", "/api/auth"]

// Routes that require auth but any role can access
const authOnlyRoutes = ["/"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined

  const pathname = nextUrl.pathname

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If logged in and trying to access login, redirect to dashboard
    if (isLoggedIn && pathname.startsWith("/auth/login")) {
      return NextResponse.redirect(new URL(getDashboardByRole(userRole), nextUrl))
    }
    return NextResponse.next()
  }

  // Check if user is logged in
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Handle root path - redirect to role-based dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL(getDashboardByRole(userRole), nextUrl))
  }

  // Check role permissions
  if (userRole) {
    const allowedRoutes = rolePermissions[userRole] || []
    const hasPermission = allowedRoutes.some((route) => pathname.startsWith(route))

    if (!hasPermission) {
      // Redirect to 403 forbidden page
      return NextResponse.redirect(new URL("/forbidden", nextUrl))
    }
  }

  return NextResponse.next()
})

function getDashboardByRole(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin"
    case "CASHIER":
      return "/dashboard/cashier"
    case "BARISTA":
      return "/dashboard/barista"
    default:
      return "/auth/login"
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|sounds|uploads|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
