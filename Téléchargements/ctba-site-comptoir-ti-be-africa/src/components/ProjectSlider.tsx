import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../context/SiteContext';
import { OptimizedImage } from './OptimizedImage';

type Props = {
  projects: Project[];
};

export function ProjectSlider({ projects }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const mountedRef = useRef(true);

  // Détection responsive du nombre de projets par slide
  useEffect(() => {
    mountedRef.current = true;
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) setItemsPerSlide(1);
      else if (width < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Regrouper les projets en pages
  const pages: Project[][] = [];
  for (let i = 0; i < projects.length; i += itemsPerSlide) {
    pages.push(projects.slice(i, i + itemsPerSlide));
  }

  const totalPages = pages.length;

  // Auto-slide
  useEffect(() => {
    if (totalPages <= 1) return;
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [totalPages]);

  // Réinitialiser la page quand le nombre d'éléments par slide change
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerSlide]);

  if (!projects.length) {
    return (
      <p className="text-center text-slate-400 py-8">
        Aucune réalisation pour le moment.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Track coulissant */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0 w-full flex-shrink-0"
            >
              {page.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] hover:shadow-xl hover:shadow-brand-600/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <OptimizedImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    wrapperClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-brand-400 text-sm font-bold uppercase tracking-wider mb-2">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Points de navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentPage
                  ? 'bg-brand-600 w-8'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Aller au groupe de réalisations ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lien "Voir tous les projets" sous le slider */}
      <div className="mt-8 text-center">
        <Link
          to="/realisations"
          className="inline-flex items-center text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Voir tous les projets <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
