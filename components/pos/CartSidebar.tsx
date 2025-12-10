"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore, CartItem } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"

interface CartSidebarProps {
  onCheckout: () => void
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotal, getTax, getGrandTotal, clearCart } =
    useCartStore()

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Keranjang ({items.length})
        </h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keranjang kosong
          </div>
        ) : (
          items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="p-4 border-t space-y-3">
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
              <span className="text-[#6F4E37]">{formatCurrency(getGrandTotal())}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCart} className="flex-1">
              Batal
            </Button>
            <Button onClick={onCheckout} className="flex-1 bg-[#6F4E37] hover:bg-[#5a3f2d]">
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
}: {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
}) {
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{item.name}</h4>
          {item.variant && (
            <p className="text-xs text-gray-500">
              {item.variant.size} • {item.variant.temperature}
            </p>
          )}
          <p className="text-sm font-bold text-[#6F4E37] mt-1">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>

        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  )
}
