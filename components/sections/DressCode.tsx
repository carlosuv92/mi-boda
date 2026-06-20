'use client';

import { motion } from 'framer-motion';
import { ManSuit, WomanDress } from '@/components/ui/DressCodeIcons';

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
          Código de Vestimenta
        </h2>
        <p className="text-text-secondary font-cormorant text-lg">
          {vestimentaHombres} / {vestimentaMujeres}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
        >
          <div className="flex justify-center mb-4">
            <ManSuit className="w-12 h-12 text-principal" />
          </div>
          <h3 className="font-playfair text-xl font-semibold text-text-primary mb-2">
            Hombres
          </h3>
          <p className="text-text-secondary font-cormorant text-lg">
            {vestimentaHombres}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
        >
          <div className="flex justify-center mb-4">
            <WomanDress className="w-12 h-12 text-principal" />
          </div>
          <h3 className="font-playfair text-xl font-semibold text-text-primary mb-2">
            Mujeres
          </h3>
          <p className="text-text-secondary font-cormorant text-lg">
            {vestimentaMujeres}
          </p>
        </motion.div>
      </div>

      {coloresSugeridos.length > 0 && (
        <div className="text-center mb-8">
          <h4 className="font-playfair text-lg font-semibold text-text-primary mb-4">
            Colores sugeridos
          </h4>
          <div className="flex justify-center gap-3 flex-wrap">
            {coloresSugeridos.map((color) => (
              <span
                key={color}
                className="px-4 py-2 bg-cream-dark rounded-full text-sm text-text-secondary font-cormorant"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-charcoal text-white rounded-xl p-6 text-center"
      >
        <p className="font-cormorant text-lg">
          Los tonos <span className="font-semibold text-principal-light">{coloresReservados.join(', ')}</span> están reservados para la novia.
        </p>
        {restricciones && (
          <p className="text-sm text-white/60 mt-2 font-cormorant">
            Evitar colores como: <span className="font-extrabold text-detalle">{restricciones}</span>
          </p>
        )}
      </motion.div>
    </div>
  );
}
