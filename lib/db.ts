import mysql from "mysql2/promise"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tierrablanca",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Helper function to execute SQL queries
export async function query(sql: string, params?: any[]) {
  try {
    console.log(`Executing SQL: ${sql}`, params)
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to get a connection from the pool
export async function getConnection() {
  console.log("Getting database connection")
  try {
    const connection = await pool.getConnection()
    console.log("Database connection acquired successfully")
    return connection
  } catch (error) {
    console.error("Error getting database connection:", error)
    throw error
  }
}

// Helper function to get a single product with all its related data
export async function getProductWithDetails(productId: number) {
  console.log(`Getting product details for ID: ${productId}`)

  // Get the product
  const products = (await query("SELECT * FROM products WHERE id = ?", [productId])) as any[]

  if (products.length === 0) {
    console.log(`No product found with ID: ${productId}`)
    return null
  }

  const product = products[0]
  console.log(`Found product: ${product.name}`)

  // Get materials
  const materials = (await query("SELECT material FROM product_materials WHERE product_id = ?", [productId])) as any[]

  // Get sizes
  const sizes = (await query("SELECT size FROM product_sizes WHERE product_id = ?", [productId])) as any[]

  // Get colors
  const colors = (await query("SELECT color FROM product_colors WHERE product_id = ?", [productId])) as any[]

  // Get images
  const images = (await query("SELECT image_path FROM product_images WHERE product_id = ? ORDER BY display_order", [
    productId,
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
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }
}

// Helper function to verify admin credentials
export async function verifyAdminCredentials(username: string, passwordHash: string) {
  const users = (await query("SELECT * FROM admin_users WHERE username = ? AND password_hash = ?", [
    username,
    passwordHash,
  ])) as any[]

  if (users.length === 0) {
    return null
  }

  // Update last login time
  await query("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [users[0].id])

  return users[0]
}

// Helper function to increment view count
export async function incrementViewCount() {
  await query("CALL increment_view_count()")
  const result = (await query("SELECT count FROM view_counter WHERE id = 1")) as any[]
  return result[0].count
}
