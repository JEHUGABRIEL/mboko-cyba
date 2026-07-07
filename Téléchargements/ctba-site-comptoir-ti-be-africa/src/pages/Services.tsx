import { Link } from 'react-router-dom';
import {
  PenTool,
  Droplets,
  HardHat,
  FileText,
  Wind,
  Activity,
  Package,
  CheckCircle2,
  ArrowRight } from
'lucide-react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteContext';
import { HeroSlider } from '../components/HeroSlider';
export function Services() {
  const { settings, services, pageContent } = useSiteData();
  const { services: servicesContent, cta: ctaContent } = pageContent;
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool size={40} className="text-brand-600" />;
      case 'FileText':
        return <FileText size={40} className="text-brand-600" />;
      case 'Droplets':
        return <Droplets size={40} className="text-brand-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={40} className="text-brand-600" />;
      case 'Wind':
        return <Wind size={40} className="text-brand-600" />;
      case 'Activity':
        return <Activity size={40} className="text-brand-600" />;
      case 'Package':
        return <Package size={40} className="text-brand-600" />;
      default:
        return <HardHat size={40} className="text-brand-600" />;
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <HeroSlider
        slides={settings.heroSlides.services}
        bgImage="https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal" />
      

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            className="relative bg-gradient-to-br from-brand-50/40 via-white to-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            
              {/* Grande icône en watermark centrée en arrière-plan */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <div className="text-brand-600/[0.03] scale-[4] sm:scale-[5] md:scale-[6] group-hover:scale-[6.5] group-hover:text-brand-600/[0.05] transition-all duration-700 ease-out">
                  {getIcon(service.iconName)}
                </div>
              </div>

              <div className="relative z-10 p-8 flex-grow">
                <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                  {getIcon(service.iconName)}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-6">{service.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">
                    Inclus :
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) =>
                  <li
                    key={idx}
                    className="flex items-center text-slate-600 text-sm">
                    
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                  )}
                  </ul>
                </div>
              </div>
              <div className="relative z-10 bg-slate-50 px-8 py-4 border-t border-slate-100 mt-auto">
                <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full text-brand-600 font-medium hover:text-brand-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
                
                  Demander un devis <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Notre Méthodologie
            </h2>
            <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>

            {servicesContent.methodology.map((item, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: idx * 0.1
              }}
              className="bg-white text-center relative z-10 p-4">
              
                <div className="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

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
    </div>);

}
