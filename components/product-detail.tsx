"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, Minus, Plus, ShoppingBag, Check, ArrowLeft, ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  // For image gallery navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextImage()
      } else if (e.key === "ArrowLeft") {
        prevImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor)
    setIsAddedToCart(true)

    // Reset the "Added to Cart" message after 3 seconds
    setTimeout(() => {
      setIsAddedToCart(false)
    }, 3000)
  }

  // Map color names to actual color values for the UI
  const getColorValue = (colorName: string): string => {
    const colorNameLower = colorName.toLowerCase()
    const colorMap: Record<string, string> = {
      white: "#ffffff",
      cream: "#f5f5dc",
      beige: "#f5f5dc",
      gray: "#808080",
      grey: "#808080",
      black: "#333333",
      blue: "#4a90e2",
      sage: "#bcb88a",
      terracotta: "#e2725b",
      green: "#4caf50",
      brown: "#8b4513",
      tan: "#d2b48c",
      ivory: "#fffff0",
      red: "#e53935",
      orange: "#ff9800",
      yellow: "#ffc107",
      purple: "#9c27b0",
      pink: "#e91e63",
      gold: "#ffd700",
      silver: "#c0c0c0",
      bronze: "#cd7f32",
      natural: "#e8e0d5",
    }

    return colorMap[colorNameLower] || "#cccccc" // Default to a light gray if color not found
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column - Product Images - Slightly smaller */}
        <div className="space-y-6">
          {/* Main Image Container - Reduced size */}
          <div className="relative w-11/12 mx-auto aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
              aria-label="Image précédente"
            >
              <ArrowLeft size={18} className="text-[#415e5a]" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
              aria-label="Image suivante"
            >
              <ArrowRight size={18} className="text-[#415e5a]" />
            </button>

            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-[#415e5a]">
              {selectedImage + 1} / {product.images.length}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex justify-center items-center space-x-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThumbnailClick(index)}
                className={`relative overflow-hidden rounded-lg ${
                  selectedImage === index
                    ? "ring-2 ring-[#415e5a] ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-[#415e5a]/50"
                } w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 flex-shrink-0`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Vue ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Product Name and Price */}
          <div className="border-b border-gray-100 pb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-start"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-base mb-3">{product.shortDescription}</p>
              </div>
              <p className="text-xl sm:text-2xl font-medium text-[#415e5a]">{product.price.replace("€", "MAD")}</p>
            </motion.div>

            {/* Stock Status - Simplified */}
            <div className="mt-2">
              {product.inStock ? (
                <p className="text-green-600 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  En Stock
                </p>
              ) : (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  Rupture de Stock
                </p>
              )}
            </div>
          </div>

          {/* Materials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {product.materials.map((material, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#415e5a]/10 text-[#415e5a]"
              >
                {material}
              </span>
            ))}
          </motion.div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Taille</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-[#415e5a] text-white border-[#415e5a]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={!product.inStock}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Couleur</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const bgColor = getColorValue(color)

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? "ring-2 ring-[#415e5a] ring-offset-2" : "ring-1 ring-gray-200"
                      }`}
                      style={{ backgroundColor: bgColor }}
                      aria-label={`Sélectionner la couleur ${color}`}
                      title={color}
                      disabled={!product.inStock}
                    />
                  )
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">Sélectionné: {selectedColor}</p>
            </div>
          )}

          {/* Product Description - No tabs anymore */}
          <div className="py-4">
            <p className="text-gray-600 text-sm leading-relaxed">{product.fullDescription}</p>
          </div>

          {/* Shipping Information - Restyled */}
          <div className="flex items-center border-l-4 border-[#415e5a] pl-4 py-2">
            <Truck size={18} className="text-[#415e5a] mr-3" />
            <div>
              <p className="font-medium text-[#415e5a]">Livraison Disponible</p>
              <p className="text-xs text-gray-600">Livraison disponible partout au Maroc</p>
            </div>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="pt-4">
            <div className="flex flex-col space-y-4">
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    disabled={!product.inStock}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 text-center">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    disabled={!product.inStock}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button - No heart button */}
              <div>
                <AnimatePresence mode="wait">
                  {isAddedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-center justify-center"
                    >
                      <Check size={18} className="mr-2" />
                      Ajouté au Panier
                    </motion.div>
                  ) : (
                    <motion.button
                      key="add"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="w-full py-3 px-4 bg-[#415e5a] text-white rounded-md flex items-center justify-center hover:bg-[#5a7d79] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={18} className="mr-2" />
                      {product.inStock ? "Ajouter au Panier" : "Rupture de Stock"}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
