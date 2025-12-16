"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Package,
  FolderTree,
  ClipboardList,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  role: string
}

const menuItems = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: FolderTree },
    { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
    { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
    { href: "/admin/users", label: "Pengguna", icon: Users },
  ],
  CASHIER: [
    { href: "/dashboard/cashier", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "Kasir (POS)", icon: ShoppingCart },
    { href: "/admin/orders", label: "Riwayat", icon: ClipboardList },
  ],
  CHEF: [
    { href: "/dashboard/kitchen", label: "Dashboard", icon: LayoutDashboard },
    { href: "/kitchen", label: "Kitchen Display", icon: ChefHat },
  ],
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[role as keyof typeof menuItems] || []

  return (
    <aside className="w-64 bg-[#2C1A12] text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#D4A574]">Kafe POS</h1>
        <p className="text-sm text-gray-400">{role}</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-[#4A3728]",
                  isActive && "bg-[#4A3728]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:bg-red-900/20"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}