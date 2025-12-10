"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCartStore, CartItem } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingCart, Coffee, MessageSquare, X } from "lucide-react"

interface CartSidebarProps {
  onCheckout: () => void
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, updateNotes, getTotal, getTax, getGrandTotal, clearCart, getItemCount } =
    useCartStore()

  return (
    <div className="w-80 lg:w-96 bg-white border-l border-stone-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-linear-to-r from-amber-500 to-orange-600">
        <h2 className="font-bold text-white flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Keranjang
          {getItemCount() > 0 && (
            <span className="ml-auto bg-white text-amber-600 text-sm font-bold px-2 py-0.5 rounded-full">
              {getItemCount()}
            </span>
          )}
        </h2>
      </div>

      {/* Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400">
            <Coffee className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-center">Keranjang kosong</p>
            <p className="text-sm text-center mt-1">Pilih produk untuk memulai</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
              onUpdateNotes={(notes) => updateNotes(item.id, notes)}
            />
          ))
        )}
      </div>

      {/* Summary - Fixed */}
      {items.length > 0 && (
        <div className="p-4 border-t border-stone-200 bg-stone-50/50 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(getTotal())}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Pajak (5%)</span>
              <span>{formatCurrency(getTax())}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-amber-600">{formatCurrency(getGrandTotal())}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={clearCart} 
              className="flex-1 border-stone-300 hover:bg-stone-100"
            >
              Batal
            </Button>
            <Button 
              onClick={onCheckout} 
              className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/25"
            >
              Bayar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Cart Item Component
function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateNotes,
}: {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
  onUpdateNotes: (notes: string) => void
}) {
  const [showNotes, setShowNotes] = useState(false)

  return (
    <Card className="p-3 border-stone-200 hover:border-amber-200 transition-colors">
      <div className="flex gap-3">
        {/* Image */}
        <div className="w-14 h-14 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Coffee className="h-6 w-6 text-amber-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-sm text-stone-800 truncate">{item.name}</h4>
              {item.variant && (
                <p className="text-xs text-stone-500">
                  {item.variant.size} • {item.variant.temperature}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 hover:bg-red-50 hover:text-red-500 shrink-0"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price & Quantity */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-amber-600">
              {formatCurrency(item.price * item.quantity)}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-stone-200"
                onClick={() => onUpdateQuantity(item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-stone-200"
                onClick={() => onUpdateQuantity(item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Notes Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-stone-500 hover:text-amber-600 px-0 mt-1"
            onClick={() => setShowNotes(!showNotes)}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            {item.notes ? "Edit catatan" : "Tambah catatan"}
          </Button>

          {/* Notes Input */}
          {showNotes && (
            <div className="mt-2 relative">
              <Input
                value={item.notes || ""}
                onChange={(e) => onUpdateNotes(e.target.value)}
                placeholder="Catatan: tanpa gula, extra shot, dll"
                className="text-xs h-8 pr-8"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-8 w-8 text-stone-400 hover:text-stone-600"
                onClick={() => setShowNotes(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
