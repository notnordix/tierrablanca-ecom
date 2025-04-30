"use server"

import { query, getConnection } from "./db"

export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "completed"
  date: string
}

export interface OrderItem {
  productId: number
  name: string
  price: string
  quantity: number
  size?: string
  color?: string
}

// Get all orders
export async function getAllOrders(): Promise<Order[]> {
  try {
    const orders = (await query("SELECT * FROM orders ORDER BY created_at DESC")) as any[]

    // Map database results to Order interface
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = (await query("SELECT * FROM order_items WHERE order_id = ?", [order.id])) as any[]

        return {
          id: order.id,
          customerName: order.customer_name,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          totalAmount: Number.parseFloat(order.total_amount),
          status: order.status as "pending" | "completed",
          date: new Date(order.created_at).toISOString().split("T")[0],
          items: items.map((item) => ({
            productId: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }
      }),
    )

    return ordersWithItems
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | undefined> {
  try {
    const orders = (await query("SELECT * FROM orders WHERE id = ?", [id])) as any[]

    if (orders.length === 0) {
      return undefined
    }

    const order = orders[0]
    const items = (await query("SELECT * FROM order_items WHERE order_id = ?", [id])) as any[]

    return {
      id: order.id,
      customerName: order.customer_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      totalAmount: Number.parseFloat(order.total_amount),
      status: order.status as "pending" | "completed",
      date: new Date(order.created_at).toISOString().split("T")[0],
      items: items.map((item) => ({
        productId: item.product_id,
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
    }
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error)
    return undefined
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: "pending" | "completed"): Promise<boolean> {
  try {
    const [result] = (await query("UPDATE orders SET status = ? WHERE id = ?", [status, id])) as any
    return result.affectedRows > 0
  } catch (error) {
    console.error(`Error updating status for order with ID ${id}:`, error)
    return false
  }
}

// Create a new order
export async function createOrder(order: Omit<Order, "id" | "date">): Promise<Order | undefined> {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    // Generate order ID
    const orderId = `ORD-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`

    // Insert the order
    await connection.execute(
      "INSERT INTO orders (id, customer_name, email, phone, address, city, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        order.customerName,
        order.email,
        order.phone,
        order.address,
        order.city,
        order.totalAmount,
        order.status,
      ],
    )

    // Insert order items
    for (const item of order.items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [orderId, item.productId, item.name, item.price, item.quantity, item.size || null, item.color || null],
      )
    }

    await connection.commit()

    // Return the newly created order
    return await getOrderById(orderId)
  } catch (error) {
    await connection.rollback()
    console.error("Error creating order:", error)
    return undefined
  } finally {
    connection.release()
  }
}
