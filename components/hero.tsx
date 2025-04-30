"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Hero() {
  const [viewportHeight, setViewportHeight] = useState("100vh")

  useEffect(() => {
    // Function to update the viewport height
    const updateViewportHeight = () => {
      // Use window.innerHeight to get the actual visible height
      setViewportHeight(`${window.innerHeight}px`)
    }

    // Set initial height
    updateViewportHeight()

    // Update height on resize and on orientation change
    window.addEventListener("resize", updateViewportHeight)
    window.addEventListener("orientationchange", updateViewportHeight)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateViewportHeight)
      window.removeEventListener("orientationchange", updateViewportHeight)
    }
  }, [])

  // Add smooth scrolling function
  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const productsSection = document.getElementById("products")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative w-full bg-[#f9f7f4] overflow-hidden" style={{ height: viewportHeight }}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://i.ibb.co/zT9KRYjr/a36ba9c5-941e-4749-b5bc-28e57e20f26e.jpg"
          alt="TierraBlanca articles exclusifs"
          className="object-cover"
          priority
          fill
          sizes="100vw"
          quality={90}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-3 sm:mb-4">
            Élégance. Authenticité.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-2">
            Articles exclusifs. Design artisanal unique TierraBlanca
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6">Fabriqué au Maroc</p>
          <motion.a
            href="#products"
            onClick={scrollToProducts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-[#415e5a] text-white rounded-md text-sm sm:text-base font-medium hover:bg-[#5a7d79] transition-colors group"
          >
            Découvrir Notre Collection
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>

      {/* Mobile Scroll Indicator - Only visible on mobile */}
      <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="w-2 h-2 bg-white rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="w-2 h-2 bg-white rounded-full mt-2"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="w-2 h-2 bg-white rounded-full mt-2"
        />
      </div>
    </section>
  )
}
