import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Eye,
  HardHat,
  Ruler,
  PenTool,
  Droplets,
  Package,
  Clock,
  ThumbsUp,
  ShieldCheck,
  Handshake,
  Target } from
'lucide-react';
import { motion } from 'framer-motion';
import { useSiteData, Product } from '../context/SiteContext';
import { HeroSlider } from '../components/HeroSlider';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { ProjectSlider } from '../components/ProjectSlider';
import { ProductModal } from '../components/ProductModal';
import { Logo } from '../components/Logo';
import { OptimizedImage } from '../components/OptimizedImage';
export function Home() {
  const { settings, services, projects, testimonials, products, pageContent } = useSiteData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const { home: homeContent, cta: ctaContent } = pageContent;

  const iconMap: Record<string, ReactNode> = {
    Target: <Target size={40} className="text-brand-600" />,
    ThumbsUp: <ThumbsUp size={40} className="text-accent-500" />,
    Clock: <Clock size={40} className="text-brand-600" />,
    CheckCircle2: <CheckCircle2 size={40} className="text-accent-500" />,
    Award: <Award size={28} />,
    ShieldCheck: <ShieldCheck size={28} />,
    Eye: <Eye size={28} />,
    Handshake: <Handshake size={28} />,
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool size={32} />;
      case 'FileText':
        return <Ruler size={32} />;
      case 'Droplets':
        return <Droplets size={32} />;
      case 'Package':
        return <Package size={32} />;
      case 'CheckCircle2':
        return <CheckCircle2 size={32} />;
      default:
        return <HardHat size={32} />;
    }
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section with Slider */}
      <HeroSlider slides={settings.heroSlides.home}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/services"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg">
            
            Découvrir nos services
          </Link>
          <Link
            to="/contact"
            className="inline-flex justify-center items-center px-6 py-3 border-2 border-transparent text-base font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg">
            
            Demander un devis
          </Link>
        </div>
      </HeroSlider>

      {/* Qui sommes-nous */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src={homeContent.about.image || 'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal'}
                  alt="CTBA - Construction"
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                  wrapperClassName="w-full h-[300px] sm:h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg">
                    <Logo showText={false} className="h-10 w-auto" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        CTBA
                      </p>
                      <p className="text-xs text-slate-500">Forage • BTP • Commerce Général</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <p className="text-brand-600 font-bold uppercase tracking-widest text-sm mb-3">
                {homeContent.about.subtitle}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                {homeContent.about.title}
              </h2>
              <div className="w-20 h-1 bg-brand-600 rounded-full mb-8"></div>

              <div className="space-y-5 text-slate-600 leading-relaxed">
                {homeContent.about.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-slate-200">
                {homeContent.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-brand-600">{stat.value}</div>
                    <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
                >
                  Nous contacter <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border-2 border-brand-600 text-brand-600 px-6 py-3 rounded-lg font-bold hover:bg-brand-50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                >
                  Découvrir nos services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-center mb-16">
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nos Domaines d'Intervention
            </h2>
            <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              De la conception à la réalisation, nous vous accompagnons à
              chaque étape de votre projet avec professionnalisme.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) =>
            <motion.div
              key={service.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1
              }}
              className="relative bg-gradient-to-br from-brand-50/40 via-white to-white rounded-xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              
                {/* Icône en arrière-plan décoratif */}
                <div className="absolute -top-4 -right-4 text-brand-600/10 pointer-events-none select-none scale-[3] origin-top-right hidden sm:block group-hover:scale-[3.3] group-hover:text-brand-600/15 transition-all duration-500">
                  {getIcon(service.iconName)}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  <Link
                  to="/services"
                  className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700">
                  
                    En savoir plus <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
              
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Produits en vedette
            </h2>
            <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez une sélection de nos meilleurs matériaux disponibles
              dans notre boutique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) =>
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer flex flex-col"
              onClick={() => openProductModal(product)}>
              
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  wrapperClassName="w-full h-full" />
                
                  {!product.inStock &&
                <div className="absolute top-2 right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">
                      Rupture
                    </div>
                }
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-xl font-bold text-brand-600 mb-4">
                    {product.price}
                  </div>

                  <div className="mt-auto pt-4 flex gap-2">
                    <span
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    
                      <Eye size={18} />
                      Détails
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/boutique"
              className="inline-flex justify-center items-center px-8 py-4 border-2 border-slate-900 text-lg font-bold rounded-md text-slate-900 hover:bg-slate-900 hover:text-white hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
              
              Découvrir plus de produits
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              className="lg:w-1/2">
              
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Pourquoi nous choisir ?
              </h2>
              <div className="w-24 h-1 bg-brand-600 rounded-full mb-8"></div>
              <p className="text-lg text-slate-600 mb-10">
                Chez CTBA, nous nous engageons à fournir l'excellence.
                Notre réputation s'est construite sur la satisfaction de nos
                clients et la qualité de nos réalisations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {homeContent.reasons.map((reason, index) =>
                <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">{iconMap[reason.icon] || <Target size={40} className="text-brand-600" />}</div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {reason.title}
                      </h4>
                      <p className="text-slate-600">{reason.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              className="lg:w-auto shrink-0">
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl w-[500px] max-w-full h-[500px]">
                <OptimizedImage
                  src="https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne"
                  alt="Génie civil"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full" />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-8">
                  <div className="bg-white/90 backdrop-blur p-6 rounded-xl inline-block">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {homeContent.stats[0]?.value || '+8'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {homeContent.stats[0]?.label || "Années d'expérience"}
                        </div>
                        {homeContent.stats.length > 1 && (
                          <div className="text-sm text-slate-600">
                            {homeContent.stats[1]?.label || ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nos Valeurs
            </h2>
            <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {homeContent.values.map((value, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">

                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${
              idx % 2 === 0 ? 'bg-brand-100 text-brand-600' : 'bg-accent-100 text-accent-500'}`
              }>
                  {iconMap[value.icon] || <Award size={28} />}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Nos Réalisations Preview - Slider */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Réalisations</h2>
            <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full"></div>
          </div>

          <ProjectSlider projects={projects} />
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ce que disent nos clients
            </h2>
            <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez les avis de nos clients sur nos prestations.
            </p>
          </div>

          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {ctaContent.title}
          </h2>
          <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
            {ctaContent.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
              className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-brand-600 bg-white hover:bg-slate-50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-lg">
              
              Appeler le {settings.contact.phone1}
            </a>
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-md text-white hover:bg-brand-800 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
              
              Nous écrire
            </Link>
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} />
      
    </div>);

}
