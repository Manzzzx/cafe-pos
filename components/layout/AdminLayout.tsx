"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogoutSync } from "@/components/auth/logout-sync";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Package, FolderTree, ClipboardList, BarChart3, LogOut, Menu, X, ChevronDown, Coffee } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
];

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { handleLogout } = useLogoutSync();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-linear-to-br from-stone-100 to-amber-50/30 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-[#1f130d] border-r border-white/10", "transform transition-transform duration-300 ease-out", "lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-full flex flex-col text-white">
          {/* Brand */}
          <div className="h-16 px-6 flex items-center border-b border-white/10">
            <div>
              <p className="font-semibold tracking-tight">KAFE POS</p>
              <p className="text-xs text-white/50">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn("flex items-center gap-3 px-3 h-11 rounded-lg text-sm transition-colors", isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")} onClick={() => setSidebarOpen(false)}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page title */}
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-stone-800">Dashboard</h1>
              <p className="hidden sm:block text-xs text-stone-500">Ringkasan aktivitas kafe hari ini</p>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:flex items-center text-sm text-stone-600">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-stone-100">
                <Avatar className="h-8 w-8 border border-stone-200">
                  <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-600 text-white text-sm">{user.name?.charAt(0) || "U"}</AvatarFallback>
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
        <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-hide">{children}</main>
      </div>
    </div>
  );
}
