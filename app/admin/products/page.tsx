"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Plus, Pencil, Trash2, Package, Search, Coffee, Loader2, Upload, X, ImageIcon, Thermometer, Snowflake } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: string
  name: string
  type: string
}

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  categoryId: string
  category: Category
  isActive: boolean
  variants?: { sizes?: string[]; temperatures?: string[] } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
    hasTemperatureVariant: false,
    hasSizeVariant: false,
    temperatures: ["Hot", "Iced"] as string[],
    sizes: ["Regular", "Large"] as string[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ])
      setProducts(await productsRes.json())
      setCategories(await categoriesRes.json())
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Format file tidak valid. Hanya JPG, PNG, dan WebP yang diperbolehkan.")
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 2MB.")
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()

      if (res.ok) {
        setFormData({ ...formData, imageUrl: data.url })
      } else {
        alert(data.error || "Gagal upload gambar")
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal upload gambar")
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, imageUrl: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const variants = (formData.hasTemperatureVariant || formData.hasSizeVariant) ? {
      temperatures: formData.hasTemperatureVariant ? formData.temperatures : undefined,
      sizes: formData.hasSizeVariant ? formData.sizes : undefined,
    } : null
    
    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || null,
      isActive: formData.isActive,
      variants,
    }

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setDialogOpen(false)
        resetForm()
        fetchData()
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) fetchData()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const hasTemp = !!(product.variants?.temperatures && product.variants.temperatures.length > 0)
    const hasSize = !!(product.variants?.sizes && product.variants.sizes.length > 0)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || "",
      isActive: product.isActive,
      hasTemperatureVariant: hasTemp,
      hasSizeVariant: hasSize,
      temperatures: product.variants?.temperatures || ["Hot", "Iced"],
      sizes: product.variants?.sizes || ["Regular", "Large"],
    })
    setImagePreview(product.imageUrl || null)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
      isActive: true,
      hasTemperatureVariant: false,
      hasSizeVariant: false,
      temperatures: ["Hot", "Iced"],
      sizes: ["Regular", "Large"],
    })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="text-stone-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
            Manajemen Produk
          </h1>
          <p className="text-stone-500 mt-1">Kelola produk coffee shop</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-white border-stone-200"
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Gambar Produk</Label>
                  <div className="flex flex-col items-center gap-3">
                    {/* Preview */}
                    <div className="relative w-full h-40 bg-stone-100 rounded-xl border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                          ) : (
                            <>
                              <ImageIcon className="h-10 w-10 mx-auto text-stone-400 mb-2" />
                              <p className="text-sm text-stone-500">Klik atau drag gambar</p>
                              <p className="text-xs text-stone-400">JPG, PNG, WebP (Max 2MB)</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Mengupload...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Cappuccino"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat produk"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="space-y-4 pt-2 border-t border-stone-200">
                  <Label className="text-sm font-semibold">Varian Produk</Label>
                  
                  {/* Temperature Variant */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasTemperature"
                        checked={formData.hasTemperatureVariant}
                        onCheckedChange={(checked: boolean) => 
                          setFormData({ ...formData, hasTemperatureVariant: checked })
                        }
                      />
                      <Label htmlFor="hasTemperature" className="cursor-pointer flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        Hot / Iced
                      </Label>
                    </div>
                    {formData.hasTemperatureVariant && (
                      <div className="ml-6 flex gap-2">
                        {["Hot", "Iced"].map((temp) => (
                          <label
                            key={temp}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                              formData.temperatures.includes(temp)
                                ? "bg-amber-100 border-amber-400 text-amber-800"
                                : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.temperatures.includes(temp)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, temperatures: [...formData.temperatures, temp] })
                                } else {
                                  setFormData({ ...formData, temperatures: formData.temperatures.filter(t => t !== temp) })
                                }
                              }}
                              className="hidden"
                            />
                            {temp === "Iced" ? <Snowflake className="h-3 w-3" /> : <Thermometer className="h-3 w-3" />}
                            <span className="text-sm">{temp}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Size Variant */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasSize"
                        checked={formData.hasSizeVariant}
                        onCheckedChange={(checked: boolean) => 
                          setFormData({ ...formData, hasSizeVariant: checked })
                        }
                      />
                      <Label htmlFor="hasSize" className="cursor-pointer flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        Ukuran (Size)
                      </Label>
                    </div>
                    {formData.hasSizeVariant && (
                      <div className="ml-6 flex gap-2">
                        {["Regular", "Large"].map((size) => (
                          <label
                            key={size}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                              formData.sizes.includes(size)
                                ? "bg-blue-100 border-blue-400 text-blue-800"
                                : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.sizes.includes(size)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, sizes: [...formData.sizes, size] })
                                } else {
                                  setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) })
                                }
                              }}
                              className="hidden"
                            />
                            <span className="text-sm">{size}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    disabled={saving || uploading}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      editingProduct ? "Simpan Perubahan" : "Tambah Produk"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-lg shadow-stone-200/50 bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/50 hover:bg-stone-50/50">
                  <TableHead className="font-semibold text-stone-600">Produk</TableHead>
                  <TableHead className="font-semibold text-stone-600">Kategori</TableHead>
                  <TableHead className="font-semibold text-stone-600">Harga</TableHead>
                  <TableHead className="font-semibold text-stone-600">Status</TableHead>
                  <TableHead className="text-right font-semibold text-stone-600">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-amber-50/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Coffee className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-stone-400 line-clamp-1">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-100">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-amber-700">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.isActive ? "default" : "outline"}
                        className={product.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(product)}
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Coffee className="h-12 w-12 mx-auto mb-3 text-stone-300" />
                      <p className="text-stone-400">
                        {searchQuery ? "Tidak ada produk yang cocok" : "Belum ada produk"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
