import { useEffect, useState, cloneElement } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  Network,
  Wifi,
  PhoneCall,
  ShieldCheck,
  Sun,
  Monitor,
  ChevronRight,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import { HeroSlider } from "./HeroSlider";
import { TestimonialsSection } from "./TestimonialsSection";
import { PartnersSection } from "./PartnersSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { Boutique } from "./Boutique";
import { ProductPage } from "./ProductPage";
import { AdminPage } from "./AdminPage";
import { AdminLogin } from "./AdminLogin";
import { ContactModal } from "./ContactModal";
import { Footer } from "./Footer";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useSite } from "./SiteContext";

function CantLogo({ className = "h-12" }: { className?: string }) {
  return (
    <img
      src="/image.png"
      alt="LA CANT"
      className={`${className} object-contain`}
    />
  );
}

function NavBar({ onOpenContact }: { onOpenContact: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";
  const isBoutique = location.pathname.startsWith("/boutique");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  if (isAdmin) return null;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinkClass = (isActive: boolean) =>
    `nav-link text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600 active"
        : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <nav
      className={`fixed w-full z-50 navbar-transition ${
        isScrolled
          ? "bg-white shadow-lg shadow-slate-900/5 border-b border-slate-100 py-2"
          : "bg-white border-b border-transparent py-3 md:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div
              className={`rounded-xl overflow-hidden navbar-transition ${
                isScrolled
                  ? "h-10 md:h-12 logo-shadow-scrolled"
                  : "h-11 md:h-14 logo-shadow"
              }`}
            >
              <CantLogo className="h-full w-auto" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {isHome && (
              <>
                <button
                  onClick={() => scrollToSection("accueil")}
                  className={`${navLinkClass(true)} px-3 py-2`}
                >
                  Accueil
                </button>
                <button
                  onClick={() => scrollToSection("a-propos")}
                  className={`${navLinkClass(false)} px-3 py-2`}
                >
                  À Propos
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className={`${navLinkClass(false)} px-3 py-2`}
                >
                  Nos Services
                </button>
              </>
            )}
            {!isHome && (
              <Link to="/" className={`${navLinkClass(false)} px-3 py-2`}>
                Accueil
              </Link>
            )}
            <Link
              to="/boutique"
              className={`${navLinkClass(isBoutique)} px-3 py-2`}
            >
              Boutique
            </Link>
            <div className="w-px h-6 bg-slate-200 mx-3" />

            {/* Cart icon */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-badgePulse">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {isHome && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenContact(); }}
                className="ml-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Nous Contacter
              </button>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                mobileMenuOpen
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — plein écran */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fadeIn">
          <div className="absolute inset-0 bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <CantLogo className="h-10" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links — centrés verticalement */}
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 pb-8">
              {isHome && (
                <>
                  <button
                    onClick={() => scrollToSection("accueil")}
                    className="w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-200 transition-all active:scale-[0.97]"
                  >
                    Accueil
                  </button>
                  <button
                    onClick={() => scrollToSection("a-propos")}
                    className="w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 transition-all active:scale-[0.97]"
                  >
                    À Propos
                  </button>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 transition-all active:scale-[0.97]"
                  >
                    Nos Services
                  </button>
                </>
              )}
              {!isHome && (
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-200 transition-all active:scale-[0.97]"
                >
                  Accueil
                </Link>
              )}
              <Link
                to="/boutique"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-semibold transition-all active:scale-[0.97] ${
                  isBoutique
                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-200"
                    : "text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                Boutique
              </Link>
              {/* Spacer puis CTA */}
              <div className="h-4" />
              {isHome && (
                <button
                  onClick={() => { onOpenContact(); setMobileMenuOpen(false); }}
                  className="w-full max-w-xs text-center px-6 py-4 rounded-2xl text-lg font-bold text-emerald-700 bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all active:scale-[0.97]"
                >
                  Nous Contacter
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function HomePage({ onOpenContact }: { onOpenContact: () => void }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      title: "Câblage Réseau",
      description:
        "Conception et installation d'infrastructures réseau fiables et performantes pour votre entreprise.",
      icon: <Network className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Fibre Optique",
      description:
        "Déploiement de solutions très haut débit pour une connectivité sans faille et ultra-rapide.",
      icon: <Wifi className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Téléphonie VoIP",
      description:
        "Systèmes de communication modernes et économiques adaptés à vos besoins professionnels.",
      icon: <PhoneCall className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Domotique & Sécurité",
      description:
        "Caméras de surveillance, contrôle d'accès et alarmes anti-intrusion pour protéger vos locaux.",
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Énergie Solaire",
      description:
        "Solutions d'alimentation autonomes et écologiques pour garantir la continuité de vos services.",
      icon: <Sun className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Matériel Professionnel",
      description:
        "Fourniture d'équipements informatiques et télécoms de pointe issus des meilleures marques.",
      icon: <Monitor className="w-8 h-8 text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      {/* Hero Slider */}
      <HeroSlider
        onScrollToServices={() => scrollToSection("services")}
        onScrollToContact={onOpenContact}
      />

      {/* About Section */}
      <section id="a-propos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                La Centrafricaine des Nouvelles Technologies
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 mb-8 rounded-full" />

              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  Créée en 2015, <strong>LA CANT</strong> est une entreprise
                  privée centrafricaine spécialisée dans l'étude, la mise en
                  œuvre et le support des infrastructures informatiques et de
                  télécommunication.
                </p>
                <p>
                  Notre vision est d'offrir aux entreprises privées, publiques
                  et internationales ainsi qu'au grand public l'expertise
                  pointue de nos ingénieurs dans les Nouvelles Technologies de
                  l'Information et de la Communication (NTIC).
                </p>
                <p>
                  Nous nous positionnons comme votre partenaire stratégique pour
                  concevoir des solutions sur mesure, fiables et évolutives,
                  adaptées aux réalités locales et aux standards internationaux.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-3xl font-bold text-slate-900">8+</p>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                    Années d'expérience
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-3xl font-bold text-slate-900">100%</p>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                    Expertise Locale
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-50 rounded-2xl transform rotate-3 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80"
                alt="Ingénieurs au travail"
                className="rounded-xl shadow-xl w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 hidden md:block">
                <CantLogo className="h-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos Domaines d'Expertise
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full" />
            <p className="text-lg text-slate-600">
              Des solutions complètes et intégrées pour répondre à tous vos
              besoins en infrastructures technologiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {cloneElement(service.icon, {
                    className:
                      "w-8 h-8 text-blue-600 group-hover:text-white transition-colors",
                  })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 relative overflow-hidden" id="contact">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-700 rounded-full opacity-50 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à moderniser votre infrastructure ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Nos ingénieurs sont à votre disposition pour étudier vos besoins et
            vous proposer la solution la plus adaptée.
          </p>
          <button
            onClick={onOpenContact}
            className="bg-white text-blue-600 px-8 py-4 rounded-md font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg"
          >
            Contactez notre équipe
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer variant="home" />
    </div>
  );
}

function PromoBanner({ onOpenContact }: { onOpenContact: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();
  const { settings } = useSite();
  const isAdmin = location.pathname.startsWith("/admin");

  // Réafficher le bandeau à chaque changement de page
  useEffect(() => {
    setDismissed(false);
  }, [location.pathname]);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed || !settings.promoEnabled || isAdmin) return null;

  return (
    <div className="sticky top-0 z-[60] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-sm flex-1 justify-center">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Promo
            </span>
            <span className="text-white/90">
              <span className="font-semibold">{settings.promoDiscount}</span>{" "}
              {settings.promoMessage} — Code :{" "}
              <span className="font-mono font-bold bg-white/15 px-2 py-0.5 rounded text-amber-100">
                {settings.promoCode}
              </span>
            </span>
            <button
              onClick={onOpenContact}
              className="hidden sm:inline-flex items-center gap-1 text-amber-100 hover:text-white font-medium transition-colors underline underline-offset-2"
            >
              En profiter
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all ml-2"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminPage />;
}

function AdminLoginRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminLogin />;
}

export function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <PromoBanner onOpenContact={() => setContactOpen(true)} />
      <NavBar onOpenContact={() => setContactOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage onOpenContact={() => setContactOpen(true)} />} />
        <Route path="/boutique" element={<Boutique onOpenContact={() => setContactOpen(true)} />} />
        <Route path="/boutique/:id" element={<ProductPage />} />
        <Route path="/admin/login" element={<AdminLoginRoute />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
      </Routes>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
