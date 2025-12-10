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
import { formatCurrency } from "@/lib/utils"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { BarChart3, TrendingUp, ShoppingCart, DollarSign, Coffee } from "lucide-react"

interface Order {
  id: string
  totalAmount: number
  taxAmount: number
  status: string
  paymentMethod: string
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

  const stats = calculateStats()
  const filteredOrders = getFilteredOrders()

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Laporan Penjualan
          </h1>
          <p className="text-gray-500">Analisis performa penjualan</p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pendapatan</p>
                <p className="text-2xl font-bold text-[#6F4E37]">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pesanan</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Item Terjual</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Coffee className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rata-rata Order</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.avgOrderValue)}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.paymentBreakdown).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.paymentBreakdown).map(([method, amount]) => (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{method}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(amount)}</p>
                      <p className="text-xs text-gray-500">
                        {((amount / stats.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Tidak ada data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {filteredOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(order.createdAt), "HH:mm", { locale: id })}
                      </p>
                    </div>
                    <p className="font-medium text-[#6F4E37]">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Tidak ada transaksi</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
