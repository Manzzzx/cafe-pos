import { Prisma, PrismaClient, Role, CategoryType } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10)

  await prisma.user.upsert({
    where: { email: "admin@kafe.com" },
    update: {},
    create: {
      email: "admin@kafe.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: "kasir@kafe.com" },
    update: {},
    create: {
      email: "kasir@kafe.com",
      name: "Kasir",
      password: hashedPassword,
      role: Role.CASHIER,
    },
  })

  await prisma.user.upsert({
    where: { email: "chef@kafe.com" },
    update: {},
    create: {
      email: "chef@kafe.com",
      name: "Chef",
      password: hashedPassword,
      role: Role.CHEF,
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
      variants: Prisma.DbNull,
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