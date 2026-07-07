import { useParams, Link } from 'react-router-dom';
import {
  PenTool,
  Droplets,
  HardHat,
  FileText,
  Wind,
  Activity,
  Package,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteContext';
import { OptimizedImage } from '../components/OptimizedImage';

function getIcon(iconName: string, size = 40, className = 'text-brand-600') {
  switch (iconName) {
    case 'PenTool':
      return <PenTool size={size} className={className} />;
    case 'FileText':
      return <FileText size={size} className={className} />;
    case 'Droplets':
      return <Droplets size={size} className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 size={size} className={className} />;
    case 'Wind':
      return <Wind size={size} className={className} />;
    case 'Activity':
      return <Activity size={size} className={className} />;
    case 'Package':
      return <Package size={size} className={className} />;
    default:
      return <HardHat size={size} className={className} />;
  }
}

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { settings, services, projects } = useSiteData();

  const service = services.find((s) => s.id === id);
  const relatedProjects = projects.filter((p) => p.serviceId === id).slice(0, 6);

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <HardHat size={64} className="text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Service introuvable</h1>
          <p className="text-slate-500 mb-6">Le service que vous recherchez n'existe pas.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  const phoneClean = settings.contact.phone1.replace(/\s/g, '');

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-brand-100 hover:text-white mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Retour aux services
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {getIcon(service.iconName, 36, 'text-white')}
            </div>
            <div>
              <p className="text-brand-200 text-sm font-medium uppercase tracking-wider">Service</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{service.title}</h1>
            </div>
          </div>
          <p className="text-brand-100 text-lg max-w-3xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main - Prestations */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-brand-600" />
                </div>
                Prestations incluses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-brand-600" />
                    </div>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Pourquoi nous choisir ?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Expertise locale', desc: 'Une connaissance approfondie du terrain et des spécificités de la RCA.' },
                  { title: 'Équipe qualifiée', desc: 'Des ingénieurs et techniciens formés aux normes modernes.' },
                  { title: 'Matériaux de qualité', desc: 'Des fournitures certifiées pour des ouvrages durables.' },
                  { title: 'Accompagnement', desc: 'Un suivi personnalisé de l\'étude à la livraison.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Réalisations liées */}
            {relatedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-brand-600" />
                  </div>
                  Nos réalisations en {service.title.toLowerCase()}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedProjects.map((project) => (
                    <Link
                      to="/realisations"
                      className="group relative rounded-xl overflow-hidden aspect-[16/10] hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1 transition-all duration-300"
                    >
                      <OptimizedImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        wrapperClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
                          {project.category}
                        </div>
                        <h3 className="text-white font-bold text-sm line-clamp-1">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {project.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            RCA
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/realisations"
                    className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 text-sm transition-colors"
                  >
                    Voir toutes nos réalisations <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24"
            >
              <h3 className="font-bold text-slate-900 mb-4">Besoin d'un devis ?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.
              </p>

              <div className="space-y-3">
                <a
                  href={`tel:${phoneClean}`}
                  className="flex items-center gap-3 w-full p-3 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-lg flex items-center justify-center group-hover:bg-brand-700 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Téléphone</p>
                    <p className="text-sm font-semibold text-slate-800">{settings.contact.phone1}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.contact.email}`}
                  className="flex items-center gap-3 w-full p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-600 text-white rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-semibold text-slate-800">{settings.contact.email}</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  to="/contact"
                  className="block w-full text-center bg-brand-600 text-white py-3 rounded-xl font-medium hover:bg-brand-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                >
                  Nous contacter
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
