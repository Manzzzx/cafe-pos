"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { format, startOfDay, endOfDay, startOfWeek, startOfMonth, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { BarChart3, TrendingUp, ShoppingCart, DollarSign, Coffee, Loader2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  taxAmount: number
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: { quantity: number }[]
}

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalItems: number
  avgOrderValue: number
  paymentBreakdown: Record<string, number>
}

const CHART_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"]

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<string>("today")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      setOrders(await res.json())
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = (): Order[] => {
    const now = new Date()
    let start: Date
    let end: Date = endOfDay(now)

    switch (period) {
      case "today":
        start = startOfDay(now)
        break
      case "yesterday":
        start = startOfDay(subDays(now, 1))
        end = endOfDay(subDays(now, 1))
        break
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 })
        break
      case "month":
        start = startOfMonth(now)
        break
      default:
        start = startOfDay(now)
    }

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= start && orderDate <= end && order.status !== "CANCELLED"
    })
  }

  const calculateStats = (): Stats => {
    const filtered = getFilteredOrders()
    
    const totalRevenue = filtered.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalOrders = filtered.length
    const totalItems = filtered.reduce((sum, o) => 
      sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const paymentBreakdown: Record<string, number> = {}
    filtered.forEach((order) => {
      paymentBreakdown[order.paymentMethod] = (paymentBreakdown[order.paymentMethod] || 0) + order.totalAmount
    })

    return { totalRevenue, totalOrders, totalItems, avgOrderValue, paymentBreakdown }
  }

  const getDailyData = () => {
    const filtered = getFilteredOrders()
    const grouped: Record<string, number> = {}
    
    filtered.forEach((order) => {
      const day = format(new Date(order.createdAt), "HH:00")
      grouped[day] = (grouped[day] || 0) + order.totalAmount
    })

    return Object.entries(grouped).map(([time, revenue]) => ({ time, revenue }))
  }

  const stats = calculateStats()
  const filteredOrders = getFilteredOrders()
  const dailyData = getDailyData()

  const paymentData = Object.entries(stats.paymentBreakdown).map(([name, value], index) => ({
    name,
    value,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="text-stone-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Laporan Penjualan
          </h1>
          <p className="text-stone-500 mt-1">Analisis performa penjualan</p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 bg-white border-stone-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="yesterday">Kemarin</SelectItem>
            <SelectItem value="week">Minggu Ini</SelectItem>
            <SelectItem value="month">Bulan Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Total Pendapatan</p>
                <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Total Pesanan</p>
                <p className="text-2xl font-bold text-stone-800">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Item Terjual</p>
                <p className="text-2xl font-bold text-stone-800">{stats.totalItems}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Coffee className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-stone-500">Rata-rata Order</p>
                <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.avgOrderValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-stone-800">Grafik Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-stone-400">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-stone-800">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '12px', 
                          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {paymentData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-stone-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-stone-800">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-stone-400">
                <p>Tidak ada data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-stone-800">Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/50 hover:bg-stone-50/50">
                  <TableHead className="font-semibold text-stone-600">No. Pesanan</TableHead>
                  <TableHead className="font-semibold text-stone-600">Waktu</TableHead>
                  <TableHead className="font-semibold text-stone-600">Item</TableHead>
                  <TableHead className="font-semibold text-stone-600">Metode Bayar</TableHead>
                  <TableHead className="font-semibold text-stone-600">Status</TableHead>
                  <TableHead className="text-right font-semibold text-stone-600">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 10).map((order) => (
                  <TableRow key={order.id} className="hover:bg-amber-50/30 transition-colors">
                    <TableCell className="font-mono font-semibold text-stone-700">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-sm text-stone-500">
                      {format(new Date(order.createdAt), "HH:mm", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <span className="text-stone-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={order.paymentStatus === "PAID" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-amber-700">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Coffee className="h-12 w-12 mx-auto mb-3 text-stone-300" />
                      <p className="text-stone-400">Tidak ada transaksi</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
