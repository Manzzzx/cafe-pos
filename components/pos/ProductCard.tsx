"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Plus } from "lucide-react"

interface ProductVariants {
  sizes?: string[]
  temperatures?: string[]
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl?: string | null
    categoryId: string
    variants?: ProductVariants | null
    category: { id: string; name: string }
  }
  onAddToCart: (product: ProductCardProps["product"], variant?: { size?: string; temperature?: string }) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleClick = () => {
    // Simple add - TODO: show variant dialog if has variants
    onAddToCart(product, { size: "Regular", temperature: "Hot" })
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">☕</span>
          )}
        </div>

        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-[#6F4E37] font-bold text-sm">
          {formatCurrency(product.price)}
        </p>

        {product.variants && (
          <div className="flex gap-1 mt-2">
            {product.variants.temperatures?.includes("Iced") && (
              <Badge variant="secondary" className="text-xs">
                Ice
              </Badge>
            )}
          </div>
        )}

        <Button
          size="sm"
          className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-1" /> Tambah
        </Button>
      </CardContent>
    </Card>
  )
}
