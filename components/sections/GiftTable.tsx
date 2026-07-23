'use client'

import { useState } from 'react'
import { Landmark, Hash, Smartphone, Gift, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import MesaRegalos from '@/components/icons/MesaRegalos'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface GiftTableProps {
  cuentaBancaria?: string
  cci?: string
  telefono?: string
  qrUrl?: string
}

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  value: string
  label: string
  copied: boolean
  onCopy: () => void
}

function InfoCard({ icon, title, subtitle, value, label, copied, onCopy }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-principal-soft/40 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-md font-semibold text-text-primary font-cormorant leading-tight">
            {title}
          </p>
          {subtitle && (
            <p className="text-[14px] font-cormorant mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm font-semibold tracking-wide font-noto-sans ml-13 mb-3">
        {value}
      </p>
      <button
        onClick={onCopy}
        className={`w-full py-2 rounded-xl text-ms font-medium font-cormorant tracking-wide transition-all flex items-center justify-center gap-1.5 ${
          copied
            ? 'bg-charcoal-light text-white font-semibold'
          : 'bg-charcoal hover:bg-charcoal-light transition-colors text-detalle font-semibold'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            ¡Copiado!
          </>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </motion.div>
  )
}

export function GiftTable({
  cuentaBancaria,
  cci,
  telefono,
  qrUrl,
}: GiftTableProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''))
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-xl mx-auto">
      <SectionHeader
        title="Mesa de Regalos"
        icon={<MesaRegalos className="w-30 text-principal mx-auto mb-4" />}
        text="Comenzamos una etapa nueva con mucha ilusión. Si quieres acompañarnos con un detalle, aquí están las opciones."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {cuentaBancaria && (
          <InfoCard
            icon={<Landmark className="w-5 h-5 text-principal" />}
            title="Transferencia Bancaria"
            subtitle="Compartamos Banco"
            value={cuentaBancaria}
            label="Copiar número"
            copied={copied === 'cuenta'}
            onCopy={() => copyToClipboard(cuentaBancaria, 'cuenta')}
          />
        )}

        {cci && (
          <InfoCard
            icon={<Hash className="w-5 h-5 text-principal" />}
            title="Cuenta CCI"
            subtitle="Interbancario"
            value={cci}
            label="Copiar CCI"
            copied={copied === 'cci'}
            onCopy={() => copyToClipboard(cci, 'cci')}
          />
        )}

        {telefono && (
          <InfoCard
            icon={<Smartphone className="w-5 h-5 text-principal" />}
            title="Yape / Plin"
            subtitle="Seleccionar Compartamos Banco"
            value={telefono}
            label="Copiar número"
            copied={copied === 'telefono'}
            onCopy={() => copyToClipboard(telefono, 'telefono')}
          />
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark opacity-60">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-principal-soft/40 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-principal" />
            </div>
            <div>
              <p className="text-md font-semibold font-cormorant leading-tight">
                Lista de Regalos
              </p>
              <p className="text-[13px] font-cormorant mt-0.5">
                Próximamente
              </p>
            </div>
          </div>
        </div>
      </div>

      {qrUrl && (
        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-cormorant text-center mb-4">
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
    </div>
  )
}
