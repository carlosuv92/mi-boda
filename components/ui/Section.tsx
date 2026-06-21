'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { PatternBackground } from './PatternBackground';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function Section({ children, className = '', id, delay = 0 }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={`py-16 px-6 md:py-24 md:px-8 relative ${className}`}
    >
      <PatternBackground>
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </PatternBackground>
    </motion.section>
  );
}
