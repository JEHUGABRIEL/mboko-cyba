import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "../components/SocialIcons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { useSiteInfo } from "../hooks/useSiteData";
import { img } from "../data/siteData";
import useUnsavedChanges from "../hooks/useUnsavedChanges";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Contact() {
  const { t } = useTranslation();
  const { data: siteInfo = {} } = useSiteInfo();
  const info = siteInfo?.contactPage ?? {};
  const [contactDirty, setContactDirty] = useState(false);
  const { blocker } = useUnsavedChanges(contactDirty);
  const infoRef = useScrollReveal();
  const mapRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      <section className="relative h-[480px]">
        <img
          src={img("contact-hero", 1920, 700)}
          alt={t('contact.heroAlt')}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      <section className="py-24 px-6" ref={infoRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal"><SectionHeading icon={MapPin} eyebrow={t('contact.eyebrow')} title={t('contact.title')} align="left" /></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-8 -mt-4 max-w-md">
                {t('contact.intro')}
              </p>
              <div className="space-y-7 stagger-children">
                <div className="reveal"><ContactItem icon={MapPin} label={t('contact.address')} lines={info.address} /></div>
                <div className="reveal"><ContactItem icon={Phone} label={t('contact.phone')} lines={info.phones} /></div>
                <div className="reveal"><ContactItem icon={Mail} label={t('contact.email')} lines={info.emails} /></div>
                <div className="reveal"><ContactItem icon={Clock} label={t('contact.hours')} lines={info.hours} /></div>
              </div>

              <div className="mt-10 bg-brand-50/60 rounded-2xl p-7">
                <h3 className="font-heading font-bold mb-1">{t('contact.socialTitle')}</h3>
                <p className="text-gray-500 mb-5">{t('contact.socialText')}</p>
                <div className="flex items-center gap-3">
                  {[FacebookIcon, InstagramIcon, XIcon, YoutubeIcon].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label="social"
                      className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setContactDirty(false); }}
              className="bg-white border border-gray-100 shadow-card rounded-2xl p-8 space-y-5 h-fit reveal"
              onInput={() => setContactDirty(true)}
            >
              <h3 className="font-heading font-bold text-lg">{t('contact.formTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t('contact.formFirstName')} placeholder={t('contact.formFirstNamePlaceholder')} name="contact-firstname" />
                <Field label={t('contact.formLastName')} placeholder={t('contact.formLastNamePlaceholder')} name="contact-lastname" />
              </div>
              <Field label={t('contact.formEmail')} placeholder={t('contact.formEmailPlaceholder')} type="email" name="contact-email" />
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">{t('contact.formSubject')}</label>
                <select id="contact-subject" name="subject" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 text-gray-600">
                  <option>{t('contact.formSubjectPlaceholder')}</option>
                  <option>{t('contact.formSubjectOption1')}</option>
                  <option>{t('contact.formSubjectOption2')}</option>
                  <option>{t('contact.formSubjectOption3')}</option>
                  <option>{t('contact.formSubjectOption4')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">{t('contact.formMessage')}</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  maxLength={500}
                  placeholder={t('contact.formMessagePlaceholder')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 resize-none"
                />
                <p className="text-gray-400 text-xs mt-1.5">{t('contact.formMessageMax')}</p>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                {t('contact.formSubmit')} <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Blocker modal — changements non sauvegardés */}
            {blocker.state === "blocked" && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => blocker.reset()} />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {t('contact.blockerTitle')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('contact.blockerText')}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => blocker.reset()}
                      className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t('contact.blockerStay')}
                    </button>
                    <button
                      onClick={() => blocker.proceed()}
                      className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      {t('contact.blockerLeave')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24" ref={mapRef}>
        <div className="max-w-6xl mx-auto reveal">
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-[420px]">
            <iframe
              title="Localisation Bangui"
              className="w-full h-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=18.50%2C4.30%2C18.65%2C4.42&layer=mapnik&marker=4.3614%2C18.5550"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactItem({ icon: Icon, label, lines = [] }) {
  return (
    <div className="flex gap-4">
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="font-heading font-bold">{label}</p>
        {(lines ?? []).map((l) => (
          <p key={l} className="text-gray-500">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", name }) {
  const fieldId = name || `field-${label?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium mb-2">{label}</label>
      <input
        id={fieldId}
        name={fieldId}
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400"
      />
    </div>
  );
}
