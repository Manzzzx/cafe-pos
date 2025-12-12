"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCartStore, CartItem } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingCart, Coffee, MessageSquare, X, User } from "lucide-react"

interface CartSidebarProps {
  onCheckout: () => void
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, updateNotes, getTotal, getTax, getGrandTotal, clearCart, getItemCount } =
    useCartStore()
  const [customerName, setCustomerName] = useState("")

  const handleCheckout = () => {
    // Store customer name in session storage for checkout page
    if (customerName.trim()) {
      sessionStorage.setItem('posCustomerName', customerName.trim())
    }
    onCheckout()
  }

  return (
    <div 
      className="w-80 lg:w-96 bg-white border-l flex flex-col h-screen sticky top-0"
      style={{ borderColor: 'var(--coffee-latte)' }}
    >
      {/* Header - Espresso Dark */}
      <div 
        className="p-4 border-b"
        style={{ 
          background: 'linear-gradient(135deg, var(--coffee-dark) 0%, var(--coffee-darker) 100%)',
          borderColor: 'var(--coffee-dark)'
        }}
      >
        <h2 className="font-bold text-white flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Current Order
          {getItemCount() > 0 && (
            <span 
              className="ml-auto text-sm font-bold px-2.5 py-0.5 rounded-full"
              style={{ 
                backgroundColor: 'var(--coffee-caramel)',
                color: 'var(--coffee-darker)'
              }}
            >
              {getItemCount()}
            </span>
          )}
        </h2>
      </div>

      {/* Customer Name Input */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--coffee-latte)', backgroundColor: 'var(--coffee-bg)' }}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--coffee-latte)' }} />
          <Input
            placeholder="Nama pelanggan..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="pl-10 h-10 rounded-full border-2 text-sm"
            style={{ borderColor: 'var(--coffee-latte)', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-coffee" style={{ backgroundColor: 'var(--coffee-bg)' }}>
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center" style={{ color: 'var(--coffee-latte)' }}>
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--coffee-cream)' }}
            >
              <Coffee className="h-10 w-10" style={{ color: 'var(--coffee-latte)' }} />
            </div>
            <p className="text-center font-medium" style={{ color: 'var(--coffee-dark)' }}>Keranjang kosong</p>
            <p className="text-sm text-center mt-1" style={{ color: 'var(--coffee-latte)' }}>Pilih menu untuk memulai</p>
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
        <div 
          className="p-4 border-t space-y-4"
          style={{ 
            borderColor: 'var(--coffee-latte)',
            backgroundColor: 'var(--coffee-cream)'
          }}
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between" style={{ color: 'var(--coffee-dark)' }}>
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(getTotal())}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--coffee-primary)' }}>
              <span>Pajak (5%)</span>
              <span>{formatCurrency(getTax())}</span>
            </div>
            <Separator style={{ backgroundColor: 'var(--coffee-latte)' }} />
            <div className="flex justify-between font-bold text-lg">
              <span style={{ color: 'var(--coffee-dark)' }}>Total</span>
              <span style={{ color: 'var(--coffee-caramel)' }}>{formatCurrency(getGrandTotal())}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={clearCart} 
              className="flex-1 rounded-full font-medium"
              style={{ 
                borderColor: 'var(--coffee-latte)',
                color: 'var(--coffee-dark)'
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleCheckout} 
              className="flex-1 rounded-full font-semibold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--coffee-caramel) 0%, var(--coffee-accent) 100%)',
                color: 'var(--coffee-darker)',
                boxShadow: '0 4px 12px rgba(212, 165, 116, 0.4)'
              }}
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
    <Card 
      className="p-3 transition-colors"
      style={{ 
        borderColor: 'var(--coffee-latte)',
        backgroundColor: 'white',
        borderRadius: '0.75rem'
      }}
    >
      <div className="flex gap-3">
        {/* Image */}
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
          style={{ backgroundColor: 'var(--coffee-cream)' }}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Coffee className="h-6 w-6" style={{ color: 'var(--coffee-latte)' }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-sm truncate" style={{ color: 'var(--coffee-dark)' }}>{item.name}</h4>
              {item.variant && (
                <p className="text-xs" style={{ color: 'var(--coffee-primary)' }}>
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
            <p className="text-sm font-bold" style={{ color: 'var(--coffee-caramel)' }}>
              {formatCurrency(item.price * item.quantity)}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full"
                style={{ borderColor: 'var(--coffee-latte)' }}
                onClick={() => onUpdateQuantity(item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium text-sm" style={{ color: 'var(--coffee-dark)' }}>{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full"
                style={{ borderColor: 'var(--coffee-latte)' }}
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
            className="h-6 text-xs px-0 mt-1"
            style={{ color: 'var(--coffee-primary)' }}
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
                className="text-xs h-8 pr-8 rounded-lg"
                style={{ borderColor: 'var(--coffee-latte)' }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-8 w-8"
                style={{ color: 'var(--coffee-latte)' }}
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

