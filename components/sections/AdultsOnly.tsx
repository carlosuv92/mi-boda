'use client';

import { motion } from 'framer-motion';

interface AdultsOnlyProps {
  mensaje?: string;
}

export function AdultsOnly({ mensaje }: AdultsOnlyProps) {
  if (!mensaje) {
    mensaje = 'Para que todos puedan disfrutar plenamente de esta celebración, nuestro evento será exclusivamente para adultos. Agradecemos mucho su comprensión.';
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 px-6 bg-charcoal text-white"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 mx-auto mb-6 text-principal">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line
              x1="9"
              y1="9"
              x2="9.01"
              y2="9"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="9"
              x2="15.01"
              y2="9"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-white/70 leading-relaxed font-cormorant text-xl">
          Los pequeños también tienen sus momentos especiales, pero en esta
          ocasión nuestra celebración estará destinada<strong className="text-detalle"> exclusivamente para
          adultos.</strong>
        </p>
      </div>
    </motion.section>
  )
}
