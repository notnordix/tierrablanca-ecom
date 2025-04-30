"use server"

import { getAllProducts as fetchProducts, getProductById as fetchProduct } from "@/lib/products"
import type { Product } from "@/lib/products"

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    return await fetchProducts()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function fetchProductById(id: number): Promise<Product | undefined> {
  try {
    return await fetchProduct(id)
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return undefined
  }
}
