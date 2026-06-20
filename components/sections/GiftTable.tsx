'use client';

import { motion } from 'framer-motion';
import { Copy, CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface GiftTableProps {
  mensaje: string;
  cuentaBancaria?: string;
  yape?: string;
  plin?: string;
  qrUrl?: string;
}

export function GiftTable({
  mensaje,
  cuentaBancaria,
  yape,
  plin,
  qrUrl,
}: GiftTableProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-4">
          Mesa de Regalos
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-md mx-auto font-cormorant text-lg">
          {mensaje}
        </p>
      </div>

      <div className="space-y-6">
        {cuentaBancaria && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-cream-dark"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-principal" />
              <h3 className="font-playfair text-lg font-semibold text-text-primary">
                Transferencia Bancaria
              </h3>
            </div>
            <div className="bg-cream rounded-lg p-4 flex items-center justify-between gap-4">
              <code className="text-text-primary font-mono text-sm break-all">
                {cuentaBancaria}
              </code>
              <button
                onClick={() => copyToClipboard(cuentaBancaria, 'cuenta')}
                className="flex-shrink-0 p-2 hover:bg-cream-dark rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            {copied === 'cuenta' && (
              <p className="text-xs text-principal mt-2">¡Copiado!</p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {yape && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
            >
              <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-text-primary mb-2 font-cormorant text-lg">Yape</h4>
              <div className="bg-cream rounded-lg p-3 flex items-center justify-between gap-2">
                <span className="text-sm text-text-secondary font-cormorant">{yape}</span>
                <button
                  onClick={() => copyToClipboard(yape, 'yape')}
                  className="p-1 hover:bg-cream-dark rounded transition-colors"
                >
                  <Copy className="w-3 h-3 text-text-secondary" />
                </button>
              </div>
              {copied === 'yape' && (
                <p className="text-xs text-principal mt-2">¡Copiado!</p>
              )}
            </motion.div>
          )}

          {plin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
            >
              <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-text-primary mb-2 font-cormorant text-lg">Plin</h4>
              <div className="bg-cream rounded-lg p-3 flex items-center justify-between gap-2">
                <span className="text-sm text-text-secondary font-cormorant">{plin}</span>
                <button
                  onClick={() => copyToClipboard(plin, 'plin')}
                  className="p-1 hover:bg-cream-dark rounded transition-colors"
                >
                  <Copy className="w-3 h-3 text-text-secondary" />
                </button>
              </div>
              {copied === 'plin' && (
                <p className="text-xs text-principal mt-2">¡Copiado!</p>
              )}
            </motion.div>
          )}
        </div>

        {qrUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 text-center border border-cream-dark"
          >
            <h3 className="font-playfair text-lg font-semibold text-text-primary mb-4">
              Escanea el QR
            </h3>
            <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 shadow-sm border border-cream-dark">
              <img src={qrUrl} alt="QR de regalo" className="w-full h-full object-contain" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
