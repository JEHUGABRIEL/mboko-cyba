import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  heroSlides as defaultHeroSlides,
  testimonials as defaultTestimonials,
  partners as defaultPartners,
  type HeroSlide,
  type Testimonial,
  type Partner,
} from "./data";

// ===== Types =====
export interface QuoteRequest {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  date: string;
  status: "new" | "read" | "responded";
}

export interface SiteSettings {
  promoEnabled: boolean;
  promoMessage: string;
  promoCode: string;
  promoDiscount: string;
  adminPassword: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

interface SiteContextType {
  // Hero slides
  heroSlides: HeroSlide[];
  updateHeroSlide: (index: number, slide: HeroSlide) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  removeHeroSlide: (index: number) => void;
  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (index: number, t: Testimonial) => void;
  removeTestimonial: (index: number) => void;
  // Partners
  partners: Partner[];
  addPartner: (p: Partner) => void;
  updatePartner: (index: number, p: Partner) => void;
  removePartner: (index: number) => void;
  // Settings
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => void;
  // Quote requests
  quoteRequests: QuoteRequest[];
  addQuoteRequest: (data: Omit<QuoteRequest, "id" | "date" | "status">) => void;
  updateQuoteStatus: (id: number, status: QuoteRequest["status"]) => void;
  deleteQuoteRequest: (id: number) => void;
}

const defaultSettings: SiteSettings = {
  promoEnabled: true,
  promoMessage: "-20% sur tout le câblage réseau",
  promoCode: "RESEAU20",
  promoDiscount: "-20%",
  adminPassword: "admin123",
  siteName: "LA CANT Technology Solutions",
  contactEmail: "contact@lacant.cf",
  contactPhone: "(+236) 75 29 89 84",
  contactAddress: "Avenue Boganda, Bangui",
};

const STORAGE_PREFIX = "lacant_";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) return parsed;
    }
  } catch {}
  return fallback;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() =>
    loadJSON("heroSlides", defaultHeroSlides)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    loadJSON("testimonials", defaultTestimonials)
  );
  const [partners, setPartners] = useState<Partner[]>(() =>
    loadJSON("partners", defaultPartners)
  );
  const [settings, setSettings] = useState<SiteSettings>(() =>
    loadJSON("settings", defaultSettings)
  );
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() =>
    loadJSON("quoteRequests", [])
  );

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "heroSlides", JSON.stringify(heroSlides));
  }, [heroSlides]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "testimonials", JSON.stringify(testimonials));
  }, [testimonials]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "partners", JSON.stringify(partners));
  }, [partners]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "settings", JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "quoteRequests", JSON.stringify(quoteRequests));
  }, [quoteRequests]);

  // Hero slides
  const updateHeroSlide = useCallback((index: number, slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      next[index] = slide;
      return next;
    });
  }, []);

  const addHeroSlide = useCallback((slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
  }, []);

  const removeHeroSlide = useCallback((index: number) => {
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Testimonials
  const addTestimonial = useCallback((t: Testimonial) => {
    setTestimonials((prev) => [...prev, t]);
  }, []);

  const updateTestimonial = useCallback((index: number, t: Testimonial) => {
    setTestimonials((prev) => {
      const next = [...prev];
      next[index] = t;
      return next;
    });
  }, []);

  const removeTestimonial = useCallback((index: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Partners
  const addPartner = useCallback((p: Partner) => {
    setPartners((prev) => [...prev, p]);
  }, []);

  const updatePartner = useCallback((index: number, p: Partner) => {
    setPartners((prev) => {
      const next = [...prev];
      next[index] = p;
      return next;
    });
  }, []);

  const removePartner = useCallback((index: number) => {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Settings
  const updateSettings = useCallback((s: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  // Quote requests
  const addQuoteRequest = useCallback(
    (data: Omit<QuoteRequest, "id" | "date" | "status">) => {
      setQuoteRequests((prev) => {
        const nextId =
          prev.length > 0 ? Math.max(...prev.map((q) => q.id)) + 1 : 1;
        return [
          {
            ...data,
            id: nextId,
            date: new Date().toISOString(),
            status: "new" as const,
          },
          ...prev,
        ];
      });
    },
    []
  );

  const updateQuoteStatus = useCallback(
    (id: number, status: QuoteRequest["status"]) => {
      setQuoteRequests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
    },
    []
  );

  const deleteQuoteRequest = useCallback((id: number) => {
    setQuoteRequests((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return (
    <SiteContext.Provider
      value={{
        heroSlides,
        updateHeroSlide,
        addHeroSlide,
        removeHeroSlide,
        testimonials,
        addTestimonial,
        updateTestimonial,
        removeTestimonial,
        partners,
        addPartner,
        updatePartner,
        removePartner,
        settings,
        updateSettings,
        quoteRequests,
        addQuoteRequest,
        updateQuoteStatus,
        deleteQuoteRequest,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextType {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
