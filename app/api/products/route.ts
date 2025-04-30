import { NextResponse } from "next/server"
import { getAllProducts, addProduct } from "@/lib/products"
import type { Product } from "@/lib/products"

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const productData = (await request.json()) as Omit<Product, "id">
    const newProduct = await addProduct(productData)

    if (!newProduct) {
      return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
    }

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error adding product:", error)
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
