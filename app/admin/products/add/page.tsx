"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProductForm from "@/components/admin/product-form"
import type { Product } from "@/lib/products"

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const newProduct = await response.json()

      // Redirect to the product details page
      router.push(`/admin/products/product/${newProduct.id}`)
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Une erreur s'est produite lors de l'ajout du produit.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/admin/products"
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-800">Ajouter un produit</h1>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
