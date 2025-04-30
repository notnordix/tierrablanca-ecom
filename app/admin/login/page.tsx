"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Info } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth-context"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdminAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        // Set a cookie to persist the authentication
        document.cookie = "tierrablanca-admin-auth=true; path=/; max-age=86400" // 24 hours
        router.push(from)
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-block relative w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-[#415e5a] rounded-full flex items-center justify-center">
              <span className="text-2xl font-serif font-bold text-white">TB</span>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#415e5a]">TierraBlanca Admin</h1>
          <p className="text-gray-600 text-sm mt-1">Connectez-vous pour accéder au tableau de bord</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#415e5a] focus:border-[#415e5a]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#415e5a] focus:border-[#415e5a]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#415e5a] text-white rounded-md hover:bg-[#5a7d79] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TierraBlanca Admin</p>
        </div>
      </motion.div>
    </div>
  )
}
