import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"
import AboutPageContent from "@/components/about-page-content"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      <Header />
      <PageHero
        title="À Propos"
        subtitle="Notre histoire, notre passion, notre artisanat"
        backgroundImage="https://i.ibb.co/zT9KRYjr/a36ba9c5-941e-4749-b5bc-28e57e20f26e.jpg"
      />
      <AboutPageContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
