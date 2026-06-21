'use client';

import { motion } from 'framer-motion';
import { CoupleDress } from "@/components/ui/DressCodeIcons"

interface DressCodeProps {
  vestimentaHombres: string;
  vestimentaMujeres: string;
  coloresSugeridos?: string[];
  coloresReservados?: string[];
  restricciones?: string;
}

export function DressCode({
  vestimentaHombres,
  vestimentaMujeres,
  coloresSugeridos = [],
  coloresReservados = ['Blanco', 'Crema'],
  restricciones,
}: DressCodeProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
          Dress Code
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
      >
        <div className="flex justify-center mb-4">
          <CoupleDress className="w-36 h-36 text-principal" />
        </div>
        <h3 className="font-playfair text-xl font-semibold text-text-primary mb-2">
          Elegante
        </h3>
        <p className="font-cormorant text-lg">
          Los tonos{" "}
          <span className="font-semibold text-principal-light">
            {coloresReservados.join(", ")}
          </span>{" "}
          están reservados para la novia.
        </p>
      </motion.div>
    </div>
  )
}
