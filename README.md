# ☕ Coffee Shop POS

A modern, full-featured Point of Sale (POS) system for coffee shops built with Next.js 16, featuring role-based access control, real-time kitchen display, and beautiful coffee-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?logo=prisma)

---

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin** - Full access to dashboard, products, categories, orders, reports
- **Cashier** - POS interface and order history
- **Barista** - Kitchen display for order preparation

### 💳 Point of Sale (POS)
- Product catalog with category filtering
- Variant selection (size, temperature)
- Smart cart with item merging
- Per-item notes
- Order types: Dine-in / Take Away
- Multiple payment methods (Cash, QRIS, Card)
- Quick amount buttons for cash payments

### 📊 Admin Dashboard
- Real-time statistics (revenue, orders, items sold)
- Weekly sales charts (Area & Bar charts)
- Recent orders overview
- Quick navigation links

### 👨‍🍳 Kitchen Display
- Real-time order queue via Pusher
- Kanban-style columns (Pending → Preparing → Ready)
- Elapsed timer per order
- Color-coded urgency (>5min yellow, >10min red)
- Full-screen mode without navbar

### 📦 Product Management
- CRUD operations for products and categories
- Image upload with preview
- Variant configuration
- Active/inactive status

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Authentication | NextAuth.js v5 |
| State Management | Zustand |
| Charts | Recharts |
| Real-time | Pusher |
| Forms | React Hook Form + Zod |

---

## 📁 Project Structure

```
coffee-shop-pos/
├── app/
│   ├── admin/           # Admin pages (dashboard, products, etc.)
│   ├── api/             # API routes
│   ├── auth/            # Login page
│   ├── cashier/         # Cashier order history
│   ├── kitchen/         # Kitchen display
│   └── pos/             # POS interface & checkout
├── components/
│   ├── layout/          # Layout components (Admin, Cashier)
│   ├── pos/             # POS components (ProductCard, Cart, etc.)
│   ├── kitchen/         # Kitchen display components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities (auth, db, utils)
├── prisma/              # Database schema & migrations
├── stores/              # Zustand stores
└── types/               # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Pusher account (for real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coffee-shop-pos.git
   cd coffee-shop-pos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/coffee_pos"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   PUSHER_APP_ID="your-app-id"
   PUSHER_KEY="your-key"
   PUSHER_SECRET="your-secret"
   PUSHER_CLUSTER="ap1"
   
   NEXT_PUBLIC_PUSHER_KEY="your-key"
   NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 👤 Default Users

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coffee.com | admin123 |
| Cashier | cashier@coffee.com | cashier123 |
| Barista | barista@coffee.com | barista123 |

---

## 📱 Screenshots

### Admin Dashboard
- Statistics cards with trend indicators
- Weekly revenue and order charts
- Recent orders list

### POS Interface
- Category-filtered product grid
- Variant selection modal
- Fixed cart sidebar

### Kitchen Display
- Real-time order queue
- Timer-based urgency colors
- Full-screen mode

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/products` | List/Create products |
| PUT/DELETE | `/api/products/[id]` | Update/Delete product |
| GET/POST | `/api/categories` | List/Create categories |
| PUT/DELETE | `/api/categories/[id]` | Update/Delete category |
| GET/POST | `/api/orders` | List/Create orders |
| GET | `/api/orders/kitchen` | Get kitchen orders |
| PUT | `/api/orders/[id]/status` | Update order status |
| POST | `/api/upload` | Upload product image |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Pusher](https://pusher.com/) - Real-time features

---

Made with ☕ and ❤️
