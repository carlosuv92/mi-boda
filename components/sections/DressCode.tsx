'use client'

import { motion } from 'framer-motion'
import { CoupleDress } from '@/components/ui/DressCodeIcons'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function DressCode() {
  return (
    <div>
      <SectionHeader
        title="Dress Code"
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
      >
        <p className="font-cormorant text-xl font-semibold">Elegante</p>
        <div className="flex justify-center mb-4">
          <CoupleDress className="w-36 h-36 text-principal" />
        </div>
        <h3 className="font-cormorant text-xl font-semibold mb-2">
          Damas vestido largo, caballeros con traje.
        </h3>
        <p className="font-cormorant text-lg">
          Con mucho cariño, reservamos el color blanco y sus derivados exclusivamente para la novia.
        </p>
      </motion.div>
    </div>
  )
}
