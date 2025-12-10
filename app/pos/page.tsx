"use client"

import { ProductGrid } from "@/components/pos/ProductGrid"
import { CartSidebar } from "@/components/pos/CartSidebar"
import { useCartStore } from "@/stores/cart-store"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  categoryId: string
  variants?: {
    sizes?: string[]
    temperatures?: string[]
  } | null
  category: { id: string; name: string }
}

export default function POSPage() {
  const router = useRouter()
  const { addItem } = useCartStore()

  const handleAddToCart = (product: Product, variant?: { size?: string; temperature?: string }) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      variant,
    })
  }

  const handleCheckout = () => {
    router.push("/pos/checkout")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Product Grid */}
      <ProductGrid onAddToCart={handleAddToCart} />

      {/* Cart Sidebar */}
      <CartSidebar onCheckout={handleCheckout} />
    </div>
  )
}
