import { ShoppingBag } from "lucide-react"
import Link from "next/link"

interface EmptyProductStateProps {
  title?: string
  message?: string
  showLink?: boolean
  compact?: boolean
}

export default function EmptyProductState({
  title = "Aucun Produit Trouvé",
  message = "Nous n'avons pas pu trouver de produits correspondant à vos critères.",
  showLink = true,
  compact = false,
}: EmptyProductStateProps) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center bg-[#f9f7f4] rounded-lg border border-gray-200 ${
        compact ? "py-8" : "py-16"
      }`}
    >
      <div className="bg-[#415e5a]/10 p-4 rounded-full mb-4">
        <ShoppingBag className="w-8 h-8 text-[#415e5a]" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-[#415e5a] mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6 px-4">{message}</p>
      {showLink && (
        <Link
          href="/contact"
          className="px-4 py-2 bg-[#415e5a] text-white rounded-md text-sm hover:bg-[#5a7d79] transition-colors"
        >
          Contactez-Nous
        </Link>
      )}
    </div>
  )
}
