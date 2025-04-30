"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  const [viewportHeight, setViewportHeight] = useState("50vh")

  useEffect(() => {
    // Function to update the viewport height
    const updateViewportHeight = () => {
      // Use window.innerHeight to get the actual visible height
      setViewportHeight(`${window.innerHeight / 2}px`)
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

  return (
    <section className="relative w-full bg-[#f9f7f4] overflow-hidden" style={{ height: viewportHeight }}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={title}
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
            {title}
          </h1>
          {subtitle && <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  )
}
