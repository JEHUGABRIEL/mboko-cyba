import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { X, Send, CheckCircle2, Mail, Phone, Clock, Paperclip, File, Trash2, AlertCircle } from "lucide-react";
import { useSite } from "./SiteContext";
import { sendContactEmail } from "./emailService";
import { useToast } from "./ToastContext";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== Schéma de validation Zod avec messages en français =====
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez saisir une adresse email valide"),
  phone: z.string().max(30, "Le numéro est trop long"),
  company: z.string().max(100, "Le nom de l'organisation est trop long"),
  subject: z
    .string()
    .min(2, "Le sujet est requis")
    .max(200, "Le sujet est trop long"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message est trop long (5000 caractères max)"),
});

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { settings, addQuoteRequest } = useSite();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setSending(false);
      setAttachment(null);
      setErrors({});
      setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      // Nettoyer la valeur du champ fichier caché
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  // Fermeture automatique 2s après soumission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted, onClose]);

  // Bloquer le scroll du body + fermeture avec Échap
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ en cours d'édition
    if (errors[name]) {
      const next = { ...errors };
      delete next[name];
      setErrors(next);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setAttachment(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast("Le fichier est trop volumineux. Taille maximum : 10 Mo.", "error");
      e.target.value = "";
      return;
    }
    setAttachment(file);
  };

  const removeFile = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Valider avec Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      // Scroll vers le premier champ en erreur
      const firstField = result.error.issues[0].path[0] as string;
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    // Plus d'erreurs
    setErrors({});

    try {
      setSending(true);

      // 2. Sauvegarder dans SiteContext (persiste dans localStorage)
      addQuoteRequest({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        category: formData.subject,
        message: formData.message,
      });

      // 3. Envoyer l'email via Web3Forms (avec pièce jointe si présente)
      const emailSent = await sendContactEmail(
        {
          subject: `[LA CANT] Contact - ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Société : ${formData.company || "Non renseignée"}\nSujet : ${formData.subject}\n\n${formData.message}`,
        },
        attachment || undefined
      );

      setSending(false);
      setSubmitted(true);

      if (emailSent) {
        showToast("Message envoyé avec succès ! Nous vous répondrons sous 24 à 48 heures.", "success");
      } else {
        showToast("Message sauvegardé. L'envoi par email n'a pas pu aboutir, mais votre demande nous est bien parvenue.", "info");
      }
    } catch {
      setSending(false);
      setSubmitted(true);
      showToast("Erreur réseau — le message a bien été sauvegardé, mais l'envoi par email a échoué. Vérifiez votre connexion et réessayez.", "error");
    }
  };

  if (!isOpen) return null;

  const inputCls = (field: string) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
    }`;
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";
  const errorCls = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Contactez-nous</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Notre équipe vous répond sous 24 à 48 heures
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Message envoyé avec succès !
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Merci pour votre message. Notre équipe vous recontactera dans
                les plus brefs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className={labelCls}>
                  Nom & prénom <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={inputCls("name")}
                />
                {errors.name && <p className={errorCls}><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-company" className={labelCls}>
                  Société / Organisation
                </label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nom de votre société ou organisation"
                  className={inputCls("company")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className={labelCls}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={inputCls("email")}
                  />
                  {errors.email && <p className={errorCls}><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelCls}>
                    Téléphone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+236 XX XX XX XX"
                    className={inputCls("phone")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className={labelCls}>
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Demande d'information, Devis, Support..."
                  className={inputCls("subject")}
                />
                {errors.subject && <p className={errorCls}><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className={labelCls}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande..."
                  rows={4}
                  className={`${inputCls("message")} resize-y min-h-[100px]`}
                />
                {errors.message && <p className={errorCls}><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.message}</p>}
              </div>

              {/* Pièce jointe */}
              <div>
                <label className={labelCls}>Pièce jointe (optionnelle)</label>
                <p className="text-xs text-slate-400 mb-2">
                  Document technique, photo ou devis — max 10 Mo
                </p>

                {attachment ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {attachment.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(attachment)}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <File className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(attachment.size / 1024 / 1024).toFixed(1)} Mo
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      aria-label="Retirer le fichier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                  >
                    <Paperclip className="w-4 h-4" />
                    Cliquez pour ajouter un fichier
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.svg,.zip,.rar,.dwg,.dxf"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center">
                En soumettant ce formulaire, vous acceptez d'être contacté par
                notre équipe. Vos données restent confidentielles.
              </p>
            </form>
          )}
        </div>

        {/* Footer with contact info */}
        {!submitted && (
          <div className="px-6 pb-5 pt-0 border-t border-slate-100 mt-2">
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Réponse sous 24h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
