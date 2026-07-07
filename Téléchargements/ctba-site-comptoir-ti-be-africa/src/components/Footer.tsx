import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram } from
'lucide-react';
import { Logo } from './Logo';
import { useSiteData } from '../context/SiteContext';

export function Footer() {
  const { settings } = useSiteData();
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo className="h-16 w-auto" showText={false} />
            <p className="text-sm mt-4 text-slate-400">
              COMPTOIR TI BE AFRICA (CTBA) est votre partenaire de confiance
              en forage hydraulique, construction et BTP, et commerce
              général en République Centrafricaine. Expertise, qualité et
              engagement au service de vos projets.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="hover:text-brand-400 transition-colors">
                  
                  Nos Services
                </Link>
              </li>
              <li>
                <Link
                  to="/boutique"
                  className="hover:text-brand-400 transition-colors">
                  
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-400 transition-colors">
                  
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Nos Services
            </h3>
            <ul className="space-y-2">
              <li className="text-slate-400">Forages et Hydraulique</li>
              <li className="text-slate-400">Construction et BTP</li>
              <li className="text-slate-400">Commerce Général</li>
              <li className="text-slate-400">Fourniture de matériaux</li>
              <li className="text-slate-400">Fourniture d'équipements techniques</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contactez-nous
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-400 mt-1 flex-shrink-0" size={20} />
                <span>{settings.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-brand-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex flex-col">
                  <a
                    href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
                    className="hover:text-white transition-colors">
                    {settings.contact.phone1}
                  </a>
                  <a
                    href={`tel:${settings.contact.phone2.replace(/\s/g, '')}`}
                    className="hover:text-white transition-colors">
                    {settings.contact.phone2}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-brand-400 mt-1 flex-shrink-0" size={20} />
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="hover:text-white transition-colors">
                  {settings.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} COMPTOIR TI BE AFRICA (CTBA). Tous
            droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>);

}