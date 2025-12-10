"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, QrCode, Banknote, Check, Loader2 } from "lucide-react"

type PaymentMethod = "CASH" | "QRIS" | "CARD"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getTax, getGrandTotal, clearCart } = useCartStore()
  
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [cashAmount, setCashAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const grandTotal = getGrandTotal()
  const change = paymentMethod === "CASH" ? Number(cashAmount) - grandTotal : 0

  const handleSubmit = async () => {
    if (items.length === 0) return
    if (paymentMethod === "CASH" && Number(cashAmount) < grandTotal) {
      alert("Jumlah uang kurang!")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            notes: item.notes,
            price: item.price,
          })),
          cashierId: "temp-cashier-id", // TODO: get from session
          customerName: customerName || null,
          tableNumber: tableNumber || null,
          notes: notes || null,
          paymentMethod,
        }),
      })

      if (!response.ok) throw new Error("Failed to create order")

      const order = await response.json()
      setOrderNumber(order.orderNumber)
      setIsSuccess(true)
      clearCart()
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Gagal membuat pesanan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-500 mb-4">Nomor Pesanan</p>
            <p className="text-2xl font-mono font-bold text-[#6F4E37] mb-6">{orderNumber}</p>
            
            {paymentMethod === "CASH" && change > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Kembalian</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(change)}</p>
              </div>
            )}

            <Button 
              onClick={() => router.push("/pos")} 
              className="w-full bg-[#6F4E37] hover:bg-[#5a3f2d]"
            >
              Kembali ke POS
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6">
            <p className="text-gray-500 mb-4">Keranjang kosong</p>
            <Button onClick={() => router.push("/pos")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke POS
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/pos")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {item.variant.size} • {item.variant.temperature}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Pajak (10%)</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#6F4E37]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Info Pelanggan (Opsional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Pelanggan</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama pelanggan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Nomor Meja</Label>
                  <Input
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="CASH" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-green-600" />
                      Tunai
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="QRIS" id="qris" />
                    <Label htmlFor="qris" className="flex items-center gap-2 cursor-pointer flex-1">
                      <QrCode className="h-5 w-5 text-blue-600" />
                      QRIS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="CARD" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      Kartu Debit/Kredit
                    </Label>
                  </div>
                </RadioGroup>

                {/* Cash Amount Input */}
                {paymentMethod === "CASH" && (
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="cashAmount">Jumlah Uang</Label>
                      <Input
                        id="cashAmount"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Masukkan jumlah uang"
                      />
                    </div>
                    {Number(cashAmount) >= grandTotal && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Kembalian</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(change)}
                        </p>
                      </div>
                    )}
                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[50000, 100000, 150000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setCashAmount(String(amount))}
                        >
                          {formatCurrency(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (paymentMethod === "CASH" && Number(cashAmount) < grandTotal)}
              className="w-full h-14 text-lg bg-[#6F4E37] hover:bg-[#5a3f2d]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Bayar {formatCurrency(grandTotal)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
