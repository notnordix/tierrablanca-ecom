"use server"

import { createOrder } from "@/lib/orders"
import { sendOrderNotification } from "@/lib/email-service"
import type { Order } from "@/lib/orders"

export async function submitOrder(orderData: Omit<Order, "id" | "date">) {
  try {
    const newOrder = await createOrder(orderData)

    if (!newOrder) {
      return { success: false, error: "Failed to create order" }
    }

    // Send email notification
    await sendOrderNotification(newOrder)

    return { success: true, order: newOrder }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}
