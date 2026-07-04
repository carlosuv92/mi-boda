'use client';

import { motion } from 'framer-motion';
import { Heart, Wine, UtensilsCrossed, Music, PartyPopper } from 'lucide-react';

const events = [
  { icon: Heart, label: 'Ceremonia', time: '11:00 AM', desc: 'Iglesia Nuestra Señora del Rosario' },
  { icon: Wine, label: 'Cocktail', time: '12:30 PM', desc: 'Salón de recepciones' },
  { icon: UtensilsCrossed, label: 'Cena', time: '2:00 PM', desc: 'Banquete de tres tiempos' },
  { icon: PartyPopper, label: 'Baile', time: '4:00 PM', desc: 'Apertura de pista' },
  { icon: Music, label: 'Fiesta', time: '6:00 PM', desc: 'Música y diversión' },
];

export function Timeline() {
  return (
    <div className="relative max-w-2xl mx-auto px-4">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-principal/20 via-principal/60 to-principal/20 md:-translate-x-px" />

      <div className="space-y-10 md:space-y-8">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative flex md:items-start ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row pl-16 md:pl-0`}
            >
              {/* Lado vacío (alternancia) */}
              <div className="hidden md:block w-1/2" />

              {/* Marcador en la línea */}
              <div className="absolute left-6 md:left-1/2 top-6 md:-translate-x-1/2 z-10">
                <div className="w-10 h-10 bg-white border-2 border-principal/40 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-principal rounded-full" />
                </div>
              </div>

              {/* Conector horizontal (solo desktop) */}
              <div className={`hidden md:block absolute top-6 h-px w-6 bg-principal/30 ${
                isLeft ? 'left-[calc(50%+24px)]' : 'right-[calc(50%+24px)]'
              }`} />

              {/* Card del evento */}
              <div className={`md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                <div className="bg-white rounded-2xl p-5 border border-cream-dark shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <event.icon className="w-5 h-5 text-principal shrink-0" />
                    <span className="text-principal font-cormorant text-lg tracking-wide font-medium">
                      {event.time}
                    </span>
                  </div>
                  <h4 className="font-playfair text-xl text-text-primary">
                    {event.label}
                  </h4>
                  <p className="text-text-secondary font-cormorant text-base mt-1">
                    {event.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
