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
    console.error("Fetch kitchen orders error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
