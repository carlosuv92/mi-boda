'use client';

import { motion } from 'framer-motion';
import IglesiaSVG from '@/components/icons/timeline/Iglesia';
import LocalSVG from '@/components/icons/timeline/Local';
import CopasSVG from '@/components/icons/timeline/Copas';
import NoviosSVG from '@/components/icons/timeline/Novios';
import CenaSVG from '@/components/icons/timeline/Cena';
import BaileSVG from '@/components/icons/timeline/Baile';
import FinSVG from '@/components/icons/timeline/Fin';

const events = [
  { icon: IglesiaSVG, label: 'Ceremonia Religiosa' },
  { icon: LocalSVG, label: 'Recepción' },
  { icon: CopasSVG, label: 'Último ingreso de invitados' },
  { icon: NoviosSVG, label: 'Ingreso de los Novios' },
  { icon: CenaSVG, label: 'Cena' },
  { icon: BaileSVG, label: '¡A bailar!' },
  { icon: FinSVG, label: 'Fin de la fiesta' },
];

export function Timeline() {
  return (
    <div className="bg-white rounded-2xl p-6 text-center border border-cream-dark">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-text-primary -translate-x-1/2" />

        <div className="absolute left-1/2 -top-[0.3125rem] w-2.5 h-2.5 bg-text-primary rounded-full -translate-x-1/2 z-10" />

        <div className="absolute left-1/2 -bottom-[0.3125rem] w-2.5 h-2.5 bg-text-primary rounded-full -translate-x-1/2 z-10" />

        <div className="space-y-0">
          {events.map((event, index) => {
            const Icon = event.icon
            const isRight = index % 2 === 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative min-h-[5.625rem] md:min-h-[6.25rem]"
              >
                {/* Alternating left/right en todos los tamaños */}
                <div className="flex w-full h-full items-start pt-2">
                  {isRight ? (
                    <>
                      <div className="w-1/2" />
                      <div className="w-1/2 relative flex justify-start pl-8 md:pl-14">
                        <div className="absolute top-3.5 left-0 w-8 md:w-14 h-[1.5px] bg-text-primary" />
                        <div className="flex flex-col items-center text-center">
                          <Icon className="text-text-primary mb-2" />
                          <h3 className="font-cormorant text-md italic md:text-lg leading-tight text-text-primary">
                            {event.label}
                          </h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 relative flex justify-end pr-8 md:pr-14">
                        <div className="absolute top-3.5 right-0 w-8 md:w-14 h-[1.5px] bg-text-primary" />
                        <div className="flex flex-col items-center text-center">
                          <Icon className="text-text-primary mb-2" />
                          <h3 className="font-cormorant text-md italic md:text-lg leading-tight text-text-primary">
                            {event.label}
                          </h3>
                        </div>
                      </div>
                      <div className="w-1/2" />
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
