"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Coffee,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
]

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-100 to-amber-50/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 transform transition-all duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Glassmorphism sidebar */}
        <div className="h-full bg-linear-to-b from-[#2C1A12] via-[#3d2517] to-[#1a0f0a] text-white flex flex-col shadow-2xl">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all group-hover:scale-105">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight">Coffee POS</span>
                <p className="text-[10px] text-amber-300/60 -mt-1">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-12 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200",
                      isActive && "bg-linear-to-r from-amber-500/20 to-orange-500/10 text-white border border-amber-500/20 shadow-lg shadow-amber-500/5"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive ? "bg-linear-to-br from-amber-500 to-orange-600 shadow-md" : "bg-white/5"
                    )}>
                      <Icon className={cn("h-4 w-4", isActive && "text-white")} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User menu at bottom */}
          <div className="p-4 border-t border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-14 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <Avatar className="h-9 w-9 border-2 border-amber-500/30">
                    <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-600 text-white font-semibold">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                    <p className="text-xs text-amber-300/60">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-stone-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-stone-800">Coffee POS</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-stone-100">
                <Avatar className="h-8 w-8 border border-stone-200">
                  <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-600 text-white text-sm">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-stone-700">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <span className="text-sm text-gray-500">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
