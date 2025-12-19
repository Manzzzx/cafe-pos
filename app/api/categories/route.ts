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
    console.error("Fetch categories error:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Validate CategoryType enum
    const validTypes = ["COFFEE", "TEA", "NON_COFFEE", "JUICE", "SNACK", "PASTRY", "DESSERT", "MAIN_COURSE", "APPETIZER", "OTHER"]
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid category type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const category = await db.category.create({ data: body })
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error("Create category error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    )
  }
}
