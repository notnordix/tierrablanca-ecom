"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Loader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 2
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 40)

    // Hide the loader after completion
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  if (!loading) return null

  // Calculate the circle's circumference and stroke-dasharray
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#415e5a]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative"
      >
        {/* SVG Circle Progress */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </svg>

        {/* TB Initials */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto relative z-10">
          <span className="text-3xl font-serif font-bold text-white">TB</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
