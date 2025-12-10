# Coffee Shop POS - Setup Guide

> Panduan step-by-step untuk setup project dari awal

---

## 📋 Prerequisites

Pastikan sudah terinstall:

```bash
# Check versions
node -v    # >= 18.17.0
npm -v     # >= 9.0.0
```

Jika belum ada, download dari [nodejs.org](https://nodejs.org/)

---

## 🚀 Step 1: Create Next.js Project

```bash
# Masuk ke folder parent
cd d:\Manzz

# Create Next.js project dengan App Router
npx create-next-app@latest coffee-shop-pos
```

Pilih options berikut saat prompt:
```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → No
```

```bash
# Masuk ke project
cd coffee-shop-pos
```

---

## 🎨 Step 2: Setup Shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn@latest init
```

Pilih options:
```
✔ Which style would you like to use? → Default
✔ Which color would you like to use as base color? → Neutral
✔ Would you like to use CSS variables for colors? → Yes
```

### Install komponen yang dibutuhkan:

```bash
# Basic UI components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add separator
```

---

## 🗄️ Step 3: Setup Prisma + PostgreSQL

> ⚠️ **PENTING**: Project ini menggunakan **Prisma 7** yang memiliki breaking changes signifikan dari versi sebelumnya.

### Install Prisma:

```bash
# Install Prisma CLI dan client
npm install prisma @prisma/client

# Install driver adapter untuk PostgreSQL (WAJIB di Prisma 7)
npm install @prisma/adapter-pg pg
npm install -D @types/pg

# Initialize Prisma
npx prisma init
```

### Setup Database (pilih salah satu):

#### Option A: Local PostgreSQL
1. Install PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/)
2. Create database:
```sql
CREATE DATABASE coffee_shop_pos;
```
3. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/coffee_shop_pos"
```

#### Option B: Supabase (Recommended - Free)
1. Buat akun di [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string dari Settings → Database
4. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

### Edit `prisma/schema.prisma` (Prisma 7 Config):

```prisma
generator client {
  provider = "prisma-client"  // BUKAN "prisma-client-js" di Prisma 7
  output   = "../lib/generated/prisma"  // Custom output path
}

datasource db {
  provider = "postgresql"
}
```

> **Note**: Di Prisma 7, `url` tidak lagi didefinisikan di schema, melainkan di `prisma.config.ts`

### Generate Prisma Client:

```bash
# Push schema ke database
npx prisma db push

# Generate client
npx prisma generate

# (Optional) Open Prisma Studio
npx prisma studio
```

---

## 🔐 Step 4: Setup NextAuth.js

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### Generate Auth Secret:

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

# Atau pakai npx
npx auth secret
```

### Update `.env`:

```env
NEXTAUTH_SECRET="[hasil generate di atas]"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📡 Step 5: Setup Pusher (Realtime)

1. Buat akun di [pusher.com](https://pusher.com)
2. Create new Channel app
3. Copy credentials

```bash
npm install pusher pusher-js
```

### Update `.env`:

```env
PUSHER_APP_ID="your_app_id"
PUSHER_KEY="your_key"
PUSHER_SECRET="your_secret"
PUSHER_CLUSTER="ap1"
NEXT_PUBLIC_PUSHER_KEY="your_key"
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
```

---

## 🛒 Step 6: Setup Zustand (State Management)

```bash
npm install zustand
```

---

## 📊 Step 7: Install Additional Dependencies

```bash
# Form handling
npm install react-hook-form zod @hookform/resolvers

# Date utilities
npm install date-fns

# Charts (untuk reports)
npm install recharts

# Icons
npm install lucide-react

# Class utilities
npm install clsx tailwind-merge
```

---

## 📁 Step 8: Create Folder Structure

```bash
# Windows - buat folder structure
mkdir app\auth\login
mkdir app\auth\register
mkdir app\dashboard\admin
mkdir app\dashboard\cashier
mkdir app\dashboard\barista
mkdir app\pos\checkout
mkdir app\kitchen
mkdir app\admin\products
mkdir app\admin\categories
mkdir app\admin\orders
mkdir app\admin\reports
mkdir app\api\auth
mkdir app\api\products
mkdir app\api\orders
mkdir app\api\categories
mkdir components\layout
mkdir components\pos
mkdir components\kitchen
mkdir components\admin
mkdir components\auth
mkdir components\shared
mkdir stores
mkdir public\images\products
```

---

## ✅ Step 9: Verify Setup

### Cek file `.env` lengkap:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Pusher
PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="ap1"
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
```

### Test run:

```bash
npm run dev
```

Buka http://localhost:3000 - harusnya muncul Next.js welcome page.

---

## 🔧 Step 10: Setup Utility Files

### Create `lib/db.ts` (Prisma 7 dengan Driver Adapter):

```typescript
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Create PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create Prisma adapter
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 WAJIB menggunakan driver adapter
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

> ⚠️ **Prisma 7 Breaking Change**: 
> - Import dari `'./generated/prisma/client'` (custom output path)
> - WAJIB menggunakan driver adapter (`@prisma/adapter-pg`)
> - Tidak bisa lagi `new PrismaClient()` tanpa adapter

### Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${dateStr}-${random}`
}
```

---

## 📋 Checklist Setelah Setup

- [✅] Next.js running di localhost:3000
- [✅] Shadcn components ter-install
- [✅] Prisma connected ke database
- [✅] `.env` file lengkap
- [✅] Folder structure sesuai
- [✅] `lib/db.ts` sudah dibuat
- [✅] `lib/utils.ts` sudah dibuat

---

## 🆘 Troubleshooting

### Error: Prisma Client not generated
```bash
npx prisma generate
```

### Error: "Cannot find module './generated/prisma/client'"
Pastikan sudah menjalankan `npx prisma generate` dan output path di schema sudah benar.

### Error: "Expected 1 arguments, but got 0" (Prisma 7)
Prisma 7 WAJIB menggunakan driver adapter. Pastikan:
1. Install adapter: `npm install @prisma/adapter-pg pg`
2. Update `lib/db.ts` sesuai guide di atas
3. Jangan gunakan `new PrismaClient()` tanpa adapter

### Error: "Module '@prisma/client' has no exported member 'PrismaClient'"
Di Prisma 7 dengan custom output, import dari path yang benar:
```typescript
// ❌ SALAH
import { PrismaClient } from '@prisma/client'

// ✅ BENAR
import { PrismaClient } from './generated/prisma/client'
```

### Error: Database connection failed
- Cek DATABASE_URL format
- Pastikan PostgreSQL running
- Cek firewall/network

### Error: Module not found
```bash
npm install
```

### Error: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Atau jalankan di port lain
npm run dev -- -p 3001
```

---

# 🔨 PHASE 2: IMPLEMENTATION

> Setelah setup selesai, lanjut ke implementasi fitur

---

## 📦 Step 11: Setup Prisma Schema

### Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(CASHIER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  variants    Json?
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Category {
  id          String       @id @default(cuid())
  name        String
  description String?
  type        CategoryType
  products    Product[]
  createdAt   DateTime     @default(now())
}

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique
  customerName  String?
  tableNumber   String?
  notes         String?
  items         OrderItem[]
  status        OrderStatus   @default(PENDING)
  totalAmount   Float
  taxAmount     Float
  discount      Float         @default(0)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  cashierId     String
  cashier       User          @relation(fields: [cashierId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)
  variant   Json?
  notes     String?
  price     Float
  subtotal  Float
}

enum Role {
  ADMIN
  CASHIER
  BARISTA
}

enum CategoryType {
  COFFEE
  TEA
  SNACK
  DESSERT
}

enum OrderStatus {
  PENDING
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum PaymentMethod {
  CASH
  QRIS
  CARD
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### Push ke Database:

```bash
npx prisma db push
npx prisma generate
```

---

## 🔐 Step 12: Setup Auth Configuration

### Create `lib/auth.ts`:

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### Create `lib/auth.config.ts` (untuk types):

```typescript
import { Role } from "./generated/prisma/client"

declare module "next-auth" {
  interface User {
    role?: Role
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    id?: string
  }
}
```

### Create API Route `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

---

## 🎨 Step 13: Create Layout Components

### Create `components/layout/Sidebar.tsx`:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Package,
  FolderTree,
  ClipboardList,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  role: string
}

const menuItems = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: FolderTree },
    { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
    { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
    { href: "/admin/users", label: "Pengguna", icon: Users },
  ],
  CASHIER: [
    { href: "/dashboard/cashier", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "Kasir (POS)", icon: ShoppingCart },
    { href: "/admin/orders", label: "Riwayat", icon: ClipboardList },
  ],
  BARISTA: [
    { href: "/dashboard/barista", label: "Dashboard", icon: LayoutDashboard },
    { href: "/kitchen", label: "Kitchen Display", icon: ChefHat },
  ],
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[role as keyof typeof menuItems] || []

  return (
    <aside className="w-64 bg-[#2C1A12] text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#D4A574]">☕ Coffee POS</h1>
        <p className="text-sm text-gray-400">{role}</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-[#4A3728]",
                  isActive && "bg-[#4A3728]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:bg-red-900/20"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
```

### Create `components/layout/Header.tsx`:

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  userName?: string
}

export function Header({ title, userName = "User" }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </header>
  )
}
```

---

## 🔑 Step 14: Create Login Page

### Create `app/auth/login/page.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password salah")
      setLoading(false)
    } else {
      router.push("/dashboard/admin") // TODO: redirect by role
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2C1A12] to-[#4A3728]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">☕</div>
          <CardTitle className="text-2xl">Coffee Shop POS</CardTitle>
          <p className="text-gray-500">Masuk ke akun Anda</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🌱 Step 15: Create Seed Data

### Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role, CategoryType } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10)

  await prisma.user.upsert({
    where: { email: "admin@coffee.com" },
    update: {},
    create: {
      email: "admin@coffee.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: "kasir@coffee.com" },
    update: {},
    create: {
      email: "kasir@coffee.com",
      name: "Kasir",
      password: hashedPassword,
      role: Role.CASHIER,
    },
  })

  await prisma.user.upsert({
    where: { email: "barista@coffee.com" },
    update: {},
    create: {
      email: "barista@coffee.com",
      name: "Barista",
      password: hashedPassword,
      role: Role.BARISTA,
    },
  })

  // Create categories
  const coffeeCategory = await prisma.category.upsert({
    where: { id: "coffee-category" },
    update: {},
    create: {
      id: "coffee-category",
      name: "Coffee",
      description: "Hot & Iced Coffee",
      type: CategoryType.COFFEE,
    },
  })

  const teaCategory = await prisma.category.upsert({
    where: { id: "tea-category" },
    update: {},
    create: {
      id: "tea-category",
      name: "Tea",
      description: "Hot & Iced Tea",
      type: CategoryType.TEA,
    },
  })

  const snackCategory = await prisma.category.upsert({
    where: { id: "snack-category" },
    update: {},
    create: {
      id: "snack-category",
      name: "Snack",
      description: "Makanan Ringan",
      type: CategoryType.SNACK,
    },
  })

  // Create products
  const products = [
    {
      name: "Espresso",
      description: "Strong black coffee",
      price: 18000,
      categoryId: coffeeCategory.id,
      variants: { sizes: ["Single", "Double"], temperatures: ["Hot"] },
    },
    {
      name: "Americano",
      description: "Espresso with hot water",
      price: 22000,
      categoryId: coffeeCategory.id,
      variants: { sizes: ["Regular", "Large"], temperatures: ["Hot", "Iced"] },
    },
    {
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      price: 28000,
      categoryId: coffeeCategory.id,
      variants: { sizes: ["Regular", "Large"], temperatures: ["Hot", "Iced"] },
    },
    {
      name: "Caffe Latte",
      description: "Espresso with steamed milk",
      price: 28000,
      categoryId: coffeeCategory.id,
      variants: { sizes: ["Regular", "Large"], temperatures: ["Hot", "Iced"] },
    },
    {
      name: "Green Tea Latte",
      description: "Matcha with steamed milk",
      price: 30000,
      categoryId: teaCategory.id,
      variants: { sizes: ["Regular", "Large"], temperatures: ["Hot", "Iced"] },
    },
    {
      name: "Croissant",
      description: "Buttery French pastry",
      price: 25000,
      categoryId: snackCategory.id,
      variants: null,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log("✅ Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Update `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### Install ts-node dan run seed:

```bash
npm install -D ts-node
npx prisma db seed
```

---

## 🛒 Step 16: Create Cart Store (Zustand)

### Create `stores/cart-store.ts`:

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  variant?: {
    size?: string
    temperature?: string
  }
  notes?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getTax: () => number
  getGrandTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = `${item.productId}-${item.variant?.size}-${item.variant?.temperature}-${Date.now()}`
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTax: () => {
        return get().getTotal() * 0.1 // 10% tax
      },

      getGrandTotal: () => {
        return get().getTotal() + get().getTax()
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation ✅
- [✅] Prisma schema created
- [✅] Auth configuration done
- [✅] Layout components created
- [✅] Login page working
- [✅] Seed data added
- [✅] Cart store created

### Phase 2: POS Interface
- [✅] Product grid page
- [✅] Product card component
- [✅] Cart sidebar
- [✅] Checkout modal
- [✅] Create order API

### Phase 3: Kitchen Display
- [ ] Order queue component
- [ ] Pusher realtime setup
- [ ] Status update functionality

### Phase 4: Admin Pages
- [ ] Product CRUD
- [ ] Category CRUD
- [ ] Order management
- [ ] Reports/Analytics

---

# 🛒 PHASE 3: POS INTERFACE

> Build tampilan kasir untuk input pesanan

---

## 📦 Step 17: Create Product API Routes

### Create `app/api/products/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await db.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
```

### Create `app/api/categories/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
```

---

## 🎴 Step 18: Create Product Card Component

### Create `components/pos/ProductCard.tsx`:

```tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Plus } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl?: string | null
    variants?: {
      sizes?: string[]
      temperatures?: string[]
    } | null
  }
  onAddToCart: (product: any, variant?: any) => void
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
```

---

## 📋 Step 19: Create Product Grid Component

### Create `components/pos/ProductGrid.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  categoryId: string
  variants?: any
  category: { id: string; name: string }
}

interface Category {
  id: string
  name: string
}

interface ProductGridProps {
  onAddToCart: (product: Product, variant?: any) => void
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

      setProducts(productsData)
      setCategories(categoriesData)
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
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b flex gap-2 overflow-x-auto">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
        >
          Semua
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada produk ditemukan
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🛒 Step 20: Create Cart Sidebar Component

### Create `components/pos/CartSidebar.tsx`:

```tsx
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
```

---

## 🖥️ Step 21: Create POS Page

### Create `app/pos/page.tsx`:

```tsx
"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/pos/ProductGrid"
import { CartSidebar } from "@/components/pos/CartSidebar"
import { useCartStore } from "@/stores/cart-store"
import { useRouter } from "next/navigation"

export default function POSPage() {
  const router = useRouter()
  const { addItem } = useCartStore()

  const handleAddToCart = (product: any, variant?: any) => {
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
```

---

## 💳 Step 22: Create Order API

### Create `app/api/orders/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateOrderNumber } from "@/lib/utils"

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: { include: { product: true } },
        cashier: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, cashierId, customerName, tableNumber, paymentMethod, notes } = body

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const taxAmount = subtotal * 0.1
    const totalAmount = subtotal + taxAmount

    // Create order with items
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        tableNumber,
        notes,
        totalAmount,
        taxAmount,
        paymentMethod,
        paymentStatus: "PAID",
        cashierId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            notes: item.notes,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })

    // TODO: Trigger Pusher event for kitchen display

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
```

---

# 👨‍🍳 PHASE 4: KITCHEN DISPLAY

> Build tampilan dapur untuk barista

---

## 📡 Step 23: Setup Pusher Configuration

### Create `lib/pusher.ts` (Server):

```typescript
import Pusher from "pusher"

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})
```

### Create `lib/pusher-client.ts` (Client):

```typescript
import PusherClient from "pusher-js"

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
)
```

---

## 📋 Step 24: Create Order Queue Component

### Create `components/kitchen/OrderQueue.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pusherClient } from "@/lib/pusher-client"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Clock, Check, ChefHat } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  variant?: { size?: string; temperature?: string }
  notes?: string
  product: { name: string }
}

interface Order {
  id: string
  orderNumber: string
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED"
  customerName?: string
  tableNumber?: string
  items: OrderItem[]
  createdAt: string
}

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()

    // Subscribe to realtime updates
    const channel = pusherClient.subscribe("orders")

    channel.bind("order-created", (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev])
      // Play notification sound
      new Audio("/sounds/notification.mp3").play().catch(() => {})
    })

    channel.bind("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      )
    })

    return () => {
      pusherClient.unsubscribe("orders")
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/kitchen")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING")
  const preparingOrders = orders.filter((o) => o.status === "PREPARING")
  const readyOrders = orders.filter((o) => o.status === "READY")

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen bg-gray-100">
      {/* Pending Column */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          Menunggu ({pendingOrders.length})
        </h2>
        {pendingOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            actionLabel="Mulai Buat"
            actionColor="bg-blue-500"
            onAction={() => updateStatus(order.id, "PREPARING")}
          />
        ))}
      </div>

      {/* Preparing Column */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-blue-500" />
          Diproses ({preparingOrders.length})
        </h2>
        {preparingOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            actionLabel="Siap"
            actionColor="bg-green-500"
            onAction={() => updateStatus(order.id, "READY")}
          />
        ))}
      </div>

      {/* Ready Column */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          Siap ({readyOrders.length})
        </h2>
        {readyOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            actionLabel="Selesai"
            actionColor="bg-gray-500"
            onAction={() => updateStatus(order.id, "COMPLETED")}
          />
        ))}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  actionLabel,
  actionColor,
  onAction,
}: {
  order: Order
  actionLabel: string
  actionColor: string
  onAction: () => void
}) {
  return (
    <Card className="animate-in slide-in-from-top">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">#{order.orderNumber.slice(-6)}</CardTitle>
          <Badge variant="outline">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: id })}
          </Badge>
        </div>
        {order.customerName && (
          <p className="text-sm text-gray-500">{order.customerName}</p>
        )}
        {order.tableNumber && (
          <p className="text-sm text-gray-500">Meja: {order.tableNumber}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.product.name}
              {item.variant && (
                <span className="text-gray-500 ml-1">
                  ({item.variant.size}, {item.variant.temperature})
                </span>
              )}
            </span>
          </div>
        ))}

        <Button onClick={onAction} className={`w-full mt-4 ${actionColor}`}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🖥️ Step 25: Create Kitchen Page

### Create `app/kitchen/page.tsx`:

```tsx
import { OrderQueue } from "@/components/kitchen/OrderQueue"

export default function KitchenPage() {
  return <OrderQueue />
}
```

### Create `app/api/orders/kitchen/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: {
        status: { in: ["PENDING", "PREPARING", "READY"] },
      },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
```

### Create `app/api/orders/[id]/status/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        items: { include: { product: true } },
      },
    })

    // Trigger realtime update
    await pusherServer.trigger("orders", "order-updated", order)

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}
```

---

## ✅ Final Checklist

### Phase 1: Foundation
- [ ] Prisma schema created & pushed
- [ ] Auth configuration done
- [ ] Layout components created
- [ ] Login page working
- [ ] Seed data added

### Phase 2: POS Interface
- [ ] Product & Category APIs
- [ ] ProductCard component
- [ ] ProductGrid component
- [ ] CartSidebar component
- [ ] POS page working
- [ ] Order creation working

### Phase 3: Kitchen Display
- [ ] Pusher configured
- [ ] OrderQueue component
- [ ] Kitchen page working
- [ ] Realtime updates working
- [ ] Status update working

### Phase 4: Admin Pages
- [ ] Product CRUD
- [ ] Category CRUD
- [ ] Order management
- [ ] Reports dashboard

---

## 🧪 Testing Checklist

1. **Login Test**
   - `admin@coffee.com` / `password123`
   - `kasir@coffee.com` / `password123`
   - `barista@coffee.com` / `password123`

2. **POS Test**
   - Browse products by category
   - Add items to cart
   - Adjust quantity
   - Complete checkout

3. **Kitchen Test**
   - Order appears in kitchen
   - Update status works
   - Realtime updates work

---

> 💡 **Tips**: Jalankan `npm run dev` dan biarkan running. Setiap perubahan akan auto-refresh.
