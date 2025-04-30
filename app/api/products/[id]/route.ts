import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/products"
import type { Product } from "@/lib/products"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(`Error fetching product with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const productData = (await request.json()) as Omit<Product, "id">
    const updatedProduct = await updateProduct(productId, productData)

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`Error updating product with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// Update the DELETE handler to better handle and pass through error messages
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log(`Attempting to delete product with ID: ${params.id}`)

  try {
    const productId = Number.parseInt(params.id)

    // First, check if the product exists
    const product = await getProductById(productId)

    if (!product) {
      console.log(`Product with ID ${productId} not found`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log(`Product found, attempting to delete: ${product.name}`)

    // Attempt to delete the product
    try {
      const success = await deleteProduct(productId)

      if (success) {
        console.log(`Product with ID ${productId} deleted successfully`)
        return NextResponse.json({ success: true, message: "Product deleted successfully" })
      } else {
        console.log(`Failed to delete product with ID ${productId}`)
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
      }
    } catch (deleteError) {
      console.error(`Error in deleteProduct function:`, deleteError)
      const errorMessage = deleteError instanceof Error ? deleteError.message : "Unknown error"
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error(`Error in DELETE handler:`, error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
