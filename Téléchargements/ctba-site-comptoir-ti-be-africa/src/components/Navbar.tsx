import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useSiteData } from '../context/SiteContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { settings, services } = useSiteData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le dropdown au changement de route
  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Boutique', path: '/boutique' },
    { name: 'Nos Réalisations', path: '/realisations' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = location.pathname.startsWith('/services');

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo showText={false} />
            </Link>
          </div>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex md:space-x-3 lg:space-x-6 xl:space-x-8 items-center">
            {/* Accueil */}
            <Link
              to="/"
              className={`relative group inline-flex items-center px-1 pt-1 pb-1 text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/')
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              Accueil
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                  isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>

            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative group">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
                className={`relative inline-flex items-center gap-1 px-1 pt-1 pb-1 text-xs lg:text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  isServiceActive
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                Nos Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                    isServiceActive || isServicesOpen ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              <div
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
                  isServicesOpen
                    ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                    : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 py-2 min-w-[220px] overflow-hidden">
                  {/* Lien vers la page d'aperçu */}
                  <Link
                    to="/services"
                    className={`block px-4 py-2.5 text-xs lg:text-sm font-medium transition-colors ${
                      location.pathname === '/services'
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-brand-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-bold text-brand-600">T</span>
                      </div>
                      <span>Tous nos services</span>
                    </div>
                  </Link>

                  <div className="border-t border-slate-100 my-1 mx-3" />

                  {services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className={`block px-4 py-2.5 text-xs lg:text-sm font-medium transition-colors ${
                        location.pathname === `/services/${s.id}`
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-slate-500">
                            {s.title.charAt(0)}
                          </span>
                        </div>
                        <span>{s.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Autres liens */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative group inline-flex items-center px-1 pt-1 pb-1 text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Contact CTA */}
          <div className="hidden md:flex items-center">
            <a
              href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 lg:gap-2 bg-accent-500 text-white md:px-2.5 md:py-1.5 lg:px-4 lg:py-2 rounded-md md:text-xs lg:text-sm font-medium hover:bg-accent-600 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-sm"
            >
              <Phone size={16} className="lg:size-[18px]" />
              <span className="hidden lg:inline">Nous consulter</span>
              <span className="lg:hidden">Appel</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        aria-hidden={!isOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-screen opacity-100 translate-y-0 visible pointer-events-auto'
            : 'max-h-0 opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
      >
        <div className="bg-white border-t border-slate-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`relative group block pl-3 pr-4 py-3 text-base font-medium transition-colors ${
                isActive('/')
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              Accueil
              <span
                className={`absolute bottom-0 left-3 right-4 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                  isActive('/') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* Services mobile - expandable */}
            <div>
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className={`relative group w-full flex items-center justify-between pl-3 pr-4 py-3 text-base font-medium transition-colors ${
                  isServiceActive
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                <span>Nos Services</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isMobileServicesOpen ? 'rotate-180' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-3 right-4 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                    isServiceActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isMobileServicesOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="bg-slate-50 py-1">
                  <Link
                    to="/services"
                    onClick={() => setIsOpen(false)}
                    className={`block pl-8 pr-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/services'
                        ? 'text-brand-600'
                        : 'text-slate-600 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                      Tous nos services
                    </div>
                  </Link>
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block pl-8 pr-4 py-2 text-sm font-medium transition-colors ${
                        location.pathname === `/services/${s.id}`
                          ? 'text-brand-600'
                          : 'text-slate-600 hover:text-brand-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        {s.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`relative group block pl-3 pr-4 py-3 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-3 right-4 h-0.5 bg-brand-600 transition-all duration-300 rounded-full ${
                    isActive(link.path) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            <div className="pl-3 pr-4 py-4">
              <a
                href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 w-full bg-accent-500 text-white px-4 py-3 rounded-md font-medium hover:bg-accent-600 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <Phone size={18} />
                <span>Nous consulter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
