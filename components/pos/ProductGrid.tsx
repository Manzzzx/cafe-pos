"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Coffee, Loader2, Leaf, Cake, Filter } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  categoryId: string
  isActive?: boolean
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
    const isActive = product.isActive !== false
    const matchesCategory = !activeCategory || product.categoryId === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    return isActive && matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-coffee-bg">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-coffee-cream flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-coffee-primary" style={{ color: 'var(--coffee-primary)' }} />
          </div>
          <p className="text-coffee-dark" style={{ color: 'var(--coffee-dark)' }}>Memuat menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-warm-gradient">
      {/* Header */}
      <div className="bg-white border-b p-4 space-y-4 shadow-sm" style={{ borderColor: 'var(--coffee-latte)' }}>
        {/* Search with Filter Button */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--coffee-latte)' }} />
            <Input
              placeholder="Cari menu kopi... (tekan / untuk fokus)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-white rounded-full text-base border-2 focus:border-[#6F4E37] transition-colors"
              style={{ borderColor: 'var(--coffee-latte)' }}
            />
          </div>
          <Button 
            className="h-12 px-6 rounded-full font-semibold"
            style={{ 
              background: 'linear-gradient(135deg, var(--coffee-success) 0%, var(--coffee-success-light) 100%)',
              color: 'white'
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Category Tabs - Pill Style */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`category-pill flex items-center gap-2 whitespace-nowrap ${activeCategory === null ? 'active' : ''}`}
          >
            <Coffee className="h-4 w-4" />
            All
          </button>
          {categories.map((category) => {
            const Icon = categoryIcons[category.type || "COFFEE"] || Coffee
            const isActive = activeCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-pill flex items-center gap-2 whitespace-nowrap ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-coffee">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--coffee-cream)' }}>
                <Coffee className="h-10 w-10" style={{ color: 'var(--coffee-latte)' }} />
              </div>
              <p style={{ color: 'var(--coffee-dark)' }}>Tidak ada menu ditemukan</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ 
                    color: 'var(--coffee-primary)',
                    backgroundColor: 'var(--coffee-cream)'
                  }}
                >
                  Reset pencarian
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

