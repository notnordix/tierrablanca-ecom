"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Tag, Box, Palette, Check, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import type { Product } from "@/lib/products"

export default function AdminProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const productId = Number.parseInt(unwrappedParams.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

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

  // Update the handleDeleteProduct function to display a more user-friendly error message
  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      // Log the full response for debugging
      console.log("Delete response status:", response.status)

      // Parse the response data
      let data
      try {
        data = await response.json()
        console.log("Delete response data:", data)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        data = { error: "Failed to parse response" }
      }

      if (!response.ok) {
        // Use a more specific error message
        const errorMessage = data.error || data.details || "Failed to delete product"
        console.error("Delete error:", errorMessage)

        // Display a user-friendly error message
        alert(`Erreur: ${errorMessage}`)
        setShowDeleteConfirmation(false)
        return
      }

      // Success - redirect to products list
      console.log("Product deleted successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Une erreur s'est produite lors de la suppression du produit."}`,
      )
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
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
        <p className="text-gray-500 mb-4">Le produit que vous recherchez n'existe pas.</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/products"
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-800 truncate">{product.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/products/product/${product.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <Edit size={16} className="mr-2" />
            Modifier
          </Link>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
          <div className="space-y-4">
            <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
              <img
                src={product.mainImage || "/placeholder.svg"}
                alt={`${product.name} - Image principale`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs font-medium">Principale</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1, 4).map((image, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {product.images.length > 4 && (
              <p className="text-sm text-gray-500 text-center">+{product.images.length - 4} autres images</p>
            )}
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations produit</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                <p className="mt-1 text-base text-gray-900">{product.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description courte</h3>
                <p className="mt-1 text-base text-gray-900">{product.shortDescription}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description complète</h3>
                <p className="mt-1 text-base text-gray-900">{product.fullDescription}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                  <p className="mt-1 text-base font-medium text-[#415e5a]">{product.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className="mt-1 flex items-center">
                    {product.inStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        En stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X size={12} className="mr-1" />
                        Rupture de stock
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attributs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-3">
                  <Tag size={16} className="text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Matériaux</h3>
                </div>
                <div className="space-y-2">
                  {product.materials.map((material, index) => (
                    <div
                      key={index}
                      className="inline-block mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800"
                    >
                      {material}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <Box size={16} className="text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Tailles</h3>
                </div>
                <div className="space-y-2">
                  {product.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="inline-block mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <Palette size={16} className="text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Couleurs</h3>
                </div>
                <div className="space-y-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="inline-block mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800"
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-medium text-gray-900 mb-3">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le produit <span className="font-semibold">{product.name}</span> ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
