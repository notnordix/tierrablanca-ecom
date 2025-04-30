"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth-context"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, pathname])

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Don't render anything until authentication check is complete
  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produits", href: "/admin/products", icon: Package },
    { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  ]

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#415e5a] text-white">
        <div className="p-4 border-b border-[#5a7d79]">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
              <span className="text-lg font-serif font-bold text-[#415e5a]">TB</span>
            </div>
            <span className="text-xl font-serif font-bold">TierraBlanca</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#5a7d79]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#415e5a] text-white p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
            <span className="text-sm font-serif font-bold text-[#415e5a]">TB</span>
          </div>
          <span className="text-lg font-serif font-bold">TierraBlanca</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-md hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#415e5a] text-white"
          >
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          isActive ? "bg-white/20" : "hover:bg-white/10"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={18} className="mr-3" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Déconnexion</span>
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}
