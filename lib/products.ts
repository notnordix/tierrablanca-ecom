"use server"

import { query, getConnection } from "./db"

export interface Product {
  id: number
  name: string
  shortDescription: string
  fullDescription: string
  price: string
  materials: string[]
  sizes: string[]
  colors: string[]
  mainImage: string
  images: string[]
  inStock: boolean
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = (await query("SELECT * FROM products ORDER BY created_at DESC")) as any[]

    // Map database results to Product interface
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        return await getProductById(product.id)
      }),
    )

    return productsWithDetails.filter(Boolean) as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: number): Promise<Product | undefined> {
  try {
    // Get the product
    const products = (await query("SELECT * FROM products WHERE id = ?", [id])) as any[]

    if (products.length === 0) {
      return undefined
    }

    const product = products[0]

    // Get materials
    const materials = (await query("SELECT material FROM product_materials WHERE product_id = ?", [id])) as any[]

    // Get sizes
    const sizes = (await query("SELECT size FROM product_sizes WHERE product_id = ?", [id])) as any[]

    // Get colors
    const colors = (await query("SELECT color FROM product_colors WHERE product_id = ?", [id])) as any[]

    // Get images
    const images = (await query("SELECT image_path FROM product_images WHERE product_id = ? ORDER BY display_order", [
      id,
    ])) as any[]

    return {
      id: product.id,
      name: product.name,
      shortDescription: product.short_description,
      fullDescription: product.full_description,
      price: product.price,
      mainImage: product.main_image,
      inStock: product.in_stock === 1,
      materials: materials.map((m: any) => m.material),
      sizes: sizes.map((s: any) => s.size),
      colors: colors.map((c: any) => c.color),
      images: images.map((img: any) => img.image_path),
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return undefined
  }
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">): Promise<Product | undefined> {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    // Insert the product
    const [result] = (await connection.execute(
      "INSERT INTO products (name, short_description, full_description, price, main_image, in_stock) VALUES (?, ?, ?, ?, ?, ?)",
      [
        product.name,
        product.shortDescription,
        product.fullDescription,
        product.price,
        product.mainImage,
        product.inStock,
      ],
    )) as any

    const productId = result.insertId

    // Insert materials
    for (const material of product.materials) {
      await connection.execute("INSERT INTO product_materials (product_id, material) VALUES (?, ?)", [
        productId,
        material,
      ])
    }

    // Insert sizes
    for (const size of product.sizes) {
      await connection.execute("INSERT INTO product_sizes (product_id, size) VALUES (?, ?)", [productId, size])
    }

    // Insert colors
    for (const color of product.colors) {
      await connection.execute("INSERT INTO product_colors (product_id, color) VALUES (?, ?)", [productId, color])
    }

    // Insert images
    for (let i = 0; i < product.images.length; i++) {
      await connection.execute("INSERT INTO product_images (product_id, image_path, display_order) VALUES (?, ?, ?)", [
        productId,
        product.images[i],
        i,
      ])
    }

    await connection.commit()

    // Return the newly created product
    return await getProductById(productId)
  } catch (error) {
    await connection.rollback()
    console.error("Error adding product:", error)
    return undefined
  } finally {
    connection.release()
  }
}

// Update an existing product
export async function updateProduct(id: number, product: Omit<Product, "id">): Promise<Product | undefined> {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    // Update the product
    await connection.execute(
      "UPDATE products SET name = ?, short_description = ?, full_description = ?, price = ?, main_image = ?, in_stock = ? WHERE id = ?",
      [
        product.name,
        product.shortDescription,
        product.fullDescription,
        product.price,
        product.mainImage,
        product.inStock,
        id,
      ],
    )

    // Delete existing materials, sizes, colors, and images
    await connection.execute("DELETE FROM product_materials WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_sizes WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_colors WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_images WHERE product_id = ?", [id])

    // Insert materials
    for (const material of product.materials) {
      await connection.execute("INSERT INTO product_materials (product_id, material) VALUES (?, ?)", [id, material])
    }

    // Insert sizes
    for (const size of product.sizes) {
      await connection.execute("INSERT INTO product_sizes (product_id, size) VALUES (?, ?)", [id, size])
    }

    // Insert colors
    for (const color of product.colors) {
      await connection.execute("INSERT INTO product_colors (product_id, color) VALUES (?, ?)", [id, color])
    }

    // Insert images
    for (let i = 0; i < product.images.length; i++) {
      await connection.execute("INSERT INTO product_images (product_id, image_path, display_order) VALUES (?, ?, ?)", [
        id,
        product.images[i],
        i,
      ])
    }

    await connection.commit()

    // Return the updated product
    return await getProductById(id)
  } catch (error) {
    await connection.rollback()
    console.error(`Error updating product with ID ${id}:`, error)
    return undefined
  } finally {
    connection.release()
  }
}

// Update the deleteProduct function to handle the foreign key constraint issue more gracefully
export async function deleteProduct(id: number): Promise<boolean> {
  console.log(`Attempting to delete product with ID: ${id}`)
  const connection = await getConnection()

  try {
    // First check if the product is referenced in any orders
    const [orderItemsResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM order_items WHERE product_id = ?",
      [id],
    )
    const orderItems = orderItemsResult as any[]

    if (orderItems[0].count > 0) {
      console.log(`Product ${id} is referenced in orders and cannot be deleted`)
      throw new Error(
        "Ce produit ne peut pas être supprimé car il est référencé dans des commandes. Veuillez le marquer comme 'Rupture de stock' à la place.",
      )
    }

    console.log(`No order references found for product ${id}, proceeding with deletion`)

    await connection.beginTransaction()

    // Delete related records
    await connection.execute("DELETE FROM product_materials WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_sizes WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_colors WHERE product_id = ?", [id])
    await connection.execute("DELETE FROM product_images WHERE product_id = ?", [id])

    // Delete the product itself
    const [result] = (await connection.execute("DELETE FROM products WHERE id = ?", [id])) as any

    await connection.commit()

    console.log(`Product deletion result:`, result)
    return result.affectedRows > 0
  } catch (error) {
    await connection.rollback()
    console.error(`Error in deleteProduct function:`, error)
    throw error
  } finally {
    connection.release()
  }
}
