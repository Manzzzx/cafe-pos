"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Plus, Coffee, Thermometer, Snowflake } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ProductVariants {
  sizes?: string[]
  temperatures?: string[]
}

interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  categoryId: string
  variants?: ProductVariants | null
  category: { id: string; name: string }
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, variant?: { size?: string; temperature?: string }) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showVariantModal, setShowVariantModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("Regular")
  const [selectedTemp, setSelectedTemp] = useState<string>("Hot")

  const hasVariants = product.variants && 
    ((product.variants.sizes && product.variants.sizes.length > 0) || 
     (product.variants.temperatures && product.variants.temperatures.length > 0))

  const handleClick = () => {
    if (hasVariants) {
      // Reset selections
      setSelectedSize(product.variants?.sizes?.[0] || "Regular")
      setSelectedTemp(product.variants?.temperatures?.[0] || "Hot")
      setShowVariantModal(true)
    } else {
      // Direct add
      onAddToCart(product)
    }
  }

  const handleAddWithVariant = () => {
    onAddToCart(product, { size: selectedSize, temperature: selectedTemp })
    setShowVariantModal(false)
  }

  return (
    <>
      <Card
        className="cursor-pointer group bg-white border-0 shadow-lg shadow-stone-200/50 hover:shadow-xl hover:shadow-amber-200/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        onClick={handleClick}
      >
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="aspect-square bg-linear-to-br from-amber-50 to-orange-50 relative overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-amber-300" />
              </div>
            )}
            
            {/* Quick add button overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <Button
                size="sm"
                className="bg-white/90 text-stone-800 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>

            {/* Variant badges */}
            {hasVariants && (
              <div className="absolute top-2 right-2 flex gap-1">
                {product.variants?.temperatures?.includes("Iced") && (
                  <Badge className="bg-blue-500/90 text-white text-xs border-0">
                    <Snowflake className="h-3 w-3 mr-1" />
                    Ice
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <Badge variant="secondary" className="text-xs mb-2 bg-stone-100 text-stone-600">
              {product.category.name}
            </Badge>
            <h3 className="font-semibold text-stone-800 truncate">{product.name}</h3>
            <p className="text-amber-600 font-bold mt-1">
              {formatCurrency(product.price)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selection Modal */}
      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Coffee className="h-6 w-6 text-amber-600" />
                )}
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-amber-600 font-bold">{formatCurrency(product.price)}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Size Selection */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-stone-700">Ukuran</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                  {product.variants.sizes.map((size) => (
                    <div key={size} className="flex-1">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:text-amber-700 hover:bg-stone-50"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Temperature Selection */}
            {product.variants?.temperatures && product.variants.temperatures.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-stone-700">Suhu</Label>
                <RadioGroup value={selectedTemp} onValueChange={setSelectedTemp} className="flex gap-2">
                  {product.variants.temperatures.map((temp) => (
                    <div key={temp} className="flex-1">
                      <RadioGroupItem value={temp} id={`temp-${temp}`} className="peer sr-only" />
                      <Label
                        htmlFor={`temp-${temp}`}
                        className="flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:text-amber-700 hover:bg-stone-50"
                      >
                        {temp === "Iced" ? (
                          <Snowflake className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Thermometer className="h-4 w-4 text-orange-500" />
                        )}
                        {temp}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <Button 
              onClick={handleAddWithVariant}
              className="w-full h-12 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah ke Keranjang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
