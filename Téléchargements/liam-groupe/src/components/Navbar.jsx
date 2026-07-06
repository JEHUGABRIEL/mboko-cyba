import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavLinks, useDomains, useSiteInfo } from "../hooks/useSiteData";
import { prefetchRoute } from "../lib/routePrefetch";

/**
 * Navbar — reproduit le comportement observé sur les captures :
 * - Sur les pages avec un hero plein écran, la nav démarre transparente
 *   (texte blanc, bouton CTA corail) puis devient blanche (texte sombre,
 *   bouton CTA violet) dès que la page est scrollée.
 */
export default function Navbar({ transparentOnTop = true }) {
  const [scrolled, setScrolled] = useState(() =>
    transparentOnTop ? typeof window !== "undefined" && window.scrollY > 40 : true
  );
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const closeTimer = useRef(null);
  const langTimer = useRef(null);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "EN" : "FR";
  const { data: navLinks = [] } = useNavLinks();
  const { data: domains = [] } = useDomains();
  const { data: siteInfo = {} } = useSiteInfo();

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (mobileOpen) setMobileOpen(false);
    if (domainsOpen) setDomainsOpen(false);
  }

  const isTransparent = !scrolled;

  const openDomains = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDomainsOpen(true);
  };
  const scheduleCloseDomains = () => {
    closeTimer.current = setTimeout(() => setDomainsOpen(false), 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[88px] flex items-center justify-between">
        <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight">
          <span className="text-ink">{siteInfo.name}</span>
          <span className="text-brand-500">.</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={openDomains}
                onMouseLeave={scheduleCloseDomains}
              >
                <button className="flex items-center gap-1 font-medium text-gray-700 hover:text-ink transition-colors">
                  {link.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${domainsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {domainsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 overflow-hidden">
                    {domains.map((d) => (
                      <Link
                        key={d.slug}
                        to={`/domaines/${d.slug}`}
                        onMouseEnter={() => prefetchRoute(`/domaines/${d.slug}`)}
                        className="block px-5 py-2.5 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                onMouseEnter={() => prefetchRoute(link.to)}
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-brand-600"
                      : "text-gray-700 hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>          <div className="hidden lg:flex items-center gap-5">
          <div
            className="relative"
            onMouseEnter={() => { if (langTimer.current) clearTimeout(langTimer.current); setLangOpen(true); }}
            onMouseLeave={() => { langTimer.current = setTimeout(() => setLangOpen(false), 150); }}
          >
            <button
              className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-ink transition-colors"
              onClick={() => setLangOpen((o) => !o)}
            >
              <span>{currentLang}</span>
              <Globe className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-3 w-28 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                <button
                  onClick={() => { i18n.changeLanguage("fr"); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLang === "FR" ? "text-brand-600 font-semibold bg-brand-50" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Français
                </button>
                <button
                  onClick={() => { i18n.changeLanguage("en"); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLang === "EN" ? "text-brand-600 font-semibold bg-brand-50" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className={`lg:hidden ${isTransparent ? "text-white" : "text-ink"}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 h-[calc(100vh-88px)] overflow-y-auto flex flex-col">
          <div className="flex-1 space-y-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    className="flex items-center justify-between w-full font-medium text-gray-800 py-3"
                    onClick={() => setDomainsOpen((o) => !o)}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${domainsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {domainsOpen && (
                    <div className="pl-4 flex flex-col gap-1 pb-2">
                      {domains.map((d) => (
                        <Link
                          key={d.slug}
                          to={`/domaines/${d.slug}`}
                          onMouseEnter={() => prefetchRoute(`/domaines/${d.slug}`)}
                          className="py-2.5 text-gray-600 hover:text-brand-600 transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onMouseEnter={() => prefetchRoute(link.to)}
                  className="block py-3 font-medium text-gray-800 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            {/* Language switch in mobile menu */}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{t('nav.language')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { i18n.changeLanguage("fr"); setMobileOpen(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentLang === "FR" ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  Français
                </button>
                <button
                  onClick={() => { i18n.changeLanguage("en"); setMobileOpen(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentLang === "EN" ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
