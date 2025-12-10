"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Coffee, Loader2, Leaf, Cake } from "lucide-react"

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
  category: { id: string; name: string; type?: string }
}

interface Category {
  id: string
  name: string
  type?: string
}

interface ProductGridProps {
  onAddToCart: (product: Product, variant?: { size?: string; temperature?: string }) => void
}

const categoryIcons: Record<string, React.ElementType> = {
  COFFEE: Coffee,
  TEA: Leaf,
  SNACK: Cake,
  DESSERT: Cake,
}

const categoryColors: Record<string, string> = {
  COFFEE: "from-amber-500 to-orange-600",
  TEA: "from-emerald-500 to-teal-600",
  SNACK: "from-pink-500 to-rose-600",
  DESSERT: "from-purple-500 to-violet-600",
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(Array.isArray(productsData) ? productsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !activeCategory || product.categoryId === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="text-stone-500">Memuat produk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-linear-to-br from-stone-50 to-amber-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200/50 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white border-stone-200 rounded-xl text-base"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className={activeCategory === null 
              ? "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25" 
              : "bg-white border-stone-200 hover:bg-stone-50"
            }
          >
            <Coffee className="h-4 w-4 mr-2" />
            Semua
          </Button>
          {categories.map((category) => {
            const Icon = categoryIcons[category.type || "COFFEE"] || Coffee
            const isActive = activeCategory === category.id
            const colorClass = categoryColors[category.type || "COFFEE"] || categoryColors.COFFEE
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={isActive 
                  ? `bg-linear-to-r ${colorClass} text-white border-0 shadow-lg` 
                  : "bg-white border-stone-200 hover:bg-stone-50"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <p className="text-stone-500">Tidak ada produk ditemukan</p>
              {search && (
                <Button
                  variant="link"
                  onClick={() => setSearch("")}
                  className="mt-2 text-amber-600"
                >
                  Reset pencarian
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
