"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import ProductForm from "@/components/admin/product-form"
import type { Product } from "@/lib/products"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const productId = Number.parseInt(unwrappedParams.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }

        const productData = await response.json()
        setProduct(productData)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      // Redirect to the product details page
      router.push(`/admin/products/product/${productId}`)
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Une erreur s'est produite lors de la mise à jour du produit.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415e5a]"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Produit non trouvé</h2>
        <p className="text-gray-500 mb-4">Le produit que vous essayez de modifier n'existe pas.</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 bg-[#415e5a] text-white rounded-md hover:bg-[#5a7d79] transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux produits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href={`/admin/products/product/${productId}`}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-800">Modifier le produit</h1>
      </div>

      <ProductForm product={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
