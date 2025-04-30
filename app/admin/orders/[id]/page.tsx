"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Truck, User, MapPin, Mail, Phone, Package } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import type { Order } from "@/lib/orders"

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const orderId = unwrappedParams.id
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const orderData = await response.json()
        setOrder(orderData)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleMarkAsCompleted = async () => {
    if (!order) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update order status")
      }

      setOrder({ ...order, status: "completed" })
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Une erreur s'est produite lors de la mise à jour du statut de la commande.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415e5a]"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Commande non trouvée</h2>
        <p className="text-gray-500 mb-4">La commande que vous recherchez n'existe pas.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-4 py-2 bg-[#415e5a] text-white rounded-md hover:bg-[#5a7d79] transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux commandes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/orders"
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Commande {order.id}</h1>
        </div>
        {order.status === "pending" && (
          <button
            onClick={handleMarkAsCompleted}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Check size={16} className="mr-2" />
            {isUpdating ? "Mise à jour..." : "Marquer comme complété"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Détails de la commande</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-gray-100 rounded-md px-3 py-2 text-sm">
                <span className="text-gray-500">Date:</span> <span className="font-medium">{order.date}</span>
              </div>
              <div className="bg-gray-100 rounded-md px-3 py-2 text-sm">
                <span className="text-gray-500">Statut:</span>{" "}
                <span className={`font-medium ${order.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                  {order.status === "completed" ? "Complété" : "En attente"}
                </span>
              </div>
              <div className="bg-gray-100 rounded-md px-3 py-2 text-sm">
                <span className="text-gray-500">Total:</span>{" "}
                <span className="font-medium">{order.totalAmount.toLocaleString()} MAD</span>
              </div>
            </div>

            <h3 className="font-medium text-gray-900 mb-3">Articles</h3>
            <div className="border rounded-md divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                    {/* Placeholder image - in a real app, you'd fetch the product image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={24} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.size && (
                        <span className="text-xs text-gray-500">
                          Taille: <span className="font-medium">{item.size}</span>
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500">
                          Couleur: <span className="font-medium">{item.color}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Quantité: <span className="font-medium">{item.quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm font-medium text-gray-900">{item.price}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de livraison</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Truck size={18} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Adresse de livraison</p>
                  <p className="text-sm text-gray-500">{order.address}</p>
                  <p className="text-sm text-gray-500">{order.city}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations client</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <User size={18} className="text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nom</p>
                <p className="text-sm text-gray-500">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail size={18} className="text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{order.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone size={18} className="text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Téléphone</p>
                <p className="text-sm text-gray-500">{order.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ville</p>
                <p className="text-sm text-gray-500">{order.city}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
