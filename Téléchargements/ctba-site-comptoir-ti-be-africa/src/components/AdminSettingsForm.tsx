import { useState, useEffect } from 'react';
import { Settings, Image as ImageIcon } from 'lucide-react';
import type { SiteSettings } from '../context/SiteContext';
import { CloudinaryUploader } from './CloudinaryUploader';

interface AdminSettingsFormProps {
  settings: SiteSettings;
  settingsSubTab: 'coordinates' | 'hero' | null;
  onSave: (settings: Partial<SiteSettings>) => void;
}

export function AdminSettingsForm({ settings, settingsSubTab, onSave }: AdminSettingsFormProps) {
  const [form, setForm] = useState({
    phone1: settings.contact.phone1,
    phone2: settings.contact.phone2,
    email: settings.contact.email,
    address: settings.contact.address,
    heroSlides: settings.heroSlides.home.map((s) => ({ ...s })),
  });

  useEffect(() => {
    setForm({
      phone1: settings.contact.phone1,
      phone2: settings.contact.phone2,
      email: settings.contact.email,
      address: settings.contact.address,
      heroSlides: settings.heroSlides.home.map((s) => ({ ...s })),
    });
  }, [settings]);

  const handleSave = () => {
    onSave({
      contact: {
        phone1: form.phone1,
        phone2: form.phone2,
        email: form.email,
        address: form.address,
      },
      heroSlides: {
        ...settings.heroSlides,
        home: form.heroSlides,
      },
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Paramètres du site
      </h1>

      {!settingsSubTab && (
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Sélectionnez une section dans le menu Paramètres pour la modifier.
        </p>
      )}

      {(!settingsSubTab || settingsSubTab === 'coordinates') && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            Coordonnées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Téléphone 1
              </label>
              <input
                type="text"
                value={form.phone1}
                onChange={(e) => setForm((prev) => ({ ...prev, phone1: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Téléphone 2
              </label>
              <input
                type="text"
                value={form.phone2}
                onChange={(e) => setForm((prev) => ({ ...prev, phone2: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {(!settingsSubTab || settingsSubTab === 'hero') && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            Textes Hero (Accueil)
          </h2>
          {form.heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0"
            >
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Slide {idx + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const newSlides = [...form.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], title: e.target.value };
                      setForm((prev) => ({ ...prev, heroSlides: newSlides }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Sous-titre
                  </label>
                  <textarea
                    value={slide.subtitle}
                    onChange={(e) => {
                      const newSlides = [...form.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], subtitle: e.target.value };
                      setForm((prev) => ({ ...prev, heroSlides: newSlides }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Image de fond
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <ImageIcon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                      <input
                        type="url"
                        value={slide.image || ''}
                        onChange={(e) => {
                          const newSlides = [...form.heroSlides];
                          newSlides[idx] = { ...newSlides[idx], image: e.target.value };
                          setForm((prev) => ({ ...prev, heroSlides: newSlides }));
                        }}
                        placeholder="URL de l'image..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                    <CloudinaryUploader
                      onUpload={(url) => {
                        const newSlides = [...form.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], image: url };
                        setForm((prev) => ({ ...prev, heroSlides: newSlides }));
                      }}
                      label="Upload"
                    />
                  </div>
                  {slide.image && (
                    <div className="mt-2">
                      <img
                        src={slide.image}
                        alt=""
                        className="w-full h-28 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Settings size={18} />
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}
