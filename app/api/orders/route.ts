import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateOrderNumber } from "@/lib/utils"
import { pusherServer } from "@/lib/pusher"

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
    console.error("Fetch orders error:", error)
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
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
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
          create: items.map((item: { productId: string; quantity: number; variant?: unknown; notes?: string; price: number }) => ({
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

    // Trigger Pusher event for kitchen display
    await pusherServer.trigger("orders", "order-created", order)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
