import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Package, FolderTree, ClipboardList, BarChart3, Users } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  const quickLinks = [
    { href: "/admin/products", label: "Produk", icon: Package, color: "bg-blue-100 text-blue-600" },
    { href: "/admin/categories", label: "Kategori", icon: FolderTree, color: "bg-green-100 text-green-600" },
    { href: "/admin/orders", label: "Pesanan", icon: ClipboardList, color: "bg-orange-100 text-orange-600" },
    { href: "/admin/reports", label: "Laporan", icon: BarChart3, color: "bg-purple-100 text-purple-600" },
    { href: "/pos", label: "POS", icon: LayoutDashboard, color: "bg-yellow-100 text-yellow-600" },
    { href: "/kitchen", label: "Kitchen", icon: Users, color: "bg-red-100 text-red-600" },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500">Selamat datang, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link href={link.href} key={link.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${link.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{link.label}</h3>
                      <p className="text-sm text-gray-500">Kelola {link.label.toLowerCase()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
