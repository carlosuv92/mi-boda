'use client';

import { useState, useEffect } from 'react';
import { getConfig, updateConfig } from '@/lib/api';
import { Save, ChevronDown, ChevronUp, Users, MapPin, Shirt, Gift, Clock, MessageSquare, Settings } from 'lucide-react';

const configSections = [
  {
    id: 'general',
    title: 'General',
    icon: Settings,
    fields: [
      { key: 'novio', label: 'Nombre del Novio', type: 'text' },
      { key: 'novia', label: 'Nombre de la Novia', type: 'text' },
      { key: 'fecha', label: 'Fecha de la Boda', type: 'date' },
      { key: 'fotoPrincipal', label: 'URL Foto Principal', type: 'text' },
      { key: 'biblia', label: 'Texto Bíblico', type: 'textarea' },
      { key: 'mensajeBienvenida', label: 'Mensaje de Bienvenida', type: 'textarea' },
    ],
  },
  {
    id: 'ceremonia',
    title: 'Ceremonia',
    icon: MapPin,
    fields: [
      { key: 'nombreIglesia', label: 'Nombre de la Iglesia', type: 'text', placeholder: 'Ej: Iglesia San Pedro' },
      { key: 'fotoIglesia', label: 'URL Foto Iglesia', type: 'text' },
      { key: 'direccionIglesia', label: 'Dirección Iglesia', type: 'textarea' },
      { key: 'horaCeremonia', label: 'Hora Ceremonia', type: 'text', placeholder: 'Ej: 11:00 AM' },
      { key: 'estacionamientoIglesia', label: 'Estacionamiento Iglesia', type: 'text' },
      { key: 'mapsIglesia', label: 'Google Maps Iglesia', type: 'text', placeholder: 'https://maps.google.com/...' },
    ],
  },
  {
    id: 'recepcion',
    title: 'Recepción',
    icon: MapPin,
    fields: [
      { key: 'nombreRecepcion', label: 'Nombre del Local', type: 'text', placeholder: 'Ej: Jardín Padilla' },
      { key: 'fotoRecepcion', label: 'URL Foto Recepción', type: 'text' },
      { key: 'direccionRecepcion', label: 'Dirección Recepción', type: 'textarea' },
      { key: 'horaRecepcion', label: 'Hora Recepción', type: 'text', placeholder: 'Ej: 1:00 PM' },
      { key: 'estacionamientoRecepcion', label: 'Estacionamiento Recepción', type: 'text' },
      { key: 'mapsRecepcion', label: 'Google Maps Recepción', type: 'text', placeholder: 'https://maps.google.com/...' },
    ],
  },
  {
    id: 'vestimenta',
    title: 'Dress Code',
    icon: Shirt,
    fields: [
      { key: 'vestimentaHombres', label: 'Vestimenta Hombres', type: 'text', placeholder: 'Ej: Formal' },
      { key: 'vestimentaMujeres', label: 'Vestimenta Mujeres', type: 'text', placeholder: 'Ej: Formal' },
      { key: 'coloresSugeridos', label: 'Colores Sugeridos (separados por coma)', type: 'text', placeholder: 'Ej: Azul,Rosa,Dorado' },
      { key: 'coloresReservados', label: 'Colores Reservados (separados por coma)', type: 'text', placeholder: 'Ej: Blanco,Crema' },
      { key: 'restriccionesColores', label: 'Restricciones de Colores', type: 'textarea' },
    ],
  },
  {
    id: 'regalos',
    title: 'Mesa de Regalos',
    icon: Gift,
    fields: [
      { key: 'mensajeRegalos', label: 'Mensaje Mesa de Regalos', type: 'textarea' },
      { key: 'cuentaBancaria', label: 'Cuenta Bancaria', type: 'text' },
      { key: 'yape', label: 'Número Yape', type: 'text' },
      { key: 'plin', label: 'Número Plin', type: 'text' },
      { key: 'qrRegalo', label: 'URL QR de Regalo', type: 'text' },
    ],
  },
  {
    id: 'itinerario',
    title: 'Itinerario y RSVP',
    icon: Clock,
    fields: [
      { key: 'fechaLimiteRSVP', label: 'Fecha Límite RSVP', type: 'text', placeholder: 'Ej: 10 de mayo' },
    ],
  },
  {
    id: 'adultos',
    title: 'Mensaje Adultos',
    icon: MessageSquare,
    fields: [
      { key: 'mensajeAdultos', label: 'Mensaje Solo Adultos', type: 'textarea' },
    ],
  },
];

function ConfigSection({ section, config, onChange, fieldsPerRow = 2 }: {
  section: typeof configSections[0];
  config: Record<string, string>;
  onChange: (key: string, value: string) => void;
  fieldsPerRow?: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cream-dark rounded-lg">
            <Icon className="w-5 h-5 text-principal" />
          </div>
          <h3 className="font-playfair text-lg font-semibold text-text-primary">
            {section.title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-light" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-light" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-cream-dark">
          <div className={`grid gap-4 pt-4 ${fieldsPerRow === 1 ? '' : 'md:grid-cols-2'}`}>
            {section.fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-text-secondary mb-1.5 font-cormorant text-base">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={config[field.key] || ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 bg-cream border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 focus:border-principal text-text-primary placeholder:text-text-light resize-none text-sm font-cormorant"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={config[field.key] || ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 bg-cream border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 focus:border-principal text-text-primary placeholder:text-text-light text-sm font-cormorant"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    getConfig()
      .then((data) => {
        const formatted: Record<string, string> = {};
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'fecha' && value && !isNaN(Date.parse(value))) {
            formatted[key] = new Date(value).toISOString().split('T')[0];
          } else {
            formatted[key] = String(value);
          }
        });
        setConfig(formatted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async (sectionId: string) => {
    const section = configSections.find((s) => s.id === sectionId);
    if (!section) return;

    setSaving(true);
    setSavingSection(sectionId);
    try {
      const promises = section.fields
        .filter((f) => config[f.key] !== undefined)
        .map((field) => updateConfig(field.key, config[field.key] || ''));
      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(config).map(([key, value]) =>
        updateConfig(key, value)
      );
      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-text-primary">
            Configuración General
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Modifica el contenido de la invitación
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-xl hover:bg-charcoal-light transition-colors text-sm font-medium disabled:opacity-50 shadow-sm font-cormorant"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar todo'}
        </button>
      </div>

      <div className="space-y-4">
        {configSections.map((section) => (
          <div key={section.id}>
            <ConfigSection
              section={section}
              config={config}
              onChange={handleChange}
            />
            <div className="flex justify-end mt-2 mb-4">
              <button
                onClick={() => handleSaveSection(section.id)}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-principal hover:bg-cream-dark rounded-lg transition-colors font-cormorant"
              >
                <Save className="w-3.5 h-3.5" />
                {savingSection === section.id ? 'Guardando...' : `Guardar ${section.title}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
