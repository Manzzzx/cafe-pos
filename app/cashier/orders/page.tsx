"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ClipboardList, Eye, Loader2, Coffee, Receipt } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  price: number
  subtotal: number
  variant?: { size?: string; temperature?: string } | null
  notes?: string | null
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

const statusConfig: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "text-yellow-700", bg: "bg-yellow-100" },
  PREPARING: { color: "text-blue-700", bg: "bg-blue-100" },
  READY: { color: "text-emerald-700", bg: "bg-emerald-100" },
  COMPLETED: { color: "text-stone-700", bg: "bg-stone-100" },
  CANCELLED: { color: "text-red-700", bg: "bg-red-100" },
}

export default function CashierOrdersPage() {
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-linear-to-br from-stone-50 to-amber-50/30 min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            Riwayat Pesanan
          </h1>
          <p className="text-stone-500 mt-1">Lihat riwayat semua pesanan</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">Filter:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white border-stone-200">
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
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/50 hover:bg-stone-50/50">
                  <TableHead className="font-semibold text-stone-600">No. Pesanan</TableHead>
                  <TableHead className="font-semibold text-stone-600">Pelanggan</TableHead>
                  <TableHead className="font-semibold text-stone-600">Status</TableHead>
                  <TableHead className="font-semibold text-stone-600">Pembayaran</TableHead>
                  <TableHead className="font-semibold text-stone-600">Total</TableHead>
                  <TableHead className="font-semibold text-stone-600">Waktu</TableHead>
                  <TableHead className="text-right font-semibold text-stone-600">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusStyle = statusConfig[order.status] || statusConfig.PENDING
                  return (
                    <TableRow key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <TableCell className="font-mono font-semibold text-stone-700">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-700">{order.customerName || "Guest"}</span>
                          {order.tableNumber && (
                            <Badge variant="outline" className="text-xs border-stone-200">
                              Meja {order.tableNumber}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusStyle.bg} ${statusStyle.color} border-0 font-medium`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-amber-700">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell className="text-sm text-stone-500">
                        {format(new Date(order.createdAt), "dd MMM, HH:mm", { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Coffee className="h-12 w-12 mx-auto mb-3 text-stone-300" />
                      <p className="text-stone-400">Tidak ada pesanan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog (Read Only) */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Detail Pesanan</p>
                <p className="text-sm text-stone-500 font-normal">{selectedOrder?.orderNumber}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 mt-2">
              {/* Status & Time */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <Badge className={`${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color} border-0`}>
                  {selectedOrder.status}
                </Badge>
                <span className="text-sm text-stone-500">
                  {format(new Date(selectedOrder.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-1 text-sm">
                {selectedOrder.customerName && (
                  <p><span className="text-stone-400">Pelanggan:</span> <span className="font-medium">{selectedOrder.customerName}</span></p>
                )}
                {selectedOrder.tableNumber && (
                  <p><span className="text-stone-400">Meja:</span> <span className="font-medium">{selectedOrder.tableNumber}</span></p>
                )}
                <p><span className="text-stone-400">Kasir:</span> <span className="font-medium">{selectedOrder.cashier?.name || "-"}</span></p>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-stone-600">Item Pesanan</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-2 rounded-lg bg-stone-50/50">
                    <div className="flex justify-between items-start text-sm">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.product.name}
                        {item.variant && (
                          <span className="text-stone-400 ml-1 text-xs">
                            ({item.variant.size}, {item.variant.temperature})
                          </span>
                        )}
                        {item.notes && (
                          <p className="text-xs text-amber-600 mt-0.5">📝 {item.notes}</p>
                        )}
                      </div>
                      <span className="font-medium text-stone-700">{formatCurrency(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Pajak</span>
                  <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex gap-2 pt-2">
                <Badge variant="secondary" className="bg-stone-100">{selectedOrder.paymentMethod}</Badge>
                <Badge 
                  className={selectedOrder.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}
                >
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
