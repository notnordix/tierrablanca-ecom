"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check for the auth cookie
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const authCookie = cookies.find((cookie) => cookie.startsWith("tierrablanca-admin-auth="))

      if (authCookie) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Call the API to verify credentials
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    // Clear the auth cookie
    document.cookie = "tierrablanca-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setIsAuthenticated(false)
  }

  return <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
