import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteContext';
import { HeroSlider } from '../components/HeroSlider';
import { ProjectModal } from '../components/ProjectModal';
import { Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';

export function Realisations() {
  const { settings, projects } = useSiteData();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const activeProject = selectedProject
    ? projects.find((p) => p.id === selectedProject) || null
    : null;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <HeroSlider
        slides={settings.heroSlides.realisations}
        bgImage="https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero" />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Tous nos projets
          </h2>
          <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez l'étendue de notre expertise à travers nos réalisations en
            République Centrafricaine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => {
            const imageCount = project.images?.length || 1;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProject(project.id)}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    wrapperClassName="w-full h-full"
                  />

                  <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {project.category}
                  </div>

                  {imageCount > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                      <ImageIcon size={12} />
                      <span>{imageCount}</span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>RCA</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal détail réalisation */}
      <ProjectModal
        project={activeProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
