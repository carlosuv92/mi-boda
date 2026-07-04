'use client';

import { motion } from 'framer-motion';
import { Heart, Wine, UtensilsCrossed, Music, PartyPopper } from 'lucide-react';

const events = [
  { icon: Heart, label: 'Ceremonia', time: '11:00 AM' },
  { icon: Wine, label: 'Cocktail', time: '12:30 PM' },
  { icon: UtensilsCrossed, label: 'Cena', time: '2:00 PM' },
  { icon: PartyPopper, label: 'Baile', time: '4:00 PM' },
  { icon: Music, label: 'Fiesta', time: '6:00 PM' },
];

export function Timeline() {
  return (
    <div className="relative max-w-3xl mx-auto px-4">
      {/* Línea vertical central */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-principal/30 via-principal to-principal/30 hidden md:block" />
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-principal/30 via-principal to-principal/30 md:hidden" />

      <div className="space-y-16 md:space-y-20">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative flex items-start ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row pl-20 md:pl-0`}
            >
              {/* Lado izquierdo (espacio vacío para alternar) */}
              <div className={`hidden md:block w-1/2 ${isLeft ? 'text-right pr-12' : 'text-left pl-12'}`}>
                {isLeft && (
                  <div>
                    <span className="text-principal font-cormorant text-lg tracking-wide">
                      {event.time}
                    </span>
                    <h4 className="font-playfair text-xl text-text-primary mt-1">
                      {event.label}
                    </h4>
                  </div>
                )}
              </div>

              {/* Punto + ícono en la línea central */}
              <div className="absolute left-8 md:left-1/2 top-1 md:-translate-x-1/2 z-10">
                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-cream border-2 border-principal/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-principal rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                  <event.icon className="w-4 h-4 md:w-5 md:h-5 text-principal" />
                </div>
              </div>

              {/* Línea conectora horizontal */}
              <div className={`hidden md:block absolute top-6 h-px w-6 bg-principal/30 ${
                isLeft ? 'left-[calc(50%+24px)]' : 'right-[calc(50%+24px)]'
              }`} />

              {/* Lado derecho (contenido) */}
              <div className={`md:w-1/2 md:pl-12 ${isLeft ? 'md:pl-12' : 'md:pr-12'}`}>
                {/* Mobile: hora arriba */}
                <div className="md:hidden mb-1">
                  <span className="text-principal font-cormorant text-base tracking-wide">
                    {event.time}
                  </span>
                </div>
                <h4 className={`font-playfair text-xl md:text-2xl text-text-primary ${
                  isLeft ? 'md:text-right' : ''
                }`}>
                  {event.label}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
