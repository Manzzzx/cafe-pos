"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ClipboardList, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  id: string
  quantity: number
  price: number
  subtotal: number
  variant?: { size?: string; temperature?: string } | null
  product: { name: string }
}

interface Order {
  id: string
  orderNumber: string
  customerName?: string | null
  tableNumber?: string | null
  status: string
  paymentMethod: string
  paymentStatus: string
  totalAmount: number
  taxAmount: number
  items: OrderItem[]
  cashier: { name: string }
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

  const filteredOrders = statusFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === statusFilter)

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Riwayat Pesanan
          </h1>
          <p className="text-gray-500">Lihat semua pesanan</p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PREPARING">Preparing</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {order.customerName || "-"}
                    {order.tableNumber && (
                      <Badge variant="outline" className="ml-2">
                        Meja {order.tableNumber}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-[#6F4E37]">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(order.createdAt), "dd MMM, HH:mm", { locale: id })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada pesanan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-mono text-lg">{selectedOrder.orderNumber}</span>
                <Badge className={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>

              {selectedOrder.customerName && (
                <p className="text-sm">Pelanggan: {selectedOrder.customerName}</p>
              )}
              {selectedOrder.tableNumber && (
                <p className="text-sm">Meja: {selectedOrder.tableNumber}</p>
              )}
              <p className="text-sm text-gray-500">
                Kasir: {selectedOrder.cashier?.name || "-"}
              </p>

              <Separator />

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.product.name}
                      {item.variant && (
                        <span className="text-gray-500 ml-1">
                          ({item.variant.size}, {item.variant.temperature})
                        </span>
                      )}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Pajak</span>
                  <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#6F4E37]">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="secondary">{selectedOrder.paymentMethod}</Badge>
                <Badge variant={selectedOrder.paymentStatus === "PAID" ? "default" : "outline"}>
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>

              <p className="text-xs text-gray-400">
                {format(new Date(selectedOrder.createdAt), "dd MMMM yyyy, HH:mm:ss", { locale: id })}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
