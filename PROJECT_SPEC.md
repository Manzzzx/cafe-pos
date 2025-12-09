# Coffee Shop POS System - Project Specification

> **Created**: December 9, 2025  
> **Tech Stack**: Next.js 14 (App Router), Prisma, PostgreSQL, NextAuth, Pusher, Zustand, Tailwind + Shadcn/ui

---

## 📁 Project Structure

```
/coffee-shop-pos
├── /app
│   ├── /auth
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── /dashboard
│   │   ├── admin/page.tsx
│   │   ├── cashier/page.tsx
│   │   └── barista/page.tsx
│   ├── /pos
│   │   ├── checkout/page.tsx
│   │   └── page.tsx
│   ├── /kitchen
│   │   └── page.tsx
│   ├── /admin
│   │   ├── products/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── orders/page.tsx
│   │   └── reports/page.tsx
│   ├── /api
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   └── webhooks/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── /components
│   ├── /ui (Shadcn components)
│   ├── /layout
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── LayoutWrapper.tsx
│   ├── /pos
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutModal.tsx
│   ├── /kitchen
│   │   ├── OrderQueue.tsx
│   │   ├── OrderCard.tsx
│   │   └── KitchenHeader.tsx
│   ├── /admin
│   │   ├── StatsCards.tsx
│   │   ├── SalesChart.tsx
│   │   ├── RecentOrders.tsx
│   │   └── ProductForm.tsx
│   ├── /auth
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   └── /shared
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── ReceiptTemplate.tsx
├── /lib
│   ├── db.ts
│   ├── auth.ts
│   ├── pusher.ts
│   ├── utils.ts
│   └── types.ts
├── /prisma
│   ├── schema.prisma
│   └── seed.ts
├── /stores
│   ├── cart-store.ts
│   ├── ui-store.ts
│   ├── auth-store.ts
│   └── order-store.ts
├── /public
│   ├── /images/products/
│   └── logo.png
└── package.json
```

---

## 📱 Routes & Pages

### Authentication
| Route | Description |
|-------|-------------|
| `/login` | Login for all users (email/password + role) |
| `/register` | Register new users (Admin only) |

### Dashboards
| Route | Role | Description |
|-------|------|-------------|
| `/dashboard/admin` | Admin | Stats, charts, recent orders |
| `/dashboard/cashier` | Cashier | Quick stats, link to POS |
| `/dashboard/barista` | Barista | Current orders, kitchen link |

### POS Module
| Route | Description |
|-------|-------------|
| `/pos` | Main POS - product grid + cart |
| `/pos/checkout` | Payment & receipt |

### Kitchen Display
| Route | Description |
|-------|-------------|
| `/kitchen` | Realtime order queue |

### Admin Pages
| Route | Description |
|-------|-------------|
| `/admin/products` | Product CRUD |
| `/admin/categories` | Category management |
| `/admin/orders` | Order history & management |
| `/admin/reports` | Sales analytics |

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(CASHIER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
}

model Product {
  id            String    @id @default(cuid())
  name          String
  description   String?
  price         Float
  imageUrl      String?
  sku           String?   @unique
  stock         Int       @default(0)
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  variants      Json?     // { sizes: [], temperatures: [] }
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orderItems    OrderItem[]
}

model Category {
  id            String       @id @default(cuid())
  name          String
  description   String?
  type          CategoryType
  products      Product[]
  createdAt     DateTime     @default(now())
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
  id            String    @id @default(cuid())
  orderId       String
  order         Order     @relation(fields: [orderId], references: [id])
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  quantity      Int       @default(1)
  variant       Json?     // { size: "Large", temperature: "Hot" }
  notes         String?
  price         Float
  subtotal      Float
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

---

## 🔧 API Endpoints

### Products
```
GET    /api/products              → List all products
POST   /api/products              → Create product
GET    /api/products/[id]         → Get product detail
PUT    /api/products/[id]         → Update product
DELETE /api/products/[id]         → Delete product
GET    /api/products/category/[id]→ Products by category
```

### Orders
```
GET    /api/orders                → List orders
POST   /api/orders                → Create order
GET    /api/orders/[id]           → Order detail
PUT    /api/orders/[id]/status    → Update status
GET    /api/orders/kitchen        → Kitchen orders
GET    /api/orders/today          → Today's orders
```

### Auth
```
POST   /api/auth/login            → Login
POST   /api/auth/register         → Register
GET    /api/auth/session          → Get session
```

### Others
```
GET    /api/categories            → List categories
POST   /api/categories            → Create category
GET    /api/dashboard/stats       → Dashboard stats
GET    /api/reports/sales         → Sales report
```

---

## 🔄 Realtime Events (Pusher)

### Channel: `orders`
| Event | Description |
|-------|-------------|
| `order-created` | New order created |
| `order-updated` | Order modified |
| `order-status-changed` | Status update |

### Channel: `kitchen`
| Event | Description |
|-------|-------------|
| `new-order-notification` | Alert barista |
| `order-ready` | Ready for pickup |

---

## 🎨 Design System

### Colors
```css
Primary:    #6F4E37  /* Coffee Brown */
Secondary:  #F5F5DC  /* Cream */
Accent:     #2E8B57  /* Green */
Background: #FFFFFF
Text:       #333333
```

### Typography
- **Primary**: Inter (body)
- **Secondary**: Playfair Display (headers)
- **Mono**: JetBrains Mono (receipts)

### Responsive Breakpoints
```css
Mobile:  < 640px
Tablet:  641px - 1024px
Desktop: > 1025px
```

---

## ✅ MVP Features (Must Have)

- [x] User Authentication - Login/Logout with roles
- [ ] POS Interface - Add products, cart, checkout
- [ ] Product Management - CRUD with variants
- [ ] Order Management - Create, view, update orders
- [ ] Kitchen Display - Realtime order updates
- [ ] Basic Reporting - Today's sales

## 🔄 Phase 2 Features (Nice to Have)

- [ ] Advanced Reports - Charts, Excel export
- [ ] Inventory Management - Stock tracking
- [ ] Customer Management - Loyalty program
- [ ] Multiple Outlets - Multi-branch
- [ ] Receipt Printing - Thermal/PDF

---

## 📅 Development Timeline (10 Days)

### Week 1: Foundation
| Day | Focus | Deliverable |
|-----|-------|-------------|
| 1-2 | Setup + Auth | Project init, Prisma, NextAuth |
| 3-4 | POS Core | Product grid, cart, checkout |
| 5 | Admin Basic | Product CRUD |

### Week 2: Features
| Day | Focus | Deliverable |
|-----|-------|-------------|
| 6 | Kitchen Display | Realtime orders |
| 7-8 | Orders + Integration | Order flow, Pusher |
| 9 | Testing | Bug fixes, polish |
| 10 | Deploy | Vercel, documentation |

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.3.0",
    "@prisma/client": "^5.7.0",
    "next-auth": "^5.0.0",
    "pusher": "^5.2.0",
    "pusher-js": "^8.2.0",
    "zustand": "^4.4.0",
    "recharts": "^2.9.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0"
  }
}
```

---

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="ap1"
```

---

## 🚨 User Workflows

### Cashier Flow
```
Login → POS → Select Products → Add to Cart → 
Checkout → Process Payment → Print Receipt → 
Order sent to Kitchen
```

### Barista Flow
```
Login → Kitchen Display → View Pending → 
Start Preparing → Mark Ready → Complete
```

### Admin Flow
```
Login → Dashboard → View Reports → 
Manage Products → Manage Users
```

---

## 📋 Pre-Submission Checklist

- [ ] All routes working
- [ ] Authentication functional
- [ ] POS can create orders
- [ ] Kitchen display real-time
- [ ] Admin can manage products
- [ ] Responsive on mobile/tablet
- [ ] Error handling implemented
- [ ] Deployed to Vercel
- [ ] GitHub with README
