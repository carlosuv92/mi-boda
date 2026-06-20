'use client';

import { motion } from 'framer-motion';

interface FloralDividerProps {
  className?: string;
}

export function FloralDivider({ className = '' }: FloralDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-principal/40" />
      <div className="w-2 h-2 bg-principal/60 rounded-full" />
      <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-principal/40" />
    </motion.div>
  );
}
