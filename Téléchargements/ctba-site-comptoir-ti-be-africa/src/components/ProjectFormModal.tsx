import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import { Project, Service } from '../context/SiteContext';
import { CloudinaryUploader } from './CloudinaryUploader';
import { DraggableImageList } from './DraggableImageList';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  editProject?: Project | null;
  services?: Service[];
};

const emptyForm = {
  title: '',
  category: '',
  description: '',
  image: '',
  images: [] as string[],
  date: '',
  serviceId: '',
};

export function ProjectFormModal({ isOpen, onClose, onSave, editProject, services }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [imagePreview, setImagePreview] = useState('');

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editProject) {
      setForm({
        title: editProject.title,
        category: editProject.category,
        description: editProject.description,
        image: editProject.image,
        images: editProject.images?.filter((img) => img !== editProject.image) ?? [],
        date: editProject.date,
        serviceId: editProject.serviceId || '',
      });
      setImagePreview(editProject.image || '');
    } else {
      setForm({ ...emptyForm });
      setImagePreview('');
    }
  }, [editProject]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Prévisualisation image
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const mainImage = form.image || 'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne';
    const extraImages = form.images.filter((img) => img.trim() && img !== mainImage);

    const project: Project = {
      id: editProject ? editProject.id : Date.now().toString(),
      title: form.title,
      category: form.category || 'Général',
      description: form.description,
      image: mainImage,
      images: [mainImage, ...extraImages],
      date: form.date || new Date().getFullYear().toString(),
      serviceId: form.serviceId || undefined,
    };

    onSave(project);
    handleClose();
  };

  const handleClose = () => {
    setForm({ ...emptyForm });
    setImagePreview('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editProject ? "Modifier la réalisation" : "Ajouter une réalisation"}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-6 flex-1 space-y-5"
            >
              {/* Ligne 1 : Titre + Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-title" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Titre du projet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="project-title"
                    name="title"
                    autoComplete="off"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="ex: Construction Immeuble R+4"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="project-category" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    id="project-category"
                    name="category"
                    autoComplete="off"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="ex: Bâtiment, Rénovation..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Ligne 2 : Service lié */}
              <div>
                <label htmlFor="project-service" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Service lié
                </label>
                <select
                  id="project-service"
                  name="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                >
                  <option value="">Aucun service spécifique</option>
                  {services?.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Ligne 3 : Date */}
              <div>
                <label htmlFor="project-date" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Année / Date
                </label>
                <input
                  type="text"
                  id="project-date"
                  name="date"
                  autoComplete="off"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="ex: 2024"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Ligne 4 : Image principale */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Image principale
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <ImageIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="url"
                      id="project-image"
                      name="image"
                      autoComplete="url"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="URL de l'image..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                  <CloudinaryUploader
                    onUpload={(url) => {
                      setForm((prev) => ({ ...prev, image: url }));
                      setImagePreview(url);
                    }}
                    label="Upload"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Prévisualisation"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                      onError={() => setImagePreview('')}
                    />
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Image principale
                    </span>
                  </div>
                )}
              </div>

              {/* Images supplémentaires */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Images supplémentaires
                </label>
                <div className="flex flex-col gap-3">
                  <CloudinaryUploader
                    multiple
                    onUpload={(url) => {
                      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
                    }}
                    label="Ajouter des images"
                  />
                  <DraggableImageList
                    images={form.images}
                    onReorder={(newImages) => setForm((prev) => ({ ...prev, images: newImages }))}
                    onRemove={(index) => setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, j) => j !== index),
                    }))}
                  />
                </div>
              </div>

              {/* Ligne 5 : Description */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Description
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  autoComplete="off"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description du projet..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
                >
                  {editProject ? "Enregistrer les modifications" : "Ajouter la réalisation"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
