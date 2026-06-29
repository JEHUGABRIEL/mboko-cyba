import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar, Mail, Users, BedDouble, ChevronRight, Check, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContactModal } from '../context/ContactModalContext';

const roomTypes = [
  { key: 'comfort', icon: '🛏️' },
  { key: 'deluxe', icon: '✨' },
  { key: 'executive', icon: '👑' },
  { key: 'presidential', icon: '💎' }
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 280 }
  },
  exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.2 } }
};

export function ContactModal() {
  const { t, i18n } = useTranslation();
  const { isOpen, closeModal } = useContactModal();
  const [selectedRoom, setSelectedRoom] = useState<string>('comfort');
  const [adults, setAdults] = useState(2);
  const [step, setStep] = useState<'form' | 'sent'>('form');
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
      setSelectedRoom('comfort');
      setAdults(2);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [isOpen]);

  const isFrench = i18n.language?.startsWith('fr');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sent');
    successTimerRef.current = setTimeout(() => {
      closeModal();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal-overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            key="contact-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== SUCCESS STATE ===== */}
            <AnimatePresence mode="wait">
              {step === 'sent' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-20 px-8 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">
                    {isFrench ? 'Demande envoyée !' : 'Request sent!'}
                  </h3>
                  <p className="text-slate-500 font-light max-w-sm">
                    {isFrench
                      ? 'Notre équipe vous contactera dans les plus brefs délais pour confirmer votre réservation.'
                      : 'Our team will contact you shortly to confirm your reservation.'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* ===== HEADER WITH IMAGE ===== */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&q=80&w=1200"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20" />

                    {/* Decorative pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 25px 25px, #fff 1px, transparent 0)',
                          backgroundSize: '40px 40px',
                        }}
                      />
                    </div>

                    {/* Close button */}
                    <button
                      onClick={closeModal}
                      className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all rounded-full"
                      aria-label="Fermer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Title on image */}
                    <div className="absolute bottom-4 left-6 right-6 z-10">
                      <span className="inline-block px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm mb-2">
                        KM Hotel
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-white">
                        {t('contact.formTitle')}
                      </h3>
                    </div>
                  </div>

                  {/* ===== FORM ===== */}
                  <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6">
                    {/* Room Selection */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                        <BedDouble className="w-3.5 h-3.5 inline mr-1.5 text-brand-500" />
                        {isFrench ? 'Type de chambre' : 'Room Type'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {roomTypes.map((room, i) => (
                          <button
                            key={room.key}
                            type="button"
                            onClick={() => setSelectedRoom(room.key)}
                            className={`relative p-3 rounded-sm border text-left transition-all duration-200 ${
                              selectedRoom === room.key
                                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className="text-lg block mb-0.5">{room.icon}</span>
                            <span className={`text-xs font-medium block ${
                              selectedRoom === room.key ? 'text-brand-700' : 'text-slate-700'
                            }`}>
                              {t(`chambres.rooms.${i}.name`)}
                            </span>
                            <span className={`text-[10px] block mt-0.5 ${
                              selectedRoom === room.key ? 'text-brand-500' : 'text-slate-400'
                            }`}>
                              {t(`chambres.rooms.${i}.price`)}
                            </span>
                            {selectedRoom === room.key && (
                              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guests & Dates row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      {/* Guests */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          <Users className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                          {isFrench ? 'Personnes' : 'Guests'}
                        </label>
                        <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="px-3 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-sm font-medium"
                          >
                            −
                          </button>
                          <span className="flex-1 text-center text-sm font-medium text-slate-700">
                            {adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdults(Math.min(10, adults + 1))}
                            className="px-3 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-sm font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          <Calendar className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                          {t('contact.formArrival')}
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-600"
                        />
                      </div>

                      {/* Departure */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          <Calendar className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                          {t('contact.formDeparture')}
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Name & Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {t('contact.formName')}
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                          placeholder={t('contact.formPlaceholderName')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          <Mail className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                          placeholder="email@exemple.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        <Phone className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                        {t('contact.formContact')}
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        placeholder="+236 XX XX XX XX"
                      />
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                        {t('contact.formMessage')}
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
                        placeholder={t('contact.formPlaceholder')}
                      />
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        type="submit"
                        className="w-full bg-brand-600 text-white font-medium py-3.5 rounded-sm hover:bg-brand-700 active:bg-brand-800 transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20"
                      >
                        <Calendar className="w-4 h-4" />
                        {t('contact.formSubmit')}
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                          {isFrench ? 'ou' : 'or'}
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href="tel:+23675494969"
                          className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium"
                        >
                          <Phone className="w-4 h-4 text-brand-500" />
                          <span className="hidden sm:inline">+236 75 49 49 69</span>
                          <span className="sm:hidden">{isFrench ? 'Appeler' : 'Call'}</span>
                        </a>
                        <a
                          href="https://wa.me/23675298984"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-sm hover:bg-green-100 transition-all text-sm font-medium"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <p className="text-[11px] text-center text-slate-400 mt-4">
                      {t('contact.formHint')}
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
