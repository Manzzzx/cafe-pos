import { Prisma, PrismaClient, Role } from "../lib/generated/prisma/client"
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
  // Create users only - categories and products will be added manually via admin UI
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

  console.log("✅ Seed users berhasil!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
