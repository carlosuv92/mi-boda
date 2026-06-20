'use client';

import { motion } from 'framer-motion';
import { Heart, Wine, UtensilsCrossed, Music } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  ceremonia: <Heart className="w-5 h-5" />,
  coctel: <Wine className="w-5 h-5" />,
  cena: <UtensilsCrossed className="w-5 h-5" />,
  fiesta: <Music className="w-5 h-5" />,
};

function formatHora(hora: string): string {
  if (!hora) return '';
  
  if (hora.includes(':') && hora.includes('T')) {
    const date = new Date(hora);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours}:${minutesStr} ${ampm}`;
  }
  
  return hora;
}

interface TimelineEvent {
  id: string;
  hora: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-principal-light via-principal to-principal-light" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-start gap-6 pl-12"
          >
            <div className="absolute left-4 w-5 h-5 bg-cream border-2 border-principal rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-principal rounded-full" />
            </div>
            
            <div className="flex-1 bg-white rounded-xl p-4 md:p-6 border border-cream-dark">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-principal">
                  {icons[event.icono] || icons.ceremonia}
                </div>
                <span className="text-sm font-medium text-principal font-cormorant text-lg">{formatHora(event.hora)}</span>
              </div>
              <h4 className="font-playfair text-lg font-semibold text-text-primary">
                {event.titulo}
              </h4>
              {event.descripcion && (
                <p className="text-sm text-text-secondary mt-1 font-cormorant">
                  {event.descripcion}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
