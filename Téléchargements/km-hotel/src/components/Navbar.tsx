import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Globe, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactModal } from '../context/ContactModalContext';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSejourMenuOpen, setIsSejourMenuOpen] = useState(false);
  const [isRestoMenuOpen, setIsRestoMenuOpen] = useState(false);
  const sejourTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openModal } = useContactModal();

  const DROPDOWN_DELAY = 150;

  const openSejour = () => {
    if (sejourTimeoutRef.current) clearTimeout(sejourTimeoutRef.current);
    setIsSejourMenuOpen(true);
  };

  const closeSejourDelayed = () => {
    sejourTimeoutRef.current = setTimeout(() => {
      setIsSejourMenuOpen(false);
    }, DROPDOWN_DELAY);
  };

  const openResto = () => {
    if (restoTimeoutRef.current) clearTimeout(restoTimeoutRef.current);
    setIsRestoMenuOpen(true);
  };

  const closeRestoDelayed = () => {
    restoTimeoutRef.current = setTimeout(() => {
      setIsRestoMenuOpen(false);
    }, DROPDOWN_DELAY);
  };
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.bienEtre'), href: '/bien-etre' },
    { name: t('nav.services'), href: isHomePage ? '#services' : '/#services' },
    { name: t('nav.evenements'), href: '/evenements' }
  ];

  const sejourSubLinks = [
    { name: t('nav.roomsSub'), href: '/chambres' },
    { name: t('nav.suitesSub'), href: '/suites' }
  ];

  const restoSubLinks = [
    { name: t('nav.restaurantSub'), href: '/restaurant' },
    { name: t('nav.barSub'), href: '/bar' }
  ];

  const currentLang = i18n.language?.startsWith('fr') ? 'FR' : 'EN';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`font-serif text-2xl font-bold tracking-wider ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}
            >
              KM HOTEL
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Séjour Dropdown */}
            <div
              className="relative"
              onMouseEnter={openSejour}
              onMouseLeave={closeSejourDelayed}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wider hover:text-brand-500 transition-colors ${
                  isScrolled ? 'text-slate-600' : 'text-white/90'
                }`}
              >
                {t('nav.rooms')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isSejourMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>
              {isSejourMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="w-44 bg-white shadow-lg border border-slate-100 rounded-sm overflow-hidden">
                    {sejourSubLinks.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        onClick={() => { setIsSejourMenuOpen(false); if (sejourTimeoutRef.current) clearTimeout(sejourTimeoutRef.current); }}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) =>
              link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium uppercase tracking-wider hover:text-brand-500 transition-colors ${
                    isScrolled ? 'text-slate-600' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium uppercase tracking-wider hover:text-brand-500 transition-colors ${
                    isScrolled ? 'text-slate-600' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </a>
              )
            )}

            {/* Restaurant & Bar Dropdown */}
            <div
              className="relative"
              onMouseEnter={openResto}
              onMouseLeave={closeRestoDelayed}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wider hover:text-brand-500 transition-colors ${
                  isScrolled ? 'text-slate-600' : 'text-white/90'
                }`}
              >
                {t('nav.restaurantBar')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isRestoMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>
              {isRestoMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="w-44 bg-white shadow-lg border border-slate-100 rounded-sm overflow-hidden">
                    {restoSubLinks.map((sub) => (
                      <a
                        key={sub.name}
                        href={sub.href}
                        onClick={() => { setIsRestoMenuOpen(false); if (restoTimeoutRef.current) clearTimeout(restoTimeoutRef.current); }}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium uppercase tracking-wider border transition-all ${
                  isScrolled
                    ? 'text-slate-600 border-slate-300 hover:border-brand-500 hover:text-brand-600'
                    : 'text-white/90 border-white/30 hover:border-white/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLang}
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white shadow-lg border border-slate-100 rounded-sm overflow-hidden">
                  <button
                    onClick={() => changeLanguage('fr')}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 ${
                      currentLang === 'FR'
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-700'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 ${
                      currentLang === 'EN'
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-700'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={openModal}
              className={`flex items-center px-5 py-2.5 rounded-none border transition-all ${
                isScrolled
                  ? 'border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-slate-900'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t('nav.book')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider border ${
                isScrolled
                  ? 'text-slate-600 border-slate-300'
                  : 'text-white/90 border-white/30'
              }`}
            >
              <Globe className="w-3 h-3" />
              {currentLang}
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  className="absolute top-full right-16 mt-1 w-28 bg-white shadow-lg border border-slate-100 rounded-sm overflow-hidden z-50"
                >
                  <button
                    onClick={() => changeLanguage('fr')}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 ${
                      currentLang === 'FR'
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-700'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 ${
                      currentLang === 'EN'
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-700'
                    }`}
                  >
                    English
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg border-t border-slate-100"
          >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {/* Séjour section in mobile */}
            <div className="px-3 py-2">
              <span className={`text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1`}>
                {t('nav.rooms')}
              </span>
              <div className="space-y-0.5 ml-2">
                {sejourSubLinks.map((sub) => (
                  <Link
                    key={sub.name}
                    to={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-800 hover:text-brand-600 hover:bg-slate-50 rounded-sm"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.map((link) =>
              link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-800 hover:text-brand-600 hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-800 hover:text-brand-600 hover:bg-slate-50"
                >
                  {link.name}
                </a>
              )
            )}

            {/* Restaurant & Bar section in mobile */}
            <div className="px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('nav.restaurantBar')}
              </span>
              <div className="space-y-0.5 ml-2">
                {restoSubLinks.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-800 hover:text-brand-600 hover:bg-slate-50 rounded-sm"
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setIsMobileMenuOpen(false); openModal(); }}
              className="mt-4 flex items-center justify-center w-full px-5 py-3 border border-brand-600 text-brand-600 font-medium hover:bg-brand-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              {t('nav.bookPhone')}
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}
