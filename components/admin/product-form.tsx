"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Plus, Trash2, Upload, Loader2 } from "lucide-react"
import type { Product } from "@/lib/products"

interface ProductFormProps {
  product?: Product
  onSubmit: (productData: Omit<Product, "id">) => Promise<void>
  isSubmitting: boolean
}

export default function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    materials: [],
    sizes: [],
    colors: [],
    mainImage: "",
    images: [],
    inStock: true,
  })
  const [newMaterial, setNewMaterial] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        price: product.price,
        materials: [...product.materials],
        sizes: [...product.sizes],
        colors: [...product.colors],
        mainImage: product.mainImage,
        images: [...product.images],
        inStock: product.inStock,
      })
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()],
      }))
      setNewMaterial("")
    }
  }

  const handleRemoveMaterial = (material: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m !== material),
    }))
  }

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }))
      setNewSize("")
    }
  }

  const handleRemoveSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }))
  }

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }))
      setNewColor("")
    }
  }

  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.fileUrl
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage = false) => {
    const file = e.target.files?.[0]

    if (file) {
      try {
        setIsUploading(true)
        const imageUrl = await uploadImage(file)

        if (isMainImage) {
          setFormData((prev) => ({
            ...prev,
            mainImage: imageUrl,
          }))
        } else {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }))
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Failed to upload image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Le nom est requis"
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "La description courte est requise"
    if (!formData.fullDescription.trim()) newErrors.fullDescription = "La description complète est requise"
    if (!formData.price.trim()) newErrors.price = "Le prix est requis"
    if (!formData.mainImage) newErrors.mainImage = "L'image principale est requise"
    if (formData.materials.length === 0) newErrors.materials = "Au moins un matériau est requis"
    if (formData.sizes.length === 0) newErrors.sizes = "Au moins une taille est requise"
    if (formData.colors.length === 0) newErrors.colors = "Au moins une couleur est requise"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description courte*
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]`}
            />
            {errors.shortDescription && <p className="mt-1 text-xs text-red-500">{errors.shortDescription}</p>}
          </div>

          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description complète*
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={4}
              value={formData.fullDescription}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.fullDescription ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]`}
            />
            {errors.fullDescription && <p className="mt-1 text-xs text-red-500">{errors.fullDescription}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Prix*
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="ex: 1200 MAD"
                className={`w-full px-3 py-2 border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]`}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#415e5a] focus:ring-[#415e5a] border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                  En stock
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials, Sizes, Colors */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Attributs du produit</h2>
        <div className="space-y-6">
          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matériaux*</label>
            {errors.materials && <p className="mt-1 text-xs text-red-500">{errors.materials}</p>}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.materials.map((material, index) => (
                <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{material}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(material)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Ajouter un matériau"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]"
              />
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-3 py-2 bg-[#415e5a] text-white rounded-r-md hover:bg-[#5a7d79] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tailles*</label>
            {errors.sizes && <p className="mt-1 text-xs text-red-500">{errors.sizes}</p>}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Ajouter une taille"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-2 bg-[#415e5a] text-white rounded-r-md hover:bg-[#5a7d79] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleurs*</label>
            {errors.colors && <p className="mt-1 text-xs text-red-500">{errors.colors}</p>}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Ajouter une couleur"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-2 bg-[#415e5a] text-white rounded-r-md hover:bg-[#5a7d79] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
        <div className="space-y-6">
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image principale*</label>
            {errors.mainImage && <p className="mt-1 text-xs text-red-500">{errors.mainImage}</p>}
            {formData.mainImage ? (
              <div className="relative w-full h-48 mb-2 border rounded-md overflow-hidden">
                <img
                  src={formData.mainImage || "/placeholder.svg"}
                  alt="Main product"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, mainImage: "" }))}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
                {isUploading ? (
                  <Loader2 size={24} className="text-gray-400 animate-spin mb-2" />
                ) : (
                  <Upload size={24} className="text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-500 mb-2">Cliquez pour télécharger une image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images supplémentaires</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative h-24 border rounded-md overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-md h-24 flex flex-col items-center justify-center relative cursor-pointer">
                {isUploading ? (
                  <Loader2 size={20} className="text-gray-400 animate-spin" />
                ) : (
                  <Upload size={20} className="text-gray-400" />
                )}
                <p className="text-xs text-gray-500">Ajouter</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 bg-[#415e5a] text-white rounded-md hover:bg-[#5a7d79] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
          {product ? "Mettre à jour" : "Ajouter le produit"}
        </button>
      </div>
    </form>
  )
}
