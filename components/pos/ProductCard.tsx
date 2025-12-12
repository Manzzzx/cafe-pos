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
        className="cursor-pointer group bg-white border overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ 
          borderColor: 'var(--coffee-latte)',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(60, 42, 33, 0.06)'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(60, 42, 33, 0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(60, 42, 33, 0.06)'
        }}
      >
        <CardContent className="p-0">
          {/* Product Image */}
          <div 
            className="aspect-square relative overflow-hidden"
            style={{ backgroundColor: 'var(--coffee-cream)' }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Coffee className="h-16 w-16" style={{ color: 'var(--coffee-latte)' }} />
              </div>
            )}
            
            {/* Quick add button overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <Button
                size="sm"
                className="rounded-full px-4 font-semibold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--coffee-success) 0%, var(--coffee-success-light) 100%)',
                  color: 'white'
                }}
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
                  <Badge className="bg-blue-500/90 text-white text-xs border-0 rounded-full">
                    <Snowflake className="h-3 w-3 mr-1" />
                    Ice
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <Badge 
              variant="secondary" 
              className="text-xs mb-2 rounded-full"
              style={{ 
                backgroundColor: 'var(--coffee-cream)', 
                color: 'var(--coffee-dark)' 
              }}
            >
              {product.category.name}
            </Badge>
            <h3 
              className="font-semibold truncate"
              style={{ color: 'var(--coffee-dark)' }}
            >
              {product.name}
            </h3>
            <p 
              className="font-bold mt-1 text-lg"
              style={{ color: 'var(--coffee-caramel)' }}
            >
              {formatCurrency(product.price)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selection Modal */}
      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: 'var(--coffee-cream)' }}
              >
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Coffee className="h-7 w-7" style={{ color: 'var(--coffee-primary)' }} />
                )}
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--coffee-dark)' }}>{product.name}</p>
                <p className="text-sm font-bold" style={{ color: 'var(--coffee-caramel)' }}>{formatCurrency(product.price)}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Size Selection */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium" style={{ color: 'var(--coffee-dark)' }}>Ukuran</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                  {product.variants.sizes.map((size) => (
                    <div key={size} className="flex-1">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex items-center justify-center p-3 border-2 rounded-full cursor-pointer transition-all peer-data-[state=checked]:border-[#6F4E37] peer-data-[state=checked]:bg-[#F5F0E1] peer-data-[state=checked]:text-[#6F4E37] hover:bg-[#F5F0E1]"
                        style={{ borderColor: 'var(--coffee-latte)' }}
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
                <Label className="text-sm font-medium" style={{ color: 'var(--coffee-dark)' }}>Suhu</Label>
                <RadioGroup value={selectedTemp} onValueChange={setSelectedTemp} className="flex gap-2">
                  {product.variants.temperatures.map((temp) => (
                    <div key={temp} className="flex-1">
                      <RadioGroupItem value={temp} id={`temp-${temp}`} className="peer sr-only" />
                      <Label
                        htmlFor={`temp-${temp}`}
                        className="flex items-center justify-center gap-2 p-3 border-2 rounded-full cursor-pointer transition-all peer-data-[state=checked]:border-[#6F4E37] peer-data-[state=checked]:bg-[#F5F0E1] peer-data-[state=checked]:text-[#6F4E37] hover:bg-[#F5F0E1]"
                        style={{ borderColor: 'var(--coffee-latte)' }}
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
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: 'linear-gradient(135deg, var(--coffee-success) 0%, var(--coffee-success-light) 100%)',
                color: 'white'
              }}
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

