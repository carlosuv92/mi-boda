'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, Calendar, Music, Settings, Image as ImageIcon, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/admin/guests', label: 'Invitados', icon: Users },
  { href: '/admin/rsvp', label: 'Confirmaciones', icon: Calendar },
  { href: '/admin/songs', label: 'Canciones', icon: Music },
  { href: '/admin/gallery', label: 'Galería', icon: ImageIcon },
  { href: '/admin/config', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const cookies = document.cookie;
    const isLoginPage = pathname === '/admin/login';
    
    if (!cookies.includes('admin_auth=true') && !isLoginPage) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  const isLoginPage = pathname === '/admin/login';

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0';
    router.push('/admin/login');
  };

  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-principal font-cormorant text-xl">
          Verificando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-cream-dark px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-secondary"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-cormorant text-lg text-text-primary">Admin</span>
        <button onClick={handleLogout} className="p-2 text-text-secondary">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-b border-cream-dark px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-cormorant text-lg ${
                    pathname === item.href
                      ? 'bg-charcoal text-white'
                      : 'text-text-secondary hover:bg-cream'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-cream w-full font-cormorant text-lg"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-cream-dark min-h-screen sticky top-0">
          <div className="p-6 border-b border-cream-dark">
            <h1 className="font-cormorant text-xl text-text-primary">
              Panel Admin
            </h1>
            <p className="text-sm text-text-secondary mt-1 font-cormorant">
              Gestión de boda
            </p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-cormorant text-lg ${
                      pathname === item.href
                        ? 'bg-charcoal text-white'
                        : 'text-text-secondary hover:bg-cream'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-cream-dark">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-cream w-full transition-colors font-cormorant text-lg"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
