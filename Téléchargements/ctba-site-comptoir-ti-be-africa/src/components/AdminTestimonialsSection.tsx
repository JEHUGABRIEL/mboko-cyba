import { Plus, Search, Edit2, Trash2, Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Testimonial } from '../context/SiteContext';

interface AdminTestimonialsSectionProps {
  testimonials: Testimonial[];
  search: string;
  page: number;
  itemsPerPage: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string, label: string) => void;
}

export function AdminTestimonialsSection({
  testimonials,
  search,
  page,
  itemsPerPage,
  onSearchChange,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: AdminTestimonialsSectionProps) {
  const q = search.toLowerCase();
  const filtered = q
    ? testimonials.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q)
      )
    : testimonials;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = page * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Gestion des Témoignages
        </h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); onPageChange(0); }}
          placeholder="Rechercher un témoignage..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div className="grid gap-4">
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
            <MessageSquare size={32} className="text-slate-400 dark:text-slate-500 mb-3" />
            <p className="text-slate-500 dark:text-slate-300 font-medium">Aucun témoignage trouvé</p>
            {!q && (
              <p className="text-slate-400 text-sm mt-1">
                Cliquez sur &quot;Ajouter&quot; pour créer le premier témoignage.
              </p>
            )}
          </div>
        ) : (
          paged.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  <button
                    onClick={() => onEdit(testimonial)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(testimonial.id, testimonial.name)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page + 1} / {totalPages} ({filtered.length} témoignages)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
