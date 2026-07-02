import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GalleryLightbox({ images, initialIndex = 0, onClose }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(initialIndex);
  const [loaded, setLoaded] = useState({});
  const [zoomed, setZoomed] = useState(false);
  const total = images.length;

  const goTo = useCallback((i) => {
    setIndex(((i % total) + total) % total);
    setZoomed(false);
  }, [total]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case "Escape": onClose(); break;
        case "ArrowLeft": goPrev(); break;
        case "ArrowRight": goNext(); break;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  // Preload adjacent images
  useEffect(() => {
    [index - 1, index, index + 1].forEach((i) => {
      const idx = ((i % total) + total) % total;
      if (!loaded[idx] && images[idx]) {
        const img = new Image();
        img.onload = () => setLoaded((prev) => ({ ...prev, [idx]: true }));
        img.src = images[idx];
      }
    });
  }, [index, images, total, loaded]);

  if (total === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={t('gallery.ariaLabel')}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {index + 1} / {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed((z) => !z)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label={zoomed ? t('gallery.zoomOut') : t('gallery.zoomIn')}
          >
            {zoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label={t('gallery.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Previous button */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          aria-label={t('gallery.previous')}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative z-[1] flex items-center justify-center w-full h-full px-16 sm:px-24 animate-scale-in"
        onClick={onClose}
      >
        <div
          className={`relative transition-all duration-300 ease-out ${
            zoomed ? "w-full h-full" : "max-w-[85vw] max-h-[80vh]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading placeholder */}
          {!loaded[index] && (
            <div className="w-full h-full min-h-[300px] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={images[index]}
            alt={`Image ${index + 1}`}
            width={1200}
            height={800}
            onLoad={() => setLoaded((prev) => ({ ...prev, [index]: true }))}
            decoding="async"
            className={`w-full h-full transition-all duration-300 ${
              loaded[index]
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            } ${
              zoomed
                ? "object-contain p-4 cursor-zoom-out"
                : "object-contain cursor-zoom-in"
            }`}
            style={{ maxHeight: zoomed ? "100vh" : "80vh" }}
            onClick={() => setZoomed((z) => !z)}
          />
        </div>
      </div>

      {/* Next button */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          aria-label={t('gallery.next')}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnails strip at bottom */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-2 bg-black/30 backdrop-blur-md rounded-full">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`shrink-0 w-12 h-8 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  i === index
                    ? "border-white scale-110 shadow-lg"
                    : "border-transparent opacity-50 hover:opacity-80 hover:border-white/40"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
