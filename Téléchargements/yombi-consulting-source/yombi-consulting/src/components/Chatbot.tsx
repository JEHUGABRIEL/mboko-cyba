import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight, Mail, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  text: string;
  isUser: boolean;
  isForm?: boolean;
}

interface QAPair {
  question: string;
  answer: string;
}

// ⚠️ Remplacez cette clé par votre propre clé Web3Forms (gratuite sur https://web3forms.com)
const WEB3FORMS_KEY = 'REMPLACER_PAR_VOTRE_CLE_WEB3FORMS';

function ContactForm({
  question,
  onSubmit,
  onCancel,
  t,
}: {
  question: string;
  onSubmit: () => void;
  onCancel: () => void;
  t: any;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Chatbot Yombi Consulting] Question sans réponse de ${name}`,
          name,
          email,
          phone,
          message: `Question posée au chatbot :\n${question}\n\nCoordonnées du visiteur :\nNom : ${name}\nEmail : ${email}\nTéléphone : ${phone || 'Non renseigné'}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(onSubmit, 1500);
      } else {
        setError(t('chatbot.error.general'));
      }
    } catch {
      setError(t('chatbot.error.connection'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm py-2">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>{t('chatbot.form.success')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-2.5 pt-1">
      <input
        type="text"
        placeholder={t('chatbot.form.name')}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors placeholder:text-slate-400"
      />
      <input
        type="email"
        placeholder={t('chatbot.form.email')}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors placeholder:text-slate-400"
      />
      <input
        type="tel"
        placeholder={t('chatbot.form.phone')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors placeholder:text-slate-400"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 text-xs bg-blue-900 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? t('chatbot.form.sending') : t('chatbot.form.send')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="text-xs text-slate-500 py-2 px-3 hover:text-slate-700 transition-colors"
        >
          {t('chatbot.form.cancel')}
        </button>
      </div>
    </form>
  );
}

export function Chatbot() {
  const { t } = useTranslation();
  const faqs = t('chatbot.faqs', { returnObjects: true }) as QAPair[];
  const quickReplies = t('chatbot.quickReplies', { returnObjects: true }) as string[];

  const welcomeMessage: Message = {
    text: t('chatbot.welcome'),
    isUser: false,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const hasOpenedOnce = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasOpenedOnce.current) {
      const timer = setTimeout(() => setUnreadCount(1), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    hasOpenedOnce.current = true;
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Moteur de recherche de réponses pour le chatbot : 3 niveaux de matching
  // 1. Correspondance exacte avec une question prédéfinie
  // 2. Correspondance par mots-clés (au moins 2 mots communs avec une question)
  // 3. Correspondance par dictionnaire manuel (keywordMap) pour les synonymes
  const findAnswer = (question: string): string | undefined => {
    const normalized = question.toLowerCase().trim();

    // Niveau 1 : correspondance exacte (insensible à la casse)
    for (const faq of faqs) {
      if (normalized === faq.question.toLowerCase()) {
        return faq.answer;
      }
    }

    // Niveau 2 : correspondance floue par mots-clés significatifs (> 3 caractères)
    // Renvoie la réponse si au moins 2 mots-clés correspondent
    for (const faq of faqs) {
      const faqNormalized = faq.question.toLowerCase().replace(/[?]/g, '');
      const keywords = faqNormalized.split(' ').filter((w) => w.length > 3);
      let matchCount = 0;
      for (const word of keywords) {
        if (normalized.includes(word) || word.includes(normalized)) {
          matchCount++;
        }
      }
      if (matchCount >= 2) {
        return faq.answer;
      }
    }

    // Niveau 3 : dictionnaire de synonymes pour couvrir les formulations variées
    // Chaque mot-clé pointe vers l'index de la FAQ correspondante
    const keywordMap: Record<string, number> = {
      service: 0,
      formalisation: 0,
      'business plan': 1,
      juridique: 2,
      tarif: 1,
      coût: 1,
      prix: 1,
      paye: 1,
      contact: 3,
      téléphone: 3,
      email: 3,
      whatsapp: 3,
      adresse: 2,
      situé: 2,
      délai: 4,
      temps: 4,
      semaine: 4,
      jour: 4,
      qui: 5,
      cabinet: 5,
      équipe: 5,
      histoire: 5,
      expérience: 5,
    };

    for (const [keyword, faqIndex] of Object.entries(keywordMap)) {
      if (normalized.includes(keyword)) {
        return faqs[faqIndex]?.answer;
      }
    }

    return undefined;
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
    setInput('');

    setTimeout(() => {
      const answer = findAnswer(trimmed);
      if (answer) {
        setMessages((prev) => [...prev, { text: answer, isUser: false }]);
        setShowSuggestions(true);
      } else {
        setPendingQuestion(trimmed);
        const formMsg: Message = {
          text: t('chatbot.noAnswer'),
          isUser: false,
          isForm: true,
        };
        setMessages((prev) => [...prev, formMsg]);
      }
    }, 600);
  };

  const handleFormSubmitSuccess = () => {
    setMessages((prev) => [
      ...prev,
      {
        text: t('chatbot.formSuccess'),
        isUser: false,
      },
    ]);
    setPendingQuestion('');
    setShowSuggestions(true);
  };

  const handleFormCancel = () => {
    setMessages((prev) => [
      ...prev,
      {
        text: t('chatbot.formCancel'),
        isUser: false,
      },
    ]);
    setPendingQuestion('');
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Ouvrir le chatbot"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-bold px-1 shadow-md animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[60] w-[360px] max-[400px]:right-3 max-[400px]:w-[calc(100%-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-blue-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-blue-900 font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('chatbot.header')}</p>
                  <p className="text-blue-200 text-xs">{t('chatbot.subheader')}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors" aria-label="Fermer le chatbot">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-[380px] overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.isForm && pendingQuestion ? (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 px-4 py-3">
                        <div className="flex items-start gap-2 mb-3">
                          <Mail className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                          <p className="text-[0.9rem] leading-relaxed">{msg.text}</p>
                        </div>
                        <ContactForm
                          question={pendingQuestion}
                          onSubmit={handleFormSubmitSuccess}
                          onCancel={handleFormCancel}
                          t={t}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9rem] leading-relaxed whitespace-pre-line ${
                          msg.isUser
                            ? 'bg-blue-900 text-white rounded-br-md'
                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-md'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {showSuggestions && !pendingQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={messages.length === 1 ? { delay: 0.3 } : undefined}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-3.5 py-1.5 hover:border-blue-300 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 flex items-center gap-1"
                    >
                      {messages.length === 1 && (
                        <ChevronRight className="w-3 h-3 shrink-0" />
                      )}
                      {reply}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 p-3 flex items-center gap-2 bg-white"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pendingQuestion ? t('chatbot.inputPlaceholderForm') : t('chatbot.inputPlaceholder')}
                disabled={!!pendingQuestion}
                className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
