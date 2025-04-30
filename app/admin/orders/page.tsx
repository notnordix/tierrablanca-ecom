"use client"

import { useState, useEffect } from "react"
import { Search, Eye, ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import { getAllOrders, updateOrderStatus } from "@/lib/orders"
import type { Order } from "@/lib/orders"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleMarkAsCompleted = async (orderId: string) => {
    setOrderToComplete(orderId)
  }

  const confirmMarkAsCompleted = async () => {
    if (!orderToComplete) return

    try {
      const success = await updateOrderStatus(orderToComplete, "completed")
      if (success) {
        setOrders(
          orders.map((order) => (order.id === orderToComplete ? { ...order, status: "completed" as const } : order)),
        )
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setOrderToComplete(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415e5a]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Gestion des Commandes</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des commandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]"
            />
          </div>
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "completed")}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#415e5a] focus:border-[#415e5a]"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Complété</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount.toLocaleString()} MAD
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "completed" ? "Complété" : "En attente"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleMarkAsCompleted(order.id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Marquer comme complété"
                          >
                            <Check size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingCart size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune commande trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
      {orderToComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Confirmer l'action</h3>
            <p className="text-gray-600 mb-4">Êtes-vous sûr de vouloir marquer cette commande comme complétée?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOrderToComplete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmMarkAsCompleted}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
