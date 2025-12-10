"use client"

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
  ShoppingCart,
  ClipboardList,
  LogOut,
  ChevronDown,
} from "lucide-react"

interface CashierLayoutProps {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

const menuItems = [
  { href: "/dashboard/cashier", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "Kasir (POS)", icon: ShoppingCart },
  { href: "/admin/orders", label: "Riwayat Pesanan", icon: ClipboardList },
]

export function CashierLayout({ children, user }: CashierLayoutProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="h-16 bg-[#2C1A12] text-white flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/cashier" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="font-bold text-lg hidden sm:inline">Coffee POS</span>
          </Link>

          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard/cashier" && pathname.startsWith(item.href))

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-white/70 hover:text-white hover:bg-white/10",
                      isActive && "bg-white/10 text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#6F4E37] text-white">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <span className="text-sm text-gray-500">{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Page content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
}
