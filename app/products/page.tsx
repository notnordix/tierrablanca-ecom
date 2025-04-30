import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"
import ProductGrid from "@/components/product-grid"
import EmptyProductState from "@/components/empty-product-state"
import { fetchAllProducts } from "@/app/actions/product-actions"

export default async function ProductsPage() {
  const products = await fetchAllProducts()

  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      <Header />
      <PageHero
        title="Nos Produits"
        subtitle="Fabriqués à la main avec soin et tradition"
        backgroundImage="https://i.ibb.co/zT9KRYjr/a36ba9c5-941e-4749-b5bc-28e57e20f26e.jpg"
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-3">
              Parcourir Notre Collection
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-[#415e5a] mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Explorez notre gamme complète de céramiques marocaines artisanales, chaque pièce racontant une histoire de
              tradition et d'artisanat.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415e5a]"></div>
              </div>
            }
          >
            {products.length > 0 ? (
              <ProductGrid products={products} showAnimation={false} />
            ) : (
              <EmptyProductState
                title="Collection Bientôt Disponible"
                message="Nous sommes en train de créer notre nouvelle collection. Veuillez revenir bientôt ou nous contacter pour plus d'informations."
              />
            )}
          </Suspense>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
