import Header from "@/components/header"
import Footer from "@/components/footer"
import Contact from "@/components/contact"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      <Header />
      <PageHero
        title="Contactez-Nous"
        subtitle="Nous serions ravis de vous entendre"
        backgroundImage="https://i.ibb.co/zT9KRYjr/a36ba9c5-941e-4749-b5bc-28e57e20f26e.jpg"
      />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
