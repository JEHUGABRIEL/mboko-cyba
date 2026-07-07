import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import type { PageContent } from '../context/SiteContext';
import { CloudinaryUploader } from './CloudinaryUploader';

interface AdminPagesEditorProps {
  pageContent: PageContent;
  onSave: (content: PageContent) => void;
  section?: string | null;
}

export function AdminPagesEditor({ pageContent, onSave, section }: AdminPagesEditorProps) {
  const [form, setForm] = useState<PageContent>(() => JSON.parse(JSON.stringify(pageContent)));

  useEffect(() => {
    setForm(JSON.parse(JSON.stringify(pageContent)));
  }, [pageContent]);

  const handleSave = () => {
    onSave(form);
  };

  const showHome = !section || section === 'pages-home';
  const showServices = !section || section === 'pages-services';
  const showContact = !section || section === 'pages-contact';

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        {section === 'pages-home' ? "Page d'accueil" : section === 'pages-services' ? 'Page des services' : section === 'pages-contact' ? 'Page de contact' : 'Contenu des Pages'}
      </h1>

      {/* === HOME SECTION === */}
      {showHome && (
        <>
          {/* Home - About Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Accueil — Section À propos
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Sous-titre</label>
                <input type="text" value={form.home.about.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, home: { ...p.home, about: { ...p.home.about, subtitle: e.target.value } } }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Titre principal</label>
                <input type="text" value={form.home.about.title}
                  onChange={(e) => setForm((p) => ({ ...p, home: { ...p.home, about: { ...p.home.about, title: e.target.value } } }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Image de la section</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="url" value={form.home.about.image || ''}
                      onChange={(e) => setForm((p) => ({ ...p, home: { ...p.home, about: { ...p.home.about, image: e.target.value } } }))}
                      placeholder="URL de l'image..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                  <CloudinaryUploader onUpload={(url) => setForm((p) => ({ ...p, home: { ...p.home, about: { ...p.home.about, image: url } } }))} label="Upload" />
                </div>
                {form.home.about.image && (
                  <div className="mt-2">
                    <img src={form.home.about.image} alt="" className="w-full h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-600" />
                  </div>
                )}
              </div>
              {form.home.about.paragraphs.map((p, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Paragraphe {i + 1}</label>
                  <textarea value={p} onChange={(e) => {
                    const newParas = [...form.home.about.paragraphs];
                    newParas[i] = e.target.value;
                    setForm((prev) => ({ ...prev, home: { ...prev.home, about: { ...prev.home.about, paragraphs: newParas } } }));
                  }} rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Home - Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Accueil — Statistiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {form.home.stats.map((stat, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Valeur {i + 1}</label>
                  <input type="text" value={stat.value} onChange={(e) => {
                    const newStats = [...form.home.stats];
                    newStats[i] = { ...newStats[i], value: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, stats: newStats } }));
                  }}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm mb-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Label</label>
                  <input type="text" value={stat.label} onChange={(e) => {
                    const newStats = [...form.home.stats];
                    newStats[i] = { ...newStats[i], label: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, stats: newStats } }));
                  }}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Home - Reasons */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Accueil — Pourquoi nous choisir
            </h2>
            {form.home.reasons.map((reason, i) => (
              <div key={i} className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">Raison {i + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={reason.title} placeholder="Titre" onChange={(e) => {
                    const newReasons = [...form.home.reasons];
                    newReasons[i] = { ...newReasons[i], title: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, reasons: newReasons } }));
                  }}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                  <textarea value={reason.desc} placeholder="Description" onChange={(e) => {
                    const newReasons = [...form.home.reasons];
                    newReasons[i] = { ...newReasons[i], desc: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, reasons: newReasons } }));
                  }} rows={2}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Home - Values */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Accueil — Nos Valeurs
            </h2>
            {form.home.values.map((val, i) => (
              <div key={i} className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={val.title} placeholder="Titre" onChange={(e) => {
                    const newVals = [...form.home.values];
                    newVals[i] = { ...newVals[i], title: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, values: newVals } }));
                  }}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                  <textarea value={val.desc} placeholder="Description" onChange={(e) => {
                    const newVals = [...form.home.values];
                    newVals[i] = { ...newVals[i], desc: e.target.value };
                    setForm((prev) => ({ ...prev, home: { ...prev.home, values: newVals } }));
                  }} rows={2}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section (incluse dans Home) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Section Appel à l'action (CTA)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Titre</label>
                <input type="text" value={form.cta.title} onChange={(e) => setForm((prev) => ({ ...prev, cta: { ...prev.cta, title: e.target.value } }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Description</label>
                <textarea value={form.cta.description} onChange={(e) => setForm((prev) => ({ ...prev, cta: { ...prev.cta, description: e.target.value } }))} rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* === SERVICES SECTION === */}
      {showServices && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            Services — Méthodologie
          </h2>
          {form.services.methodology.map((step, i) => (
            <div key={i} className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" value={step.step} placeholder="Numéro" onChange={(e) => {
                  const newSteps = [...form.services.methodology];
                  newSteps[i] = { ...newSteps[i], step: e.target.value };
                  setForm((prev) => ({ ...prev, services: { ...prev.services, methodology: newSteps } }));
                }}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                <input type="text" value={step.title} placeholder="Titre" onChange={(e) => {
                  const newSteps = [...form.services.methodology];
                  newSteps[i] = { ...newSteps[i], title: e.target.value };
                  setForm((prev) => ({ ...prev, services: { ...prev.services, methodology: newSteps } }));
                }}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                <input type="text" value={step.desc} placeholder="Description" onChange={(e) => {
                  const newSteps = [...form.services.methodology];
                  newSteps[i] = { ...newSteps[i], desc: e.target.value };
                  setForm((prev) => ({ ...prev, services: { ...prev.services, methodology: newSteps } }));
                }}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === CONTACT SECTION === */}
      {showContact && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            Contact — Horaires d'ouverture
          </h2>
          {form.contact.openingHours.map((oh, i) => (
            <div key={i} className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={oh.label} placeholder="Label (ex: Lundi - Vendredi)" onChange={(e) => {
                  const newHours = [...form.contact.openingHours];
                  newHours[i] = { ...newHours[i], label: e.target.value };
                  setForm((prev) => ({ ...prev, contact: { ...prev.contact, openingHours: newHours } }));
                }}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                <input type="text" value={oh.hours} placeholder="Horaires (ex: 08h00 - 17h00)" onChange={(e) => {
                  const newHours = [...form.contact.openingHours];
                  newHours[i] = { ...newHours[i], hours: e.target.value };
                  setForm((prev) => ({ ...prev, contact: { ...prev.contact, openingHours: newHours } }));
                }}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end mt-8">
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm">
          <Save size={18} />
          Sauvegarder les contenus
        </button>
      </div>
    </div>
  );
}
