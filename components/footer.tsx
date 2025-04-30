import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  const menuItems = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Produits", href: "/products" },
    { name: "Contact", href: "/contact" },
  ]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#415e5a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Brand */}
          <div className="mb-8 md:mb-0">
            <Link href="/" className="inline-block">
              <span className="text-2xl md:text-3xl font-serif font-bold text-white">TierraBlanca</span>
            </Link>
            <p className="mt-2 text-sm text-white/70 max-w-xs">
              Articles artisanaux fabriqués au Maroc, où l'élégance rencontre l'authenticité.
            </p>
          </div>

          {/* Navigation */}
          <nav className="mb-8 md:mb-0">
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-white/80 relative group transition-colors font-medium"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://instagram.com/tierrablanca.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-white" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <p className="text-sm text-white/60">© {currentYear} TierraBlanca. Tous droits réservés.</p>
          <p className="text-sm text-white/60 mt-1">
            <a href="mailto:Contact@sofiandco.ma" className="hover:text-white transition-colors">
              Contact@sofiandco.ma
            </a>{" "}
            | <span>+212 6 43 87 48 52</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
