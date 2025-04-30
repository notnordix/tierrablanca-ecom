"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void
  removeItem: (id: number, size?: string, color?: string) => void
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem("tierrablanca-cart")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
          localStorage.removeItem("tierrablanca-cart")
        }
      }
    }
  }, [isClient])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient && items.length > 0) {
      localStorage.setItem("tierrablanca-cart", JSON.stringify(items))
    }
  }, [items, isClient])

  // Calculate total items and price
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    // Extract the numeric part from the price string (e.g., "1200 MAD" -> 1200)
    const priceValue = Number.parseFloat(item.price.replace(/[^0-9.]/g, ""))
    return sum + priceValue * item.quantity
  }, 0)

  // Helper function to find an item in the cart
  const findCartItemIndex = (id: number, size?: string, color?: string) => {
    return items.findIndex(
      (item) => item.id === id && (size ? item.size === size : true) && (color ? item.color === color : true),
    )
  }

  // Add item to cart
  const addItem = (product: Product, quantity: number, size?: string, color?: string) => {
    setItems((prevItems) => {
      const existingItemIndex = findCartItemIndex(product.id, size, color)

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        return prevItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.mainImage,
            quantity,
            size,
            color,
          },
        ]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: number, size?: string, color?: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => !(item.id === id && (size ? item.size === size : true) && (color ? item.color === color : true)),
      )

      // If cart becomes empty, remove from localStorage
      if (newItems.length === 0 && isClient) {
        localStorage.removeItem("tierrablanca-cart")
      }

      return newItems
    })
  }

  // Update item quantity
  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(id, size, color)
      return
    }

    setItems((prevItems) => {
      const existingItemIndex = findCartItemIndex(id, size, color)

      if (existingItemIndex !== -1) {
        return prevItems.map((item, index) => (index === existingItemIndex ? { ...item, quantity } : item))
      }

      return prevItems
    })
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    if (isClient) {
      localStorage.removeItem("tierrablanca-cart")
    }
  }

  // Open cart modal
  const openCart = () => setIsCartOpen(true)

  // Close cart modal
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
