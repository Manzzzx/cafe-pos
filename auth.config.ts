import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server"

const rolePermissions: Record<string, string[]> = {
  ADMIN: ["/admin", "/api"],
  CASHIER: ["/pos", "/cashier", "/api/products", "/api/categories", "/api/orders"],
  BARISTA: ["/dashboard/barista", "/kitchen", "/api/orders"],
}

function getDashboardByRole(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard"
    case "CASHIER":
      return "/pos"
    case "BARISTA":
      return "/dashboard/barista"
    default:
      return "/auth/login"
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role as string | undefined
      const pathname = nextUrl.pathname

      // Public routes - always allow
      const publicRoutes = ["/auth/login", "/auth/register", "/api/auth", "/forbidden"]
      if (publicRoutes.some((route) => pathname.startsWith(route))) {
        // If logged in and accessing login, redirect to dashboard
        if (isLoggedIn && pathname.startsWith("/auth/login")) {
          return NextResponse.redirect(new URL(getDashboardByRole(userRole), nextUrl))
        }
        return true
      }

      // Not logged in - redirect to login
      if (!isLoggedIn) {
        return false
      }

      // Root path - redirect to role dashboard
      if (pathname === "/") {
        return NextResponse.redirect(new URL(getDashboardByRole(userRole), nextUrl))
      }

      // Check role permissions
      if (userRole) {
        const allowedRoutes = rolePermissions[userRole] || []
        const hasPermission = allowedRoutes.some((route) => pathname.startsWith(route))

        if (!hasPermission) {
          return NextResponse.redirect(new URL("/forbidden", nextUrl))
        }
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "CASHIER" | "BARISTA"
        session.user.id = token.id as string
      }
      return session
    },
  },
}

