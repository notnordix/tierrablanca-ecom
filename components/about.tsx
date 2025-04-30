"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import Image from "next/image"

export default function About() {
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
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-[#415e5a] text-white">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            À Propos de TierraBlanca
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto italic">
            "Un hommage au terroir, dans une version résolument moderne."
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6 order-2 md:order-1">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              TierraBlanca est une marque spécialisée dans la conception et la création d'articles exclusifs pour un
              usage pratique et décoratif. Nous mettons l'accent sur la qualité et la simplicité pour valoriser nos
              produits.
            </p>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Chaque pièce de notre collection est méticuleusement fabriquée par des artisans qualifiés, préservant des
              techniques séculaires tout en adoptant une esthétique moderne.
            </p>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Notre engagement envers la qualité et l'authenticité garantit que chaque création TierraBlanca apporte une
              touche de créativité minimaliste unique.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-[250px] sm:h-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-xl order-1 md:order-2"
          >
            <Image
              src="https://i.ibb.co/9mRnPKrX/8e709afe-8724-4eed-868d-f6fcf7cffb01.jpg"
              alt="Artisanat TierraBlanca"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
