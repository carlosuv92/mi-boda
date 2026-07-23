'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/guests');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch {
      setError('Error al conectar con el servidor');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-cormorant text-3xl font-semibold text-text-primary">
            Panel Administrativo
          </h1>
          <p className="text-text-secondary mt-2 font-cormorant text-xl">
            Ingresa tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary font-cormorant text-xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary font-cormorant text-xl"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 font-cormorant text-xl"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
