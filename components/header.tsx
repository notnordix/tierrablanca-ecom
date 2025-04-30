"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"

interface HeaderProps {
  forceWhite?: boolean
}

export default function Header({ forceWhite = false }: HeaderProps) {
  const { totalItems, openCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(forceWhite)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  // Update window height and header height on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight)
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    // Set initial dimensions
    updateDimensions()

    // Update dimensions on resize
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // More robust scroll locking
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY

      // Apply styles to lock the body
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      // Restore scroll position when menu is closed
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    return () => {
      // Clean up styles when component unmounts
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(forceWhite || window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // Set initial scroll state
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [forceWhite])

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animation variants for the mobile menu
  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      },
    },
  }

  // Animation variants for menu items
  const menuItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  }

  const menuItems = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Produits", href: "/products" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5 md:py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className={cn("text-2xl md:text-3xl font-serif font-bold", isScrolled ? "text-[#415e5a]" : "text-white")}
            >
              TierraBlanca
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-base relative group transition-colors font-medium",
                  isScrolled ? "text-[#415e5a] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                    isScrolled ? "bg-[#415e5a]" : "bg-white",
                  )}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Action Icons - Shopping Bag with Counter */}
          <div className="hidden md:flex items-center">
            <button
              className={cn(
                "transition-colors relative",
                isScrolled ? "text-[#415e5a] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
              )}
              onClick={openCart}
              aria-label="Panier"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#415e5a] text-white text-xs flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              className={cn(
                "relative transition-colors",
                isScrolled ? "text-[#415e5a] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
              )}
              onClick={openCart}
              aria-label="Panier"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#415e5a] text-white text-xs flex items-center justify-center">
                {totalItems}
              </span>
            </button>
            <button
              className={cn(
                "p-2 rounded-md transition-colors",
                isScrolled ? "text-[#415e5a] hover:bg-[#415e5a]/10" : "text-white hover:bg-white/10",
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Fixed overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              style={{ height: windowHeight }}
            />

            {/* Menu */}
            <motion.div
              initial="closed"
              animate="open"
              exit="exit"
              variants={menuVariants}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl z-50 md:hidden"
              style={{ height: windowHeight }}
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-[#415e5a]">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-[#415e5a]/10 transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X size={24} className="text-[#415e5a]" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-6 px-5">
                  <nav className="space-y-6">
                    {menuItems.map((item, i) => (
                      <motion.div
                        key={item.name}
                        custom={i}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <Link
                          href={item.href}
                          className="block text-[#415e5a] hover:text-[#5a7d79] hover:bg-[#415e5a]/5 transition-colors font-medium py-3 px-4 rounded-md text-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Menu Footer */}
                <div className="p-5 border-t border-gray-100">
                  <div className="flex space-x-4 justify-center">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#415e5a]/10 flex items-center justify-center hover:bg-[#415e5a]/20 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#415e5a]"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/tierrablanca.ma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#415e5a]/10 flex items-center justify-center hover:bg-[#415e5a]/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#415e5a]"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
