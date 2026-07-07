import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImageOff } from 'lucide-react';

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string;
};

/**
 * Preload une image via un objet Image natif, résout une fois chargée.
 * Utilisé par TanStack Query pour mettre en cache le statut de chargement.
 */
function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Échec chargement image: ${src}`));
    img.src = src;
  });
}

/**
 * Composant d'image optimisé avec :
 * - Cache TanStack Query (évite les rechargements)
 * - Skeleton shimmer pendant le chargement
 * - Fallback élégant en cas d'erreur
 * - Fade-in au chargement
 * - lazy loading natif
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  aspectRatio,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // TanStack Query met en cache le résultat du préchargement
  const { isError } = useQuery({
    queryKey: ['image', src],
    queryFn: () => preloadImage(src),
    staleTime: 1000 * 60 * 30, // 30 minutes avant de re-vérifier
    gcTime: 1000 * 60 * 60,    // 1 heure dans le cache
    retry: 1,
  });

  // Timer pour ne montrer le skeleton que si le chargement prend > 150ms
  // (évite le flash skeleton pour les images déjà en cache)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setShowSkeleton(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
    setShowSkeleton(false);
  };

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton shimmer */}
      {showSkeleton && !isLoaded && (
        <div
          className="absolute inset-0 bg-slate-200 animate-pulse rounded-[inherit]"
          aria-hidden="true"
        />
      )}

      {/* Fallback erreur */}
      {isError && !isLoaded && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 rounded-[inherit]">
          <ImageOff size={24} className="mb-1" />
          <span className="text-xs">Image non disponible</span>
        </div>
      )}

      {/* Image réelle */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={() => setIsLoaded(false)}
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}
