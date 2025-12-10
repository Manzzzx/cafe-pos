"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pusherClient } from "@/lib/pusher-client"
import { differenceInMinutes, differenceInSeconds } from "date-fns"
import { Clock, Check, ChefHat, RefreshCw, Coffee, Timer, AlertCircle } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  variant?: { size?: string; temperature?: string } | null
  notes?: string | null
  product: { name: string }
}

interface Order {
  id: string
  orderNumber: string
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED"
  customerName?: string | null
  tableNumber?: string | null
  items: OrderItem[]
  createdAt: string
}

function getElapsedTime(createdAt: string): { minutes: number; seconds: number; text: string } {
  const now = new Date()
  const created = new Date(createdAt)
  const totalSeconds = differenceInSeconds(now, created)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes >= 60) {
    return { minutes, seconds, text: `${Math.floor(minutes / 60)}j ${minutes % 60}m` }
  }
  return { minutes, seconds, text: `${minutes}m ${seconds}s` }
}

function getUrgencyColor(minutes: number): { bg: string; border: string; pulse: boolean } {
  if (minutes >= 10) {
    return { bg: "bg-red-50", border: "border-red-400", pulse: true }
  }
  if (minutes >= 5) {
    return { bg: "bg-amber-50", border: "border-amber-400", pulse: false }
  }
  return { bg: "bg-white", border: "border-stone-200", pulse: false }
}

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTick] = useState(0)

  // Force re-render every second for timer updates
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchOrders()

    // Subscribe to realtime updates
    const channel = pusherClient.subscribe("orders")

    channel.bind("order-created", (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev])
      // Play notification sound
      try {
        new Audio("/sounds/notification.mp3").play().catch(() => {})
      } catch {}
    })

    channel.bind("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
          .filter((o) => o.status !== "COMPLETED")
      )
    })

    return () => {
      pusherClient.unsubscribe("orders")
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/kitchen")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      
      if (res.ok) {
        const updatedOrder = await res.json()
        setOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            .filter((o) => o.status !== "COMPLETED")
        )
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }, [])

  const pendingOrders = orders.filter((o) => o.status === "PENDING")
  const preparingOrders = orders.filter((o) => o.status === "PREPARING")
  const readyOrders = orders.filter((o) => o.status === "READY")

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-stone-100 to-amber-50/30">
        <div className="text-center space-y-3">
          <Coffee className="h-12 w-12 animate-bounce mx-auto text-amber-600" />
          <p className="text-stone-500 font-medium">Memuat pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-linear-to-br from-stone-100 to-amber-50/30 flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-r from-amber-600 to-orange-600 text-white p-4 flex justify-between items-center shadow-lg shadow-amber-500/20">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ChefHat className="h-6 w-6" />
          </div>
          Kitchen Display
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-white/80 text-sm">
            {pendingOrders.length + preparingOrders.length + readyOrders.length} pesanan aktif
          </div>
          <Button variant="ghost" onClick={fetchOrders} className="text-white hover:bg-white/20">
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Pending Column */}
        <div className="flex flex-col bg-white/50 rounded-2xl p-4">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-amber-600">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            Menunggu
            <Badge className="ml-auto bg-amber-500 text-white">{pendingOrders.length}</Badge>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLabel="Mulai Buat"
                actionColor="bg-blue-500 hover:bg-blue-600"
                onAction={() => updateStatus(order.id, "PREPARING")}
              />
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-12">
                <Coffee className="h-12 w-12 mx-auto mb-2 text-stone-300" />
                <p className="text-stone-400">Tidak ada pesanan</p>
              </div>
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="flex flex-col bg-white/50 rounded-2xl p-4">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-blue-600">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ChefHat className="h-5 w-5" />
            </div>
            Diproses
            <Badge className="ml-auto bg-blue-500 text-white">{preparingOrders.length}</Badge>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {preparingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLabel="Siap Disajikan"
                actionColor="bg-emerald-500 hover:bg-emerald-600"
                onAction={() => updateStatus(order.id, "READY")}
              />
            ))}
            {preparingOrders.length === 0 && (
              <div className="text-center py-12">
                <Coffee className="h-12 w-12 mx-auto mb-2 text-stone-300" />
                <p className="text-stone-400">Tidak ada pesanan</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col bg-white/50 rounded-2xl p-4">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-emerald-600">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            Siap Diambil
            <Badge className="ml-auto bg-emerald-500 text-white">{readyOrders.length}</Badge>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {readyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLabel="Selesai"
                actionColor="bg-stone-500 hover:bg-stone-600"
                onAction={() => updateStatus(order.id, "COMPLETED")}
                hideTimer
              />
            ))}
            {readyOrders.length === 0 && (
              <div className="text-center py-12">
                <Coffee className="h-12 w-12 mx-auto mb-2 text-stone-300" />
                <p className="text-stone-400">Tidak ada pesanan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  actionLabel,
  actionColor,
  onAction,
  hideTimer = false,
}: {
  order: Order
  actionLabel: string
  actionColor: string
  onAction: () => void
  hideTimer?: boolean
}) {
  const elapsed = getElapsedTime(order.createdAt)
  const urgency = getUrgencyColor(elapsed.minutes)

  return (
    <Card className={`shadow-lg border-2 ${urgency.bg} ${urgency.border} overflow-hidden transition-all ${urgency.pulse ? 'animate-pulse' : ''}`}>
      {/* Header */}
      <div className="p-3 border-b border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-xl font-mono font-bold text-stone-800">
            #{order.orderNumber.slice(-4)}
          </span>
          {order.customerName && (
            <span className="ml-2 text-sm text-stone-500">{order.customerName}</span>
          )}
        </div>
        {!hideTimer && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            elapsed.minutes >= 10 ? 'text-red-600' : 
            elapsed.minutes >= 5 ? 'text-amber-600' : 'text-stone-500'
          }`}>
            {elapsed.minutes >= 10 && <AlertCircle className="h-4 w-4" />}
            <Timer className="h-4 w-4" />
            {elapsed.text}
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Table Badge */}
        {order.tableNumber && (
          <Badge className="bg-amber-100 text-amber-700 border-0 mb-2">
            Meja {order.tableNumber}
          </Badge>
        )}

        {/* Items */}
        {order.items.map((item) => (
          <div key={item.id} className="py-1.5 border-b border-stone-100 last:border-0">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center font-bold shrink-0">
                {item.quantity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-stone-500">
                    {item.variant.size} • {item.variant.temperature}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-amber-600 mt-0.5 bg-amber-50 px-2 py-0.5 rounded inline-block">
                    📝 {item.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button onClick={onAction} className={`w-full mt-2 ${actionColor} text-white font-semibold`}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
