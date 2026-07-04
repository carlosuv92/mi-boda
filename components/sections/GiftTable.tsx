'use client';

import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface GiftTableProps {
  mensaje: string;
  cuentaBancaria?: string;
  cci?: string;
  telefono?: string;
  qrUrl?: string;
}

export function GiftTable({
  mensaje,
  cuentaBancaria,
  cci,
  telefono,
  qrUrl,
}: GiftTableProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ label, value, type }: { label: string; value: string; type: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex items-center justify-between gap-4 py-4 border-b border-cream-dark last:border-b-0"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-cormorant mb-1">{label}</p>
        <p className="text-text-primary font-cormorant text-lg tracking-wide">{value}</p>
      </div>
      <button
        onClick={() => copyToClipboard(value, type)}
        className="flex-shrink-0 p-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity hover:bg-charcoal/5"
      >
        <Copy className="w-4 h-4 text-text-secondary" />
      </button>
      {copied === type && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-charcoal text-white text-xs rounded-full font-cormorant">
          ¡Copiado!
        </span>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-principal/50" />
          <div className="w-2 h-2 bg-principal rounded-full" />
          <div className="h-px w-12 bg-principal/50" />
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-4">
          Mesa de Regalos
        </h2>
        <p className="text-text-secondary leading-relaxed mx-auto font-cormorant text-lg italic">
          Comenzamos juntos una nueva etapa, construyendo nuestro futuro con
          mucha ilusión.
        </p>
        <p className="text-text-secondary leading-relaxed mx-auto font-cormorant text-lg italic">
          Nuestro mejor regalo es disfrutar de este día con todos ustedes, pero si quieres tener un detalle con nosotros, te compartimos las siguientes opciones para hacerlo. ¡Gracias por tu cariño y apoyo!
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-12 bg-principal/50" />
          <div className="w-2 h-2 bg-principal rounded-full" />
          <div className="h-px w-12 bg-principal/50" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-cream-dark">
        {(cuentaBancaria || cci) && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] font-cormorant text-center mb-4">
              Transferencia Bancaria
            </p>
            {cuentaBancaria && (
              <CopyButton
                label="Compartamos Banco — Número de cuenta"
                value={cuentaBancaria}
                type="cuenta"
              />
            )}
            {cci && <CopyButton label="CCI" value={cci} type="cci" />}
          </div>
        )}

        {telefono && (
          <div
            className={`${cuentaBancaria || cci ? "pt-4 border-t border-cream-dark" : ""}`}
          >
            <p className="text-xs uppercase tracking-[0.3em] font-cormorant text-center mb-4">
              También por Yape o Plin
            </p>
            <CopyButton
              label="Compartamos Banco"
              value={telefono}
              type="telefono"
            />
          </div>
        )}

        {qrUrl && (
          <div className="pt-6 border-t border-cream-dark mt-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] font-cormorant text-center mb-5">
              Escanea el QR
            </p>
            <div className="w-44 h-44 mx-auto bg-white rounded-2xl p-3 shadow-sm border border-cream-dark">
              <img
                src={qrUrl}
                alt="QR de regalo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-cream-dark">
          <p className="text-xs uppercase tracking-[0.3em] font-cormorant text-center mb-4">
            Lista de Regalos
          </p>
          <div className="flex items-center justify-center gap-3 opacity-50">
            <div className="h-px w-8 bg-text-light" />
            <span className="font-cormorant italic text-lg">Próximamente</span>
            <div className="h-px w-8 bg-text-light" />
          </div>
        </div>
      </div>
    </div>
  )
}
