"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ProductGrid from "./product-grid"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import EmptyProductState from "./empty-product-state"
import type { Product } from "@/lib/products"
import { fetchAllProducts } from "@/app/actions/product-actions"

export default function FeaturedProducts() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const productsData = await fetchAllProducts()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Only show the first 6 products in the featured section
  const featuredProducts = products.slice(0, 6)

  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 bg-[#f9f7f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-3">
            Notre Collection
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-[#415e5a] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
            Découvrez nos pièces artisanales qui allient savoir-faire marocain traditionnel et design moderne.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415e5a]"></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyProductState
              title="Bientôt Disponible"
              message="Nous travaillons sur notre nouvelle collection. Revenez bientôt pour découvrir nos dernières créations artisanales."
              compact={true}
            />
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-[#415e5a] text-white rounded-md text-sm sm:text-base font-medium hover:bg-[#5a7d79] transition-colors group"
            >
              Voir Tous Les Produits
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
