# ☕ Kafe POS

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169e1?logo=postgresql)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [API Routes](#-api-routes)
- [Authentication & Authorization](#-authentication--authorization)
- [Real-time Features](#-real-time-features)
- [Available Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 📋 Overview

**Kafe POS** adalah sistem Point of Sale (POS) modern yang dirancang khusus untuk kafe dan coffee shop. Sistem ini dibangun dengan teknologi terkini dan best practices, menghadirkan solusi lengkap untuk mengelola penjualan, produk, dan operasional dapur secara real-time.

### ✨ Key Highlights

- 🎨 **Modern UI/UX** - Coffee-themed design dengan dark mode support
- 🔐 **Role-Based Access** - Multi-level user permissions (Admin, Cashier, Petugas Dapur)
- ⚡ **Real-time Updates** - Kitchen display dengan Pusher WebSocket
- 📊 **Analytics Dashboard** - Real-time sales statistics dan visualisasi data
- 🛒 **Smart Cart System** - Auto-merge items dengan variant support
- 🖨️ **Multiple Payment Methods** - Cash, QRIS, dan Card payments
- 📱 **Responsive Design** - Seamless experience across all devices
- 🔒 **Secure Authentication** - NextAuth.js v5 dengan session management

---

## ✨ Features

### 🔐 Role-Based Access Control

Sistem permission yang komprehensif dengan 3 level akses:

#### **👨‍💼 Admin**
- **Full Dashboard Access** - Complete overview dengan statistik real-time
- **Product Management** - CRUD operations untuk products & categories
- **Order Management** - View dan manage semua orders
- **Reports & Analytics** - Sales reports dengan charts (Revenue, Orders, Top Products)
- **User Management** - Create dan manage staff accounts
- **System Configuration** - Settings dan preferences

#### **💰 Cashier**
- **POS Interface** - Streamlined checkout experience
- **Product Catalog** - Category filtering dengan search
- **Cart Management** - Add, edit, remove items dengan variants
- **Checkout Process** - Multiple payment methods (Cash/QRIS/Card)
- **Order History** - Read-only access ke order history mereka
- **Quick Shortcuts** - Fast navigation untuk efficiency

#### **👨‍🍳 Chef**
- **Kitchen Display System** - Real-time order queue
- **Order Status Updates** - Drag-and-drop Kanban workflow
- **Timer Monitoring** - Color-coded urgency indicators
- **Full-screen Mode** - Distraction-free kitchen view
- **Order Details** - Per-item notes dan special requests

---

### 💳 Point of Sale (POS)

Sistem kasir yang intuitif dan cepat:

- **Product Grid** 
  - Category tabs untuk quick filtering
  - Search functionality
  - Product images dengan lazy loading
  - Stock indicator
  - Price display dengan currency formatting

- **Variant Selection**
  - Size options (Regular, Large, Extra Large)
  - Temperature (Hot, Iced)
  - Modal dialog untuk customization
  - Price adjustment berdasarkan variant

- **Smart Cart System**
  - Auto-merge items dengan variant yang sama
  - Quantity adjustment (+/-)
  - Per-item notes untuk special requests
  - Real-time subtotal calculation
  - Editable cart items

- **Checkout Flow**
  - Order type selection (Dine-in / Take Away)
  - Table number input (untuk Dine-in)
  - Customer name (optional)
  - Tax calculation (5%)
  - Payment method selection
  - Quick amount buttons untuk exact payment
  - Change calculation otomatis
  - Order confirmation

---

### 📊 Admin Dashboard

Command center dengan visualisasi data lengkap:

- **Real-time Statistics Cards**
  - **Total Revenue** - dengan trend indicator (weekly comparison)
  - **Total Orders** - order count dengan percentage change
  - **Items Sold** - total items terjual
  - **Average Order Value** - kalkulasi rata-rata transaksi

- **Sales Analytics**
  - **Revenue Chart** - Area chart untuk weekly revenue trend
  - **Orders Chart** - Bar chart untuk order volume analysis
  - **Time Period Filter** - Daily, Weekly, Monthly views
  - **Interactive Tooltips** - Hover untuk detail breakdown

- **Recent Orders**
  - Latest 10 orders dengan status badges
  - Order number, customer, amount, dan timestamp
  - Quick action buttons (View Details, Update Status)
  - Auto-refresh setiap 30 detik

- **Quick Actions**
  - Direct links ke Products, Categories, Orders
  - Shortcut ke frequent tasks

---

### 👨‍🍳 Kitchen Display System

Real-time order monitoring untuk dapur:

- **Kanban-Style Workflow**
  - **Pending** - New orders yang masuk
  - **Preparing** - Orders sedang diproses
  - **Ready** - Orders siap untuk pickup

- **Order Cards**
  - Order number dengan bold typography
  - Customer name dan table number
  - Order type badge (Dine-in/Take Away)
  - Item list dengan quantity dan variants
  - Per-item notes (highlighted)
  - Elapsed timer sejak order dibuat

- **Priority Indicators**
  - **Normal** (< 5 min) - White background
  - **Warning** (5-10 min) - Yellow/Amber gradient
  - **Urgent** (> 10 min) - Red gradient
  - Auto-update setiap 1 menit

- **Real-time Updates**
  - Pusher WebSocket integration
  - Instant notification untuk new orders
  - Auto-refresh ketika status berubah
  - Sound notification (optional)

- **Full-screen Mode**
  - Hide navbar untuk maximize screen space
  - Optimized untuk wall-mounted displays
  - Keyboard shortcuts (ESC untuk exit)

---

### 📦 Product Management

Comprehensive product catalog system:

- **Product CRUD**
  - Create product dengan form validation
  - Edit product details
  - Delete dengan confirmation dialog
  - Bulk actions (coming soon)

- **Product Information**
  - Product name (required)
  - Description (Textarea dengan max length)
  - Price (Number input dengan validation)
  - SKU (Optional, auto-generated jika kosong)
  - Stock management
  - Category assignment (Dropdown select)

- **Variant Configuration**
  - Size variants (JSON format)
  - Temperature variants
  - Custom variant options
  - Price modifiers per variant

- **Image Upload**
  - Drag-and-drop file upload
  - Image preview sebelum save
  - Automatic resize dan compression
  - Cloud storage integration ready

- **Category Management**
  - 10+ predefined category types:
    - ☕ Coffee
    - 🍵 Tea
    - 🥤 Non-Coffee (Chocolate, Milk)
    - 🥤 Juice & Smoothie
    - 🍿 Snack
    - 🥐 Pastry & Bakery
    - 🍰 Dessert & Cake
    - 🍽️ Main Course
    - 🥗 Appetizer
    - 📦 Other

- **Active/Inactive Status**
  - Toggle product availability
  - Hide dari POS tanpa delete

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.8 | React framework dengan App Router |
| **React** | 19.2.1 | UI library |
| **TypeScript** | ^5.0 | Type-safe development |
| **Tailwind CSS** | ^4.0 | Utility-first CSS framework |
| **Radix UI** | Latest | Headless UI components |
| **shadcn/ui** | Latest | Pre-built component library |
| **Lucide React** | Latest | Icon library |

### State & Forms

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | ^5.0.9 | Lightweight state management |
| **React Hook Form** | ^7.68.0 | Form handling dengan performance optimization |
| **Zod** | ^4.1.13 | Schema validation |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | Latest | Relational database |
| **Prisma** | ^7.1.0 | Next-gen ORM |
| **@prisma/adapter-pg** | ^7.1.0 | PostgreSQL adapter |

### Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | ^5.0.0-beta.30 | Authentication library |
| **@auth/prisma-adapter** | ^2.11.1 | Prisma adapter untuk NextAuth |
| **bcryptjs** | ^3.0.3 | Password hashing |

### Real-time & Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Pusher** | ^5.2.0 | Real-time WebSocket (server) |
| **pusher-js** | ^8.4.0 | Pusher client library |

### Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | ^3.5.1 | Chart library untuk analytics |
| **date-fns** | ^4.1.0 | Date manipulation |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **clsx** | ^2.1.1 | Conditional className utility |
| **tailwind-merge** | ^3.4.0 | Merge Tailwind classes |
| **class-variance-authority** | ^0.7.1 | Component variants |
| **qrcode** | ^1.5.4 | QR code generation (untuk QRIS) |

---

## 📁 Project Structure

```
cafe-pos/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 admin/                    # Admin dashboard & management
│   │   ├── 📂 dashboard/            # Main admin dashboard
│   │   ├── 📂 products/             # Product management pages
│   │   │   ├── 📂 [id]/             # Edit product
│   │   │   └── 📂 new/              # Create product
│   │   ├── 📂 categories/           # Category management
│   │   └── 📂 orders/               # Order management
│   │
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 auth/                 # NextAuth endpoints
│   │   ├── 📂 products/             # Product CRUD APIs
│   │   ├── 📂 categories/           # Category APIs
│   │   ├── 📂 orders/               # Order APIs
│   │   │   └── 📂 kitchen/          # Kitchen-specific APIs
│   │   └── 📂 upload/               # File upload handler
│   │
│   ├── 📂 auth/                     # Authentication pages
│   │   └── 📂 login/                # Login page
│   │
│   ├── 📂 cashier/                  # Cashier-specific pages
│   │   └── 📂 orders/               # Order history (read-only)
│   │
│   ├── 📂 kitchen/                  # Kitchen Display System
│   │   └── page.tsx                 # KDS main page
│   │
│   ├── 📂 pos/                      # Point of Sale
│   │   ├── 📂 checkout/             # Checkout flow
│   │   └── page.tsx                 # POS main page
│   │
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   └── page.tsx                     # Landing/redirect page
│
├── 📂 components/                   # React Components
│   ├── 📂 layout/                   # Layout components
│   │   ├── AdminLayout.tsx          # Admin sidebar layout
│   │   └── CashierNav.tsx           # Cashier navigation
│   │
│   ├── 📂 pos/                      # POS-specific components
│   │   ├── ProductCard.tsx          # Product display card
│   │   ├── ProductGrid.tsx          # Product grid dengan filtering
│   │   ├── CartSidebar.tsx          # Shopping cart sidebar
│   │   ├── VariantSelector.tsx      # Variant selection modal
│   │   └── CheckoutForm.tsx         # Checkout form
│   │
│   ├── 📂 kitchen/                  # Kitchen display components
│   │   ├── KanbanBoard.tsx          # Kanban-style board
│   │   ├── OrderCard.tsx            # Individual order card
│   │   └── Timer.tsx                # Elapsed time timer
│   │
│   └── 📂 ui/                       # shadcn/ui components
│       ├── button.tsx               # Button component
│       ├── card.tsx                 # Card component
│       ├── dialog.tsx               # Dialog/Modal
│       ├── input.tsx                # Input field
│       ├── select.tsx               # Select dropdown
│       ├── tabs.tsx                 # Tabs component
│       └── ... (20+ components)
│
├── 📂 lib/                          # Utility libraries
│   ├── 📂 generated/                # Prisma generated client
│   │   └── 📂 prisma/
│   ├── auth.ts                      # NextAuth configuration
│   ├── db.ts                        # Prisma client singleton
│   ├── pusher.ts                    # Pusher client setup
│   └── utils.ts                     # Helper functions
│
├── 📂 prisma/                       # Database
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Database seeding script
│
├── 📂 stores/                       # Zustand state stores
│   └── cart-store.ts                # Shopping cart state
│
├── 📂 types/                        # TypeScript definitions
│   ├── index.ts                     # Shared types
│   └── next-auth.d.ts               # NextAuth type extensions
│
├── 📂 public/                       # Static assets
│   └── 📂 screenshots/              # Documentation screenshots
│
├── auth.config.ts                   # Auth middleware config
├── middleware.ts                    # Next.js middleware
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
├── .env                             # Environment variables
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan sistem Anda sudah terinstall:

- **Node.js** 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x atau lebih tinggi ([Download](https://www.postgresql.org/download/))
- **npm** atau **yarn** (package manager)
- **Git** ([Download](https://git-scm.com/))

Optional:
- **Pusher Account** - Untuk real-time kitchen display ([Sign up](https://pusher.com/))

---

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/manzzzx/cafe-pos.git
cd cafe-pos
```

#### 2. Install Dependencies

```bash
npm install
```

atau dengan yarn:

```bash
yarn install
```

#### 3. Setup Database

**Buat database PostgreSQL:**

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE coffee_pos;

# Exit dari psql
\q
```

#### 4. Configure Environment Variables

Buat file `.env` di root directory:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan konfigurasi Anda:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coffee_pos"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Pusher Configuration (Optional - untuk real-time features)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="ap1"

# Public Pusher Config
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
```

> **Generate NEXTAUTH_SECRET:**
> ```bash
> openssl rand -base64 32
> ```

#### 5. Initialize Database

Generate Prisma Client:

```bash
npx prisma generate
```

Push schema ke database:

```bash
npx prisma db push
```

Seed database dengan data sampel:

```bash
npx prisma db seed
```

Seed script akan membuat:
- 3 user accounts (Admin, Cashier, Chef)

#### 6. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

#### 7. Login ke Aplikasi

Gunakan salah satu akun default:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@kafe.com | password123 |
| **Cashier** | kasir@kafe.com | password123 |
| **Chef** | chef@kafe.com | password123 |

---

### Production Build

Untuk production deployment:

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Order : "creates"
    Category ||--o{ Product : "contains"
    Product ||--o{ OrderItem : "includes"
    Order ||--|{ OrderItem : "has"
    
    User {
        string id PK
        string email UK
        string name
        string password
        Role role
        datetime createdAt
        datetime updatedAt
    }
    
    Category {
        string id PK
        string name
        string description
        CategoryType type
        datetime createdAt
    }
    
    Product {
        string id PK
        string name
        string description
        float price
        string imageUrl
        string sku UK
        int stock
        string categoryId FK
        json variants
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Order {
        string id PK
        string orderNumber UK
        string customerName
        string tableNumber
        string notes
        OrderStatus status
        float totalAmount
        float taxAmount
        float discount
        PaymentMethod paymentMethod
        PaymentStatus paymentStatus
        string cashierId FK
        datetime createdAt
        datetime updatedAt
    }
    
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        json variant
        string notes
        float price
        float subtotal
    }
```

### Tables Detail

#### **Users**
Menyimpan data user dengan role-based permissions.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| email | String (Unique) | Login email |
| name | String | Display name |
| password | String (Hashed) | bcrypt hash |
| role | Enum | ADMIN, CASHIER, CHEF |
| createdAt | DateTime | Timestamp |
| updatedAt | DateTime | Auto-updated |

#### **Categories**
Product categories dengan type classification.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Category name |
| description | String | Optional description |
| type | CategoryType | COFFEE, TEA, NON_COFFEE, dll |
| createdAt | DateTime | Timestamp |

**CategoryType Values:**
- `COFFEE` - Kopi
- `TEA` - Teh
- `NON_COFFEE` - Minuman non-kopi
- `JUICE` - Jus & Smoothie
- `SNACK` - Snack ringan
- `PASTRY` - Pastry & Bakery
- `DESSERT` - Dessert & Cake
- `MAIN_COURSE` - Makanan berat
- `APPETIZER` - Pembuka
- `OTHER` - Lainnya

#### **Products**
Product catalog dengan variant support.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Product name |
| description | String | Optional description |
| price | Float | Base price |
| imageUrl | String | Product image URL |
| sku | String (Unique) | Stock Keeping Unit |
| stock | Integer | Current stock |
| categoryId | String (FK) | Category reference |
| variants | JSON | Size, temperature options |
| isActive | Boolean | Availability status |
| createdAt | DateTime | Timestamp |
| updatedAt | DateTime | Auto-updated |

**Variants JSON Format:**
```json
{
  "sizes": ["Regular", "Large"],
  "temperatures": ["Hot", "Iced"]
}
```

#### **Orders**
Order transactions dengan payment tracking.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| orderNumber | String (Unique) | Display order number |
| customerName | String | Optional customer name |
| tableNumber | String | For dine-in orders |
| notes | String | Special instructions |
| status | OrderStatus | PENDING, PREPARING, READY, dll |
| totalAmount | Float | Total setelah tax |
| taxAmount | Float | Tax amount (5%) |
| discount | Float | Discount amount |
| paymentMethod | PaymentMethod | CASH, QRIS, CARD |
| paymentStatus | PaymentStatus | PENDING, PAID, dll |
| cashierId | String (FK) | User who created order |
| createdAt | DateTime | Order timestamp |
| updatedAt | DateTime | Last status update |

**OrderStatus Values:**
- `PENDING` - Order baru masuk
- `PREPARING` - Sedang diproses kitchen
- `READY` - Siap untuk delivery/pickup
- `COMPLETED` - Order selesai
- `CANCELLED` - Order dibatalkan

**PaymentMethod Values:**
- `CASH` - Tunai
- `QRIS` - QRIS payment
- `CARD` - Debit/Credit card

**PaymentStatus Values:**
- `PENDING` - Belum dibayar
- `PAID` - Sudah dibayar
- `FAILED` - Pembayaran gagal
- `REFUNDED` - Refund

#### **OrderItems**
Line items dalam order dengan variant details.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| orderId | String (FK) | Order reference |
| productId | String (FK) | Product reference |
| quantity | Integer | Item quantity |
| variant | JSON | Selected variant |
| notes | String | Per-item notes |
| price | Float | Price per unit |
| subtotal | Float | price × quantity |

**Variant JSON Format:**
```json
{
  "size": "Large",
  "temperature": "Hot"
}
```

---

## 📱 Screenshots

### 1. Login Page
![Login Page](public/screenshots/login.png)
*Coffee-themed login page dengan modern dark UI*

### 2. Admin Dashboard
![Admin Dashboard](public/screenshots/admin-dashboard.png)
*Real-time statistics, charts, dan recent orders*

### 3. POS Interface
![POS Interface](public/screenshots/pos-interface.png)
*Product grid dengan category filtering dan cart sidebar*

### 4. Variant Selection
![Variant Selection](public/screenshots/variant-selector.png)
*Modal untuk memilih size dan temperature*

### 5. Checkout Page
![Checkout Page](public/screenshots/checkout.png)
*Payment method selection dan order summary*

### 6. Kitchen Display
![Kitchen Display](public/screenshots/kitchen-display.png)
*Real-time order queue dengan timer dan status*

### 7. Product Management
![Product Management](public/screenshots/product-management.png)
*Product listing dengan CRUD operations*

### 8. Category Management
![Category Management](public/screenshots/category-management.png)
*Category configuration page*

### 9. Order History
![Order History](public/screenshots/order-history.png)
*Order history untuk cashier*

---

## 📄 API Routes

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signin` | Login | Public |
| POST | `/api/auth/signout` | Logout | Protected |
| GET | `/api/auth/session` | Get session | Protected |

### Products

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/products` | List all products | Protected | All |
| GET | `/api/products/[id]` | Get product by ID | Protected | All |
| POST | `/api/products` | Create product | Protected | Admin |
| PUT | `/api/products/[id]` | Update product | Protected | Admin |
| DELETE | `/api/products/[id]` | Delete product | Protected | Admin |

**Query Parameters untuk GET `/api/products`:**
- `categoryId` - Filter by category
- `isActive` - Filter by status (true/false)
- `search` - Search by name
- `limit` - Limit results
- `offset` - Pagination offset

**Request Body untuk POST/PUT:**
```json
{
  "name": "Caffe Latte",
  "description": "Espresso with steamed milk",
  "price": 35000,
  "categoryId": "category-id",
  "sku": "LATTE-001",
  "stock": 100,
  "imageUrl": "/uploads/latte.jpg",
  "variants": {
    "sizes": ["Regular", "Large"],
    "temperatures": ["Hot", "Iced"]
  },
  "isActive": true
}
```

### Categories

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/categories` | List all categories | Protected | All |
| GET | `/api/categories/[id]` | Get category by ID | Protected | All |
| POST | `/api/categories` | Create category | Protected | Admin |
| PUT | `/api/categories/[id]` | Update category | Protected | Admin |
| DELETE | `/api/categories/[id]` | Delete category | Protected | Admin |

**Request Body untuk POST/PUT:**
```json
{
  "name": "Coffee",
  "description": "All coffee-based drinks",
  "type": "COFFEE"
}
```

### Orders

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/orders` | List orders | Protected | Admin, Cashier |
| GET | `/api/orders/[id]` | Get order by ID | Protected | All |
| POST | `/api/orders` | Create order | Protected | Cashier |
| PUT | `/api/orders/[id]/status` | Update order status | Protected | Chef, Admin |
| GET | `/api/orders/kitchen` | Get kitchen orders | Protected | Chef |

**Request Body untuk POST `/api/orders`:**
```json
{
  "customerName": "John Doe",
  "tableNumber": "5",
  "orderType": "DINE_IN",
  "notes": "No sugar",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "variant": {
        "size": "Large",
        "temperature": "Hot"
      },
      "notes": "Extra hot",
      "price": 35000
    }
  ],
  "paymentMethod": "CASH",
  "totalAmount": 73500,
  "taxAmount": 3500,
  "discount": 0
}
```

**Response:**
```json
{
  "id": "order-id",
  "orderNumber": "ORD-20231220-001",
  "status": "PENDING",
  "createdAt": "2023-12-20T10:30:00Z"
}
```

**Request Body untuk PUT `/api/orders/[id]/status`:**
```json
{
  "status": "PREPARING"
}
```

### File Upload

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/upload` | Upload product image | Protected | Admin |

**Request:** multipart/form-data
- `file` - Image file (JPEG, PNG, WebP)
- Max size: 5MB

**Response:**
```json
{
  "url": "/uploads/product-123456.jpg"
}
```

---

## 🔐 Authentication & Authorization

### NextAuth.js Configuration

Aplikasi menggunakan **NextAuth.js v5** dengan Credentials Provider.

**Session Strategy:** JWT (JSON Web Token)  
**Session Duration:** 8 hours  
**Password Hashing:** bcrypt (10 salt rounds)

### Role-Based Access

Route protection berdasarkan user role:

```typescript
// auth.config.ts
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = auth?.user?.role
      
      // Route access rules
      if (nextUrl.pathname.startsWith('/admin')) {
        return role === 'ADMIN'
      }
      if (nextUrl.pathname.startsWith('/pos')) {
        return role === 'CASHIER' || role === 'ADMIN'
      }
      if (nextUrl.pathname.startsWith('/kitchen')) {
        return role === 'CHEF' || role === 'ADMIN'
      }
      
      return isLoggedIn
    }
  }
}
```

### Protected Routes

| Route Pattern | Allowed Roles |
|--------------|---------------|
| `/admin/*` | ADMIN only |
| `/pos/*` | CASHIER, ADMIN |
| `/cashier/*` | CASHIER, ADMIN |
| `/kitchen/*` | CHEF, ADMIN |
| `/api/products` GET | All authenticated |
| `/api/products` POST/PUT/DELETE | ADMIN only |
| `/api/orders` POST | CASHIER, ADMIN |
| `/api/orders/[id]/status` PUT | CHEF, ADMIN |

### Middleware

```typescript
// middleware.ts
export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

Middleware akan:
1. Validate JWT token
2. Check user authentication
3. Verify route permissions
4. Redirect unauthorized users

---

## ⚡ Real-time Features

### Pusher Integration

Kitchen Display System menggunakan **Pusher** untuk real-time updates.

**Setup Pusher:**

1. Daftar di [Pusher.com](https://pusher.com/)
2. Buat app baru
3. Copy credentials ke `.env`

**Server-side (Order Creation):**

```typescript
// app/api/orders/route.ts
import { pusher } from '@/lib/pusher'

await pusher.trigger('kitchen', 'new-order', {
  orderId: order.id,
  orderNumber: order.orderNumber,
  items: order.items,
})
```

**Client-side (Kitchen Display):**

```typescript
// app/kitchen/page.tsx
useEffect(() => {
  const channel = pusher.subscribe('kitchen')
  
  channel.bind('new-order', (data) => {
    // Refresh orders
    refetch()
  })
  
  return () => {
    channel.unbind_all()
    channel.unsubscribe()
  }
}, [])
```

**Events:**
- `new-order` - Triggered ketika order baru dibuat
- `status-updated` - Triggered ketika order status berubah

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (`http://localhost:3000`) |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint untuk code quality check |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema changes ke database |
| `npx prisma db seed` | Run database seeder |
| `npx prisma migrate dev` | Create dan run migration |

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Database Connection Error**

```
Error: Can't reach database server at `localhost:5432`
```

**Solution:**
- Pastikan PostgreSQL service berjalan
- Cek DATABASE_URL di `.env` sudah benar
- Test connection: `psql -U postgres`

```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

#### 2. **Prisma Client Not Generated**

```
Error: @prisma/client did not initialize yet
```

**Solution:**

```bash
npx prisma generate
```

#### 3. **NextAuth Session Error**

```
Error: Missing NEXTAUTH_SECRET
```

**Solution:**

Generate secret dan tambahkan ke `.env`:

```bash
openssl rand -base64 32
```

#### 4. **Pusher Connection Failed**

```
Pusher error: Connection failed
```

**Solution:**
- Cek PUSHER credentials di `.env`
- Verifikasi PUSHER_CLUSTER (default: `ap1`)
- Pastikan Pusher app status aktif

#### 5. **Port 3000 Already in Use**

```
Error: Port 3000 is already in use
```

**Solution:**

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

#### 6. **Image Upload Failed**

**Solution:**
- Cek folder `/public/uploads` exists
- Verifikasi file permissions
- Check file size (max 5MB)
- Allowed formats: JPEG, PNG, WebP

#### 7. **Build Error: Type Errors**

```
Error: Type 'X' is not assignable to type 'Y'
```

**Solution:**

```bash
# Clear TypeScript cache
rm -rf .next
rm -rf tsconfig.tsbuildinfo

# Rebuild
npm run build
```

---

### Database Reset

Jika perlu reset database:

```bash
# Drop all tables
npx prisma db push --force-reset

# Re-seed
npx prisma db seed
```

> ⚠️ **Warning:** Ini akan menghapus semua data!

---

### Debug Mode

Enable debug logs di `.env`:

```env
# Prisma Debug
DEBUG=prisma:*

# NextAuth Debug
NEXTAUTH_DEBUG=true
```

---

## 🤝 Contributing

Kontribusi sangat kami apresiasi! Ikuti langkah berikut:

### Development Workflow

1. **Fork Repository**

```bash
# Fork di GitHub, lalu clone
git clone https://github.com/manzzzx/cafe-pos.git
cd cafe-pos
```

2. **Create Feature Branch**

```bash
git checkout -b feature/nama-fitur-anda
```

3. **Make Changes**

- Write clean, readable code
- Follow TypeScript best practices
- Add comments untuk complex logic
- Update documentation jika perlu

4. **Test Your Changes**

```bash
# Run linter
npm run lint

# Build check
npm run build

# Manual testing
npm run dev
```

5. **Commit Changes**

```bash
git add .
git commit -m "feat: deskripsi fitur anda"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation update
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build/config changes

6. **Push & Create PR**

```bash
git push origin feature/nama-fitur-anda
```

Buat Pull Request di GitHub dengan:
- Clear title dan description
- List of changes
- Screenshots (jika UI changes)
- Testing notes

---

### Code Style Guidelines

- **TypeScript**: Use strict types, avoid `any`
- **Components**: Functional components dengan TypeScript
- **Naming**: 
  - Components: `PascalCase`
  - Files: `kebab-case` atau `PascalCase`
  - Variables: `camelCase`
- **Formatting**: Handled oleh ESLint
- **Imports**: Group dan sort imports

---

### Reporting Issues

Gunakan GitHub Issues untuk:
- 🐛 Bug reports
- ✨ Feature requests
- 📚 Documentation improvements
- ❓ Questions

**Bug Report Template:**

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
```


---

## 🙏 Acknowledgments

Special thanks to:

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Pusher](https://pusher.com/)** - Real-time WebSocket infrastructure
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Lucide](https://lucide.dev/)** - Beautiful icon set

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs atau request features](https://github.com/Manzzzx/cafe-pos/issues)
- **Discussions**: [Ask questions](https://github.com/Manzzzx/cafe-pos/discussions)

---

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] **Multi-branch Support** - Support untuk multiple cafe locations
- [ ] **Inventory Management** - Stock tracking dan low-stock alerts
- [ ] **Loyalty Program** - Customer points dan rewards
- [ ] **Advanced Analytics** - Sales forecasting dan trends
- [ ] **Mobile App** - React Native app untuk iOS/Android
- [ ] **WhatsApp Integration** - Order notifications
- [ ] **Receipt Printing** - Thermal printer support
- [ ] **Shift Management** - Cashier shift tracking
- [ ] **Table Management** - Visual table layout
- [ ] **Online Ordering** - Customer-facing order website

### Version 1.5 (Coming Soon)

- [ ] Dark/Light theme toggle
- [ ] Export reports to PDF/Excel
- [ ] Product search autocomplete
- [ ] Order filters dan advanced search
- [ ] Batch product import (CSV)
- [ ] Email notifications
- [ ] Discount coupons
- [ ] Multi-currency support

---

<div align="center">

## Made with ☕ and ❤️

**Kafe POS** - Empowering Cafe with Modern Technology

[⭐ Star this repo](https://github.com/manzzzx/cafe-pos) | [🐛 Report Bug](https://github.com/manzzzx/cafe-pos/issues) | [✨ Request Feature](https://github.com/manzzzx/cafe-pos/issues)

---

© 2024 Kafe POS Team. All rights reserved.

</div>
