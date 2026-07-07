import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Image as ImageIcon } from 'lucide-react';
import { Testimonial } from '../context/SiteContext';
import { CloudinaryUploader } from './CloudinaryUploader';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: Testimonial) => void;
  editTestimonial?: Testimonial | null;
};

const emptyForm = {
  name: '',
  role: '',
  content: '',
  rating: 5,
  image: '',
};

export function TestimonialFormModal({ isOpen, onClose, onSave, editTestimonial }: Props) {
  const [form, setForm] = useState({ ...emptyForm });

  const [imagePreview, setImagePreview] = useState('');

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editTestimonial) {
      setForm({
        name: editTestimonial.name,
        role: editTestimonial.role,
        content: editTestimonial.content,
        rating: editTestimonial.rating,
        image: editTestimonial.image || '',
      });
      setImagePreview(editTestimonial.image || '');
    } else {
      setForm({ ...emptyForm });
      setImagePreview('');
    }
  }, [editTestimonial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;

    const testimonial: Testimonial = {
      id: editTestimonial ? editTestimonial.id : Date.now().toString(),
      name: form.name,
      role: form.role || 'Client',
      content: form.content,
      rating: form.rating,
      image: form.image || undefined,
    };

    onSave(testimonial);
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
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
              {/* Ligne 1 : Nom */}
              <div>                  <label htmlFor="testimonial-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Nom du client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="testimonial-name"
                    name="name"
                    autoComplete="off"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ex: Jean-Paul M."
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Ligne 2 : Rôle */}
              <div>
                <label htmlFor="testimonial-role" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Rôle / Fonction
                </label>
                <input
                  type="text"
                  id="testimonial-role"
                  name="role"
                  autoComplete="organization-title"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="ex: Propriétaire, Directeur..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Ligne 3 : Note */}
              <div>
                <label id="testimonial-rating-label" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Note
                </label>
                <div className="flex items-center gap-1" role="radiogroup" aria-labelledby="testimonial-rating-label">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`p-1 rounded transition-colors ${
                        star <= form.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <Star size={28} fill={star <= form.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">
                    {form.rating} / 5
                  </span>
                </div>
              </div>

              {/* Ligne : Photo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Photo du client
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <ImageIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="url"
                      id="testimonial-image"
                      name="image"
                      autoComplete="url"
                      value={form.image}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, image: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      placeholder="URL de la photo..."
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
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                      onError={() => setImagePreview('')}
                    />
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Photo du client
                    </span>
                  </div>
                )}
              </div>

              {/* Ligne 5 : Contenu */}
              <div>                  <label htmlFor="testimonial-content" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Témoignage <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="testimonial-content"
                  name="content"
                  autoComplete="off"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Le témoignage du client..."
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
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
                  {editTestimonial ? 'Enregistrer les modifications' : 'Ajouter le témoignage'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
