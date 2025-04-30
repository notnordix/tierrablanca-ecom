import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-white">
      <Header forceWhite={true} />
      <div className="pt-32 pb-16 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          We couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#415e5a] text-white rounded-md hover:bg-[#5a7d79] transition-colors"
        >
          Browse All Products
        </Link>
      </div>
      <Footer />
    </main>
  )
}
