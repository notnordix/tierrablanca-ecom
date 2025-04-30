"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Product } from "@/lib/products"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
      >
        {/* Image container with fixed aspect ratio */}
        <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
          <Image
            src={product.mainImage || "/placeholder.svg"}
            alt={product.name}
            className="transition-transform duration-700 ease-in-out group-hover:scale-110 object-cover"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          <div
            className={`absolute inset-0 bg-[#415e5a]/70 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-3 py-1.5 bg-white text-[#415e5a] rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* Content container with improved styling */}
        <div className="p-3 sm:p-4 flex-grow flex flex-col">
          <h3 className="text-sm sm:text-base font-serif font-semibold text-[#415e5a] mb-1 sm:mb-2">{product.name}</h3>

          {/* Reduced height description container with ellipsis for overflow */}
          <div className="h-8 sm:h-12 mb-2">
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          {/* Price with improved styling */}
          <div className="mt-auto flex items-center justify-between">
            <p className="text-xs sm:text-sm text-[#415e5a] font-semibold">{product.price.replace("€", "MAD")}</p>

            {/* Stock indicator - smaller on mobile */}
            {product.inStock ? (
              <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
