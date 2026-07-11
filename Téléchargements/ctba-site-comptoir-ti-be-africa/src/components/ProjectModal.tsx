import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';
import { Project } from '../context/SiteContext';
import { ImageSlider } from './ImageSlider';

type ProjectModalProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const images = project.images?.length ? project.images : [project.image].filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {project.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex flex-col md:flex-row">
              {/* Image slider - left / top */}
              <div className="w-full md:w-3/5 relative">
                <div className="aspect-[4/3] bg-slate-100">
                  <ImageSlider
                    images={images}
                    alt={project.title}
                    className="rounded-none"
                  />
                </div>
              </div>

              {/* Details - right / bottom */}
              <div className="w-full md:w-2/5 p-6 flex flex-col">
                {/* Date et lieu */}
                <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>RCA</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Description du projet
                  </h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {project.description || 'Aucune description disponible pour cette réalisation.'}
                  </p>
                </div>

                {/* Image count badge */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                      <span className="font-medium text-slate-600">{images.length}</span>
                      <span>{images.length > 1 ? 'photos' : 'photo'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
