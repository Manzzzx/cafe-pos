"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, QrCode, Banknote, Check, Loader2, Coffee, Receipt, UtensilsCrossed, ShoppingBag } from "lucide-react"
import { QRISDisplay } from "@/components/pos/QRISDisplay"

type PaymentMethod = "CASH" | "QRIS" | "CARD"
type OrderType = "DINE_IN" | "TAKE_AWAY"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotal, getTax, getGrandTotal, clearCart } = useCartStore()
  
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN")
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [cashAmount, setCashAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Load customer name from session storage (set in CartSidebar)
  useEffect(() => {
    const savedName = sessionStorage.getItem('posCustomerName')
    if (savedName) {
      setCustomerName(savedName)
      sessionStorage.removeItem('posCustomerName')
    }
  }, [])

  const grandTotal = getGrandTotal()
  const change = paymentMethod === "CASH" ? Number(cashAmount) - grandTotal : 0

  const canSubmit = () => {
    if (items.length === 0) return false
    if (paymentMethod === "CASH" && Number(cashAmount) < grandTotal) return false
    return true
  }

  const handleSubmit = useCallback(async () => {
    if (!canSubmit()) {
      if (paymentMethod === "CASH" && Number(cashAmount) < grandTotal) {
        alert("Jumlah uang kurang!")
      }
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
          cashierId: session?.user?.id || "unknown",
          customerName: customerName || null,
          tableNumber: orderType === "DINE_IN" ? (tableNumber || null) : null,
          notes: notes || null,
          paymentMethod,
          orderType,
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
  }, [items, session, customerName, tableNumber, notes, paymentMethod, orderType, cashAmount, grandTotal, clearCart])

  // Keyboard shortcut: Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading && canSubmit()) {
        e.preventDefault()
        handleSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit, isLoading])

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--coffee-bg) 0%, var(--coffee-cream) 100%)' }}>
        <Card className="w-full max-w-md text-center border-0 shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(60, 42, 33, 0.15)' }}>
          <CardContent className="pt-10 pb-8 px-8">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce"
              style={{ 
                background: 'linear-gradient(135deg, var(--coffee-success) 0%, var(--coffee-success-light) 100%)',
                boxShadow: '0 10px 25px rgba(74, 124, 89, 0.3)'
              }}
            >
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--coffee-success)' }}>Pembayaran Berhasil!</h2>
            <p className="mb-6" style={{ color: 'var(--coffee-primary)' }}>Pesanan sedang diproses</p>
            
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--coffee-cream)' }}>
              <p className="text-sm mb-1" style={{ color: 'var(--coffee-primary)' }}>Nomor Pesanan</p>
              <p className="text-3xl font-mono font-bold" style={{ color: 'var(--coffee-caramel)' }}>{orderNumber}</p>
            </div>
            
            {paymentMethod === "CASH" && change > 0 && (
              <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: 'var(--coffee-cream)', border: '1px solid var(--coffee-latte)' }}>
                <p className="text-sm" style={{ color: 'var(--coffee-dark)' }}>Kembalian</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--coffee-success)' }}>{formatCurrency(change)}</p>
              </div>
            )}

            <Button 
              onClick={() => router.push("/pos")} 
              className="w-full h-12 rounded-full font-semibold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--coffee-caramel) 0%, var(--coffee-accent) 100%)',
                color: 'var(--coffee-darker)',
                boxShadow: '0 4px 12px rgba(212, 165, 116, 0.4)'
              }}
            >
              <Receipt className="h-5 w-5 mr-2" />
              Pesanan Baru
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--coffee-bg) 0%, var(--coffee-cream) 100%)' }}>
        <Card className="w-full max-w-md text-center border-0 shadow-xl rounded-2xl">
          <CardContent className="pt-10 pb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--coffee-cream)' }}>
              <Coffee className="h-10 w-10" style={{ color: 'var(--coffee-latte)' }} />
            </div>
            <p className="mb-4" style={{ color: 'var(--coffee-dark)' }}>Keranjang kosong</p>
            <Button 
              onClick={() => router.push("/pos")} 
              variant="outline"
              className="rounded-full"
              style={{ borderColor: 'var(--coffee-latte)', color: 'var(--coffee-dark)' }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke POS
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'linear-gradient(135deg, var(--coffee-bg) 0%, var(--coffee-cream) 100%)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push("/pos")}
            className="rounded-full"
            style={{ borderColor: 'var(--coffee-latte)' }}
          >
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--coffee-dark)' }} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--coffee-dark)' }}>Checkout</h1>
            <p className="text-sm" style={{ color: 'var(--coffee-primary)' }}>{items.length} item • Tekan Enter untuk bayar</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Type Toggle */}
            <Card className="border-0 shadow-lg shadow-stone-200/50">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={orderType === "DINE_IN" ? "default" : "outline"}
                    className={`flex-1 h-12 ${orderType === "DINE_IN" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" : ""}`}
                    onClick={() => setOrderType("DINE_IN")}
                  >
                    <UtensilsCrossed className="h-5 w-5 mr-2" />
                    Dine In
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === "TAKE_AWAY" ? "default" : "outline"}
                    className={`flex-1 h-12 ${orderType === "TAKE_AWAY" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" : ""}`}
                    onClick={() => setOrderType("TAKE_AWAY")}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Take Away
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-0 shadow-lg shadow-stone-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-stone-500">
                          {item.variant.size} • {item.variant.temperature}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-amber-600">📝 {item.notes}</p>
                      )}
                      <p className="text-sm text-stone-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-stone-800">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Pajak (5%)</span>
                    <span>{formatCurrency(getTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span>Total</span>
                    <span className="text-amber-600">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="border-0 shadow-lg shadow-stone-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Info Pelanggan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Pelanggan</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Opsional"
                    className="border-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {orderType === "DINE_IN" && (
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber">Nomor Meja</Label>
                      <Input
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Contoh: 5"
                        className="border-stone-200"
                      />
                    </div>
                  )}
                  <div className={`space-y-2 ${orderType === "TAKE_AWAY" ? "col-span-2" : ""}`}>
                    <Label htmlFor="notes">Catatan</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Opsional"
                      className="border-stone-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Method */}
            <Card className="border-0 shadow-lg shadow-stone-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "CASH" ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                    <RadioGroupItem value="CASH" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="font-medium">Tunai</span>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "QRIS" ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                    <RadioGroupItem value="QRIS" id="qris" />
                    <Label htmlFor="qris" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <QrCode className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">QRIS</span>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "CARD" ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                    <RadioGroupItem value="CARD" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Kartu Debit/Kredit</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Cash Amount Input */}
                {paymentMethod === "CASH" && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashAmount">Jumlah Uang</Label>
                      <Input
                        id="cashAmount"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Masukkan jumlah uang"
                        className="h-12 text-lg border-stone-200"
                      />
                    </div>
                    {Number(cashAmount) >= grandTotal && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                        <p className="text-sm text-stone-600">Kembalian</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {formatCurrency(change)}
                        </p>
                      </div>
                    )}
                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[grandTotal, 50000, 100000, 200000].map((amount, i) => (
                        <Button
                          key={i}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCashAmount(String(Math.ceil(amount)))}
                          className="border-stone-200 text-xs"
                        >
                          {i === 0 ? "Uang Pas" : formatCurrency(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* QRIS Display */}
                {paymentMethod === "QRIS" && (
                  <div className="mt-6 py-4">
                    <QRISDisplay merchantName="Kafe POS" amount={grandTotal} />
                  </div>
                )}

                {/* Card Payment Info */}
                {paymentMethod === "CARD" && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl text-center">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm text-stone-600">Gunakan mesin EDC untuk pembayaran kartu</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !canSubmit()}
              className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  {paymentMethod === "QRIS" ? "Konfirmasi Pembayaran QRIS" : `Bayar ${formatCurrency(grandTotal)}`}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-stone-400">
              Kasir: {session?.user?.name || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
