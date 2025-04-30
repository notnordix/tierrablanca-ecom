"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, ShoppingCart, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getAllProducts } from "@/lib/products"
import { getAllOrders } from "@/lib/orders"
import { getViewCount } from "@/lib/view-counter"
import type { Product } from "@/lib/products"
import type { Order } from "@/lib/orders"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [viewCount, setViewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData, views] = await Promise.all([getAllProducts(), getAllOrders(), getViewCount()])

        setProducts(productsData)
        setOrders(ordersData)
        setViewCount(views)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  const statCards = [
    {
      title: "Produits",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
      link: "/admin/products",
    },
    {
      title: "Commandes",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-green-500",
      link: "/admin/orders",
    },
    {
      title: "Vues",
      value: viewCount,
      icon: Eye,
      color: "bg-purple-500",
      link: "#",
    },
    {
      title: "Revenu Total",
      value: `${totalRevenue.toLocaleString()} MAD`,
      icon: TrendingUp,
      color: "bg-amber-500",
      link: "#",
    },
  ]

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
        <h1 className="text-2xl font-serif font-bold text-gray-800">Tableau de Bord</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={stat.link}
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Commandes Récentes</h2>
          <Link href="/admin/orders" className="text-sm text-[#415e5a] hover:text-[#5a7d79] transition-colors">
            Voir Tout
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{order.totalAmount.toLocaleString()} MAD</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "completed" ? "Complété" : "En attente"}
                    </span>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-sm text-gray-500 text-center">
                    Aucune commande en attente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Produits Récents</h2>
          <Link href="/admin/products" className="text-sm text-[#415e5a] hover:text-[#5a7d79] transition-colors">
            Voir Tout
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                <img
                  src={product.mainImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#415e5a] font-semibold">{product.price}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "En stock" : "Rupture"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
