import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { 
  DollarSign, 
  ShoppingCart, 
  Coffee, 
  TrendingUp,
  Package,
  FolderTree,
  ClipboardList,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { startOfDay, endOfDay, subDays, format } from "date-fns"
import { id } from "date-fns/locale"
import { DashboardCharts } from "./DashboardCharts"

async function getDashboardStats() {
  const today = new Date()
  const startToday = startOfDay(today)
  const endToday = endOfDay(today)
  const startYesterday = startOfDay(subDays(today, 1))
  const endYesterday = endOfDay(subDays(today, 1))

  // Today's stats
  const todayOrders = await db.order.findMany({
    where: {
      createdAt: { gte: startToday, lte: endToday },
      status: { not: "CANCELLED" }
    },
    include: { items: true }
  })

  // Yesterday's stats for comparison
  const yesterdayOrders = await db.order.findMany({
    where: {
      createdAt: { gte: startYesterday, lte: endYesterday },
      status: { not: "CANCELLED" }
    },
    include: { items: true }
  })

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const todayItemsSold = todayOrders.reduce((sum, o) => 
    sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
  const yesterdayItemsSold = yesterdayOrders.reduce((sum, o) => 
    sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)

  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : 0
  const ordersChange = yesterdayOrders.length > 0 
    ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 
    : 0

  // Recent orders
  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { 
      items: { include: { product: true } },
      cashier: true
    }
  })

  // Weekly data for chart
  const weeklyData = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i)
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    const dayOrders = await db.order.findMany({
      where: {
        createdAt: { gte: dayStart, lte: dayEnd },
        status: { not: "CANCELLED" }
      }
    })
    
    weeklyData.push({
      date: format(date, "EEE", { locale: id }),
      revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: dayOrders.length
    })
  }

  return {
    todayRevenue,
    todayOrders: todayOrders.length,
    todayItemsSold,
    avgOrderValue: todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0,
    revenueChange,
    ordersChange,
    recentOrders,
    weeklyData
  }
}

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  const stats = await getDashboardStats()

  const quickLinks = [
    { href: "/admin/products", label: "Produk", icon: Package, color: "from-blue-500 to-blue-600", count: null },
    { href: "/admin/categories", label: "Kategori", icon: FolderTree, color: "from-emerald-500 to-emerald-600", count: null },
    { href: "/admin/orders", label: "Pesanan", icon: ClipboardList, color: "from-orange-500 to-orange-600", count: null },
    { href: "/admin/reports", label: "Laporan", icon: BarChart3, color: "from-purple-500 to-purple-600", count: null },
  ]

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PREPARING: "bg-blue-100 text-blue-800",
    READY: "bg-green-100 text-green-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Dashboard</h1>
          <p className="text-stone-500">Selamat datang kembali, {session.user.name || session.user.email}!</p>
        </div>
        <div className="text-sm text-stone-500">
          {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Pendapatan Hari Ini</p>
                <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.todayRevenue)}</p>
                <div className="flex items-center gap-1 text-xs">
                  {stats.revenueChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">+{stats.revenueChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">{stats.revenueChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-stone-400">vs kemarin</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Total Pesanan</p>
                <p className="text-2xl font-bold text-stone-800">{stats.todayOrders}</p>
                <div className="flex items-center gap-1 text-xs">
                  {stats.ordersChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">+{stats.ordersChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">{stats.ordersChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-stone-400">vs kemarin</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Item Terjual</p>
                <p className="text-2xl font-bold text-stone-800">{stats.todayItemsSold}</p>
                <p className="text-xs text-stone-400">hari ini</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Coffee className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Rata-rata Order</p>
                <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.avgOrderValue)}</p>
                <p className="text-xs text-stone-400">per transaksi</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts weeklyData={stats.weeklyData} />

      {/* Quick Links & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-stone-800">Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link href={link.href} key={link.href}>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group">
                    <div className={`h-10 w-10 rounded-xl bg-linear-to-br ${link.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-700">{link.label}</p>
                      <p className="text-xs text-stone-400">Kelola {link.label.toLowerCase()}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-stone-800">Pesanan Terbaru</CardTitle>
            <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Lihat Semua
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {order.items.length}
                      </div>
                      <div>
                        <p className="font-medium text-stone-700">{order.orderNumber}</p>
                        <p className="text-xs text-stone-400">
                          {order.customerName || "Guest"} • {format(new Date(order.createdAt), "HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <p className="font-semibold text-stone-700">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada pesanan hari ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
