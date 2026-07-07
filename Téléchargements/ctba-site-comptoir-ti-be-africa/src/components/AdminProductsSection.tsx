import { useState, useCallback, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import type { Product } from '../context/SiteContext';

interface AdminProductsSectionProps {
  products: Product[];
  search: string;
  page: number;
  itemsPerPage: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, label: string) => void;
  onReorder?: (orderedIds: string[]) => void;
}

export function AdminProductsSection({
  products,
  search,
  page,
  itemsPerPage,
  onSearchChange,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
}: AdminProductsSectionProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  const q = search.toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.price.toLowerCase().includes(q)
      )
    : products;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paged = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const pagedRef = useRef(paged);
  const filteredRef = useRef(filtered);
  pagedRef.current = paged;
  filteredRef.current = filtered;

  const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
    dragNode.current = e.target as HTMLElement;
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-40');
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex === null || dragIndex === idx) return;
    setOverIndex(idx);
  }, [dragIndex]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!target.contains(relatedTarget)) {
      setOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    const currentPaged = pagedRef.current;
    const currentFiltered = filteredRef.current;
    if (dragIndex === null || dragIndex === dropIdx || !onReorder) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const newPaged = [...currentPaged];
    const [removed] = newPaged.splice(dragIndex, 1);
    newPaged.splice(dropIdx, 0, removed);

    const before = currentFiltered.slice(0, page * itemsPerPage);
    const after = currentFiltered.slice((page + 1) * itemsPerPage);
    const reorderedIds = [...before, ...newPaged, ...after].map((p) => p.id);
    onReorder(reorderedIds);

    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, page, itemsPerPage, onReorder]);

  const handleDragEnd = useCallback(() => {
    if (dragNode.current) {
      dragNode.current.classList.remove('opacity-40');
    }
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Gestion des Produits
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
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {onReorder && <th className="p-3 sm:p-4 w-10"></th>}
                <th className="p-3 sm:p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm">Produit</th>
                <th className="p-3 sm:p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm">Catégorie</th>
                <th className="p-3 sm:p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm">Prix</th>
                <th className="p-3 sm:p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm">Statut</th>
                <th className="p-3 sm:p-4 font-semibold text-slate-700 dark:text-slate-200 text-sm text-right sticky right-0 z-10 bg-slate-50 dark:bg-slate-700/50 shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.15)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={onReorder ? 6 : 5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                paged.map((product, idx) => {
                  const isOver = overIndex === idx && dragIndex !== idx;
                  return (
                    <tr
                      key={product.id}
                      draggable={!!onReorder && !search}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`border-b border-slate-100 dark:border-slate-700 transition-all duration-200 ${
                        isOver
                          ? 'translate-y-[-4px] shadow-md ring-2 ring-brand-500 ring-offset-2 rounded-lg'
                          : ''
                      } ${
                        dragIndex === idx ? 'opacity-40 scale-[1.01]' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      } ${onReorder && !search ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                      {onReorder && (
                        <td className="p-3 sm:p-4 w-10 text-slate-300 dark:text-slate-600">
                          <GripVertical size={16} className="mx-auto" />
                        </td>
                      )}
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img src={product.image} alt={product.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover shrink-0" />
                          <span className="font-medium text-slate-900 dark:text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-300 text-sm">{product.category}</td>
                      <td className="p-3 sm:p-4 text-slate-900 dark:text-white font-medium text-sm">{product.price}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.inStock ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                          {product.inStock ? 'En stock' : 'Rupture'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-right whitespace-nowrap sticky right-0 z-10 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.15)]">
                        <button onClick={() => onEdit(product)} className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => onDelete(product.id, product.name)} className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page + 1} / {totalPages} ({filtered.length} produits)
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
      </div>
    </div>
  );
}
