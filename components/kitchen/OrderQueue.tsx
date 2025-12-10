"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pusherClient } from "@/lib/pusher-client"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Clock, Check, ChefHat, RefreshCw } from "lucide-react"

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

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  const updateStatus = async (orderId: string, status: string) => {
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
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING")
  const preparingOrders = orders.filter((o) => o.status === "PREPARING")
  const readyOrders = orders.filter((o) => o.status === "READY")

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-500" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#2C1A12] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="h-7 w-7" />
          Kitchen Display
        </h1>
        <Button variant="ghost" onClick={fetchOrders} className="text-white hover:bg-white/10">
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Pending Column */}
        <div className="flex flex-col">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-yellow-600">
            <Clock className="h-5 w-5" />
            Menunggu ({pendingOrders.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3">
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
              <p className="text-gray-400 text-center py-8">Tidak ada pesanan</p>
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="flex flex-col">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-blue-600">
            <ChefHat className="h-5 w-5" />
            Diproses ({preparingOrders.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3">
            {preparingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLabel="Siap Disajikan"
                actionColor="bg-green-500 hover:bg-green-600"
                onAction={() => updateStatus(order.id, "READY")}
              />
            ))}
            {preparingOrders.length === 0 && (
              <p className="text-gray-400 text-center py-8">Tidak ada pesanan</p>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-green-600">
            <Check className="h-5 w-5" />
            Siap ({readyOrders.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3">
            {readyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLabel="Selesai"
                actionColor="bg-gray-500 hover:bg-gray-600"
                onAction={() => updateStatus(order.id, "COMPLETED")}
              />
            ))}
            {readyOrders.length === 0 && (
              <p className="text-gray-400 text-center py-8">Tidak ada pesanan</p>
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
}: {
  order: Order
  actionLabel: string
  actionColor: string
  onAction: () => void
}) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-mono">
            #{order.orderNumber.slice(-6)}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: id })}
          </Badge>
        </div>
        {order.customerName && (
          <p className="text-sm text-gray-600">{order.customerName}</p>
        )}
        {order.tableNumber && (
          <Badge variant="secondary">Meja {order.tableNumber}</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="border-b pb-2 last:border-0">
            <div className="flex justify-between">
              <span className="font-medium">
                {item.quantity}x {item.product.name}
              </span>
            </div>
            {item.variant && (
              <p className="text-xs text-gray-500">
                {item.variant.size} • {item.variant.temperature}
              </p>
            )}
            {item.notes && (
              <p className="text-xs text-orange-600 italic">Note: {item.notes}</p>
            )}
          </div>
        ))}

        <Button onClick={onAction} className={`w-full mt-4 ${actionColor} text-white`}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
