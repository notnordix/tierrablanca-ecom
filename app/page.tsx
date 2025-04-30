import Hero from "@/components/hero"
import About from "@/components/about"
import FeaturedProducts from "@/components/featured-products"
import Contact from "@/components/contact"
import WhatsAppButton from "@/components/whatsapp-button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ViewCounter from "@/components/view-counter"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      <Header />
      <Hero />
      <About />
      <FeaturedProducts />
      <Contact />
      <Footer />
      <ViewCounter />
      <WhatsAppButton />
    </main>
  )
}
