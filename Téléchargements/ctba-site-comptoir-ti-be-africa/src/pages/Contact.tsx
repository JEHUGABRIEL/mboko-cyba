import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import { useSiteData } from '../context/SiteContext';
import { HeroSlider } from '../components/HeroSlider';

export function Contact() {
  const { settings, pageContent } = useSiteData();
  const { contact: contactContent } = pageContent;
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: 'Demande de devis', message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setStatus({ type: 'error', text: 'Veuillez compléter la vérification anti-bot.' });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: 'success', text: data.message });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'Demande de devis', message: '' });
        setTurnstileToken(null);
      } else {
        setStatus({ type: 'error', text: data.error || 'Erreur lors de l\'envoi.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Erreur de connexion au serveur. Veuillez réessayer.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <HeroSlider
        slides={settings.heroSlides.contact}
        bgImage="https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero" />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Coordonnées
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Téléphone</h4>
                    <p className="text-slate-600 mt-1">
                      <a
                        href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
                        className="hover:text-brand-600 block">
                        
                        {settings.contact.phone1}
                      </a>
                      <a
                        href={`tel:${settings.contact.phone2.replace(/\s/g, '')}`}
                        className="hover:text-brand-600 block">
                        
                        {settings.contact.phone2}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Adresse</h4>
                    <p className="text-slate-600 mt-1 whitespace-pre-line">
                      {settings.contact.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Email</h4>
                    <p className="text-slate-600 mt-1">
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="hover:text-brand-600">
                        
                        {settings.contact.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-600">
                    <Clock size={24} />
                  </div>
                  <div>                      <h4 className="font-semibold text-slate-900">
                      Heures d'ouverture
                    </h4>
                    <p className="text-slate-600 mt-1">
                      {contactContent.openingHours.map((oh, i) => (
                        <span key={i}>
                          {i > 0 && <><br /></>}
                          {oh.label} : {oh.hours}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="lg:col-span-2">
            
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Envoyez-nous un message
              </h3>
              <p className="text-slate-600 mb-8">
                Remplissez le formulaire ci-dessous, nous vous répondrons dans
                les plus brefs délais.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">Prénom <span className="text-red-500">*</span></label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} autoComplete="given-name" required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} autoComplete="family-name"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" placeholder="Votre nom" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" placeholder="+236 XX XX XX XX" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors bg-white">
                    <option>Demande de devis</option>
                    <option>Forage et Hydraulique</option>
                    <option>Construction et BTP</option>
                    <option>Commerce Général</option>
                    <option>Commande boutique</option>
                    <option>Candidature</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} autoComplete="off" required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors resize-none"
                    placeholder="Décrivez votre projet ou votre demande..." />
                </div>

                {/* Honeypot anti-bot (champ caché, les bots le remplissent automatiquement) */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Cloudflare Turnstile - invisible */}
                <div className="flex justify-center">
                  <Turnstile
                    siteKey="0x4AAAAAADwIa8_CKXi9jQua"
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => { setTurnstileToken(null); setStatus({ type: 'error', text: 'Erreur de vérification anti-bot. Rechargez la page.' }); }}
                  />
                </div>

                {status && (
                  <div className={`flex items-start gap-3 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {status.type === 'success'
                      ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                      : <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    }
                    <p className="text-sm">{status.text}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !turnstileToken}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 focus:ring-4 focus:ring-brand-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <><Send size={20} /> Envoyer le message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}
