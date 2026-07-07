import { useState, useRef, useCallback } from 'react';
import { X, GripVertical } from 'lucide-react';

type DraggableImageListProps = {
  images: string[];
  onReorder: (images: string[]) => void;
  onRemove: (index: number) => void;
};

export function DraggableImageList({ images, onReorder, onRemove }: DraggableImageListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
    dragNode.current = e.target as HTMLElement;
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Petit délai pour que l'élément ghost prenne bien la classe dragged
    requestAnimationFrame(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-40', 'scale-95');
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
    // Only clear if we actually left the target (not a child)
    const target = e.target as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!target.contains(relatedTarget)) {
      setOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIdx) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIdx, 0, removed);
    onReorder(newImages);

    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, images, onReorder]);

  const handleDragEnd = useCallback(() => {
    if (dragNode.current) {
      dragNode.current.classList.remove('opacity-40', 'scale-95');
    }
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, i) => {
        const isOver = overIndex === i && dragIndex !== i;
        return (
          <div
            key={`${i}-${url.substring(url.length - 20)}`}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={`
              relative group cursor-grab active:cursor-grabbing
              transition-all duration-200 ease-out
              ${isOver ? 'translate-y-[-8px] shadow-lg ring-2 ring-brand-500 ring-offset-2' : ''}
              ${dragIndex === i ? 'z-10' : ''}
            `}
          >
            <img
              src={url}
              alt={`Image ${i + 1}`}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-600 select-none pointer-events-none"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              draggable={false}
            />

            {/* Grip handle indicator */}
            <div
              className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none"
              aria-label={`Image ${i + 1} — glisser-déposer pour réordonner`}
            >
              <GripVertical
                size={16}
                className="text-white/0 group-hover:text-white/70 transition-all drop-shadow-md"
              />
            </div>

            {/* Index badge */}
            <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {i + 1}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Supprimer l'image ${i + 1}`}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-20"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
