"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPageContent() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-3">Notre Histoire</h2>
          <div className="w-16 sm:w-24 h-1 bg-[#415e5a] mx-auto mb-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div variants={itemVariants} className="space-y-6">
            <p className="text-base text-gray-700 leading-relaxed">
              Fondée en 2018, TierraBlanca est née d'une passion pour l'artisanat traditionnel marocain et d'une vision visant à introduire ces techniques intemporelles dans les foyers contemporains du monde entier.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Notre aventure a commencé lorsque notre fondatrice, Sofia Benali, a découvert l'argile blanche remarquable unique à la région des montagnes de l'Atlas. Inspirée par sa pureté et sa polyvalence, elle a rassemblé une équipe de maîtres artisans pour créer des pièces qui honorent la tradition tout en adoptant des principes de design moderne.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Le nom "TierraBlanca" – signifiant "terre blanche" – rend hommage à l'argile immaculée qui constitue la base de nos créations, symbolisant notre engagement envers les matériaux naturels et les pratiques durables.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-[300px] sm:h-[400px] rounded-lg overflow-hidden shadow-xl order-first md:order-last"
          >
            <Image
              src="https://i.ibb.co/9mRnPKrX/8e709afe-8724-4eed-868d-f6fcf7cffb01.jpg"
              alt="TierraBlanca artisan craftsmanship"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#415e5a] mb-3">Notre Philosophie</h2>
          <div className="w-16 sm:w-24 h-1 bg-[#415e5a] mx-auto mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="bg-[#f9f7f4] p-6 rounded-lg">
            <h3 className="text-xl font-serif font-semibold text-[#415e5a] mb-4">Savoir-faire</h3>
            <p className="text-gray-700">
              Chaque pièce est méticuleusement fabriquée à la main par des artisans qualifiés utilisant des techniques transmises de génération en génération, garantissant une qualité exceptionnelle et l'unicité de chaque création.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#f9f7f4] p-6 rounded-lg">
            <h3 className="text-xl font-serif font-semibold text-[#415e5a] mb-4">Durabilité</h3>
            <p className="text-gray-700">
              Nous nous engageons dans des pratiques écologiquement responsables, utilisant des matériaux naturels et des méthodes traditionnelles qui minimisent notre empreinte écologique tout en soutenant les communautés locales.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#f9f7f4] p-6 rounded-lg">
            <h3 className="text-xl font-serif font-semibold text-[#415e5a] mb-4">Design Intemporel</h3>
            <p className="text-gray-700">
              Nos designs mêlent l'esthétique traditionnelle marocaine au minimalisme contemporain, créant des pièces à la fois intemporelles et polyvalentes, qui embellissent n'importe quel espace de vie.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
