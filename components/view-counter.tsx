"use client"

import { useEffect, useState } from "react"

export default function ViewCounter() {
  const [hasIncremented, setHasIncremented] = useState(false)

  useEffect(() => {
    const checkAndIncrementView = async () => {
      // Check if this view has been counted in this session
      const hasViewedKey = "tierrablanca_has_viewed"
      const hasViewed = sessionStorage.getItem(hasViewedKey)

      if (!hasViewed) {
        try {
          // If not counted yet, increment the view count
          await fetch("/api/stats/views", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })

          // Mark as viewed in this session
          sessionStorage.setItem(hasViewedKey, "true")
          setHasIncremented(true)
        } catch (error) {
          console.error("Error incrementing view count:", error)
        }
      }
    }

    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      checkAndIncrementView()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Return null so nothing is rendered
  return null
}
