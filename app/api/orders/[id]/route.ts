import { NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(`Error fetching order with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = (await request.json()) as { status: "pending" | "completed" }

    if (!status || (status !== "pending" && status !== "completed")) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const success = await updateOrderStatus(params.id, status)

    if (!success) {
      return NextResponse.json({ error: "Order not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error updating order status with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
