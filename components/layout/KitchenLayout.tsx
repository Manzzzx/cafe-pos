"use client"

import Link from "next/link"
import { useLogoutSync } from "@/components/auth/logout-sync"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChefHat, LogOut, Home } from "lucide-react"

interface KitchenLayoutProps {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function KitchenLayout({ children, user }: KitchenLayoutProps) {
  const { handleLogout } = useLogoutSync()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Minimal Top Bar */}
      <header className="h-14 bg-[#1a1a2e] text-white flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/kitchen" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            <span className="font-bold">Kitchen Display</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/kitchen">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#6F4E37] text-white text-sm">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <span className="text-sm text-gray-500">{user.name}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Full screen content for kitchen display */}
      <main className="h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </div>
  )
}
