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
  ShoppingCart,
  ClipboardList,
  LogOut,
  ChevronDown,
  Coffee,
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
  { href: "/pos", label: "Kasir", icon: ShoppingCart },
  { href: "/cashier/orders", label: "Riwayat Pesanan", icon: ClipboardList },
]

export function CashierLayout({ children, user }: CashierLayoutProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top Navigation */}
      <header className="h-14 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between px-4 lg:px-6 shadow-lg shadow-amber-500/20">
        <div className="flex items-center gap-6">
          <Link href="/pos" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Coffee POS</span>
          </Link>

          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-white/80 hover:text-white hover:bg-white/20",
                      isActive && "bg-white/20 text-white font-medium"
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
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white font-bold">
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
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </div>
  )
}
