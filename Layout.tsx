import { type ReactNode } from 'react';
import { Home, Search, Bookmark, Bell, User, LogIn, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'search', label: 'Buscar ayudas', icon: Search },
  ];

  if (user) {
    navItems.push({ id: 'saved', label: 'Mis ayudas', icon: Bookmark });
    navItems.push({ id: 'alerts', label: 'Mis alertas', icon: Bell });
    navItems.push({ id: 'profile', label: 'Perfil', icon: User });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Administración', icon: Shield });
  }

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 flex-shrink-0"
              aria-label="Accesibilidad Ayudas España — Inicio"
            >
              <div className="w-40 sm:w-52 h-12 overflow-hidden flex items-center">
                <img
                  src="/image.png"
                  alt="Hábitat Asistencial — AssureCareWare"
                  className="w-full h-auto scale-[1.28]"
                />
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Auth buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {profile?.full_name || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Iniciar sesión
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-slide-down"
            aria-label="Navegación móvil"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-slate-600">
                    {profile?.full_name || user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('login')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50"
                >
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  Iniciar sesión
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-56 h-16 overflow-hidden flex items-center mb-3">
                <img
                  src="/image.png"
                  alt="Hábitat Asistencial — AssureCareWare"
                  className="w-full h-auto scale-[1.18]"
                />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Plataforma para encontrar ayudas y subvenciones relacionadas con la
                accesibilidad en viviendas, edificios, municipios y proyectos.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Información</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Las ayudas marcadas como [DEMO] son ejemplos demostrativos.</li>
                <li>Consulte siempre las fuentes oficiales antes de solicitar.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Aviso</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Esta plataforma no gestiona ayudas directamente. Su finalidad es facilitar
                la búsqueda de convocatorias oficiales publicadas por las administraciones
                públicas competentes.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Accesibilidad Ayudas España. Plataforma de búsqueda de ayudas.
          </div>
        </div>
      </footer>
    </div>
  );
}
