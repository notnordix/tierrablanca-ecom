"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import type { Product } from "@/lib/products"

interface ProductGridProps {
  products: Product[]
  showAnimation?: boolean
}

export default function ProductGrid({ products, showAnimation = true }: ProductGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (!showAnimation) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
