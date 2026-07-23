'use client'

import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  text?: string
  textInvitacion?: ReactNode
}

export function SectionHeader({ title, icon, text, textInvitacion }: SectionHeaderProps) {
  return (
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-12 bg-principal/50" />
        <div className="w-2 h-2 bg-principal rounded-full" />
        <div className="h-px w-12 bg-principal/50" />
      </div>
      <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-text-primary mb-4">
        {title}
      </h2>
      {icon}
      {text && (
        <p className="text-center text-xl md:text-xl">
          {text}
        </p>
      )}
      {textInvitacion && (
        <p className="text-text-secondary font-cormorant text-lg mt-2">
          {textInvitacion}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-12 bg-principal/50" />
        <div className="w-2 h-2 bg-principal rounded-full" />
        <div className="h-px w-12 bg-principal/50" />
      </div>
    </div>
  )
}
