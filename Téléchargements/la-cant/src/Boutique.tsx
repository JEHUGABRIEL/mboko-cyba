import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Search,
  ArrowLeft,
  Trash2,
  Package,
  CreditCard,
  Eye,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { type Product } from "./data";

const BOUTIQUE_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Équipements Professionnels",
    subtitle:
      "Matériel réseau, sécurité, énergie et téléphonie pour vos infrastructures.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Solutions Réseau & Fibre",
    subtitle:
      "Routeurs, switches, points d'accès WiFi 6 et câblage structuré pour entreprises.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: " Énergie Solaire & Sécurité",
    subtitle:
      "Kits solaires, onduleurs, caméras de surveillance et contrôle d'accès.",
  },
];
import { useProducts } from "./ProductsContext";
import { useCart } from "./CartContext";
import type { CartItem } from "./CartContext";
import { Footer } from "./Footer";

const CATEGORIES = ["Tous", "Réseau", "Sécurité", "Énergie", "Téléphonie", "Informatique"];

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " FCFA";
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-slate-200" />
      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Badges */}
        <div className="flex gap-1.5">
          <div className="h-5 w-16 bg-slate-200 rounded-md" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
        {/* Description */}
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
        </div>
        {/* Bottom row */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <div className="h-6 bg-slate-200 rounded w-24" />
          <div className="ml-auto flex gap-2">
            <div className="h-9 bg-slate-200 rounded-lg w-20" />
            <div className="h-9 bg-slate-200 rounded-lg w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group flex flex-col">
      {/* Image (cliquable) */}
      <Link to={`/boutique/${product.id}`} className="block aspect-[4/3] bg-slate-100 overflow-hidden relative">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded-md">
            {product.category}
          </span>
          {product.isNew && (
            <span className="text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Nouveau
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/boutique/${product.id}`} className="group/title">
          <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 leading-snug group-hover/title:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xl font-bold text-blue-600 flex-1">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/boutique/${product.id}`}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Détails
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, clearCart } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Votre panier</h2>
            <span className="text-sm text-slate-500">
              ({items.length} article{items.length > 1 ? "s" : ""})
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">Votre panier est vide</p>
              <p className="text-sm text-slate-400 mt-1">
                Ajoutez des produits depuis la boutique
              </p>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                {/* Mini image */}
                <div className="w-20 h-20 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1 rounded border border-slate-300 text-slate-500 hover:bg-slate-200 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1 rounded border border-slate-300 text-slate-500 hover:bg-slate-200 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-slate-600">Sous-total</span>
              <span className="font-bold text-slate-900 text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm">
              <CreditCard className="w-5 h-5" />
              Commander
            </button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-slate-400 hover:text-red-500 transition-colors py-2"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Boutique({ onOpenContact }: { onOpenContact?: () => void }) {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(() => {
    const catFromUrl = searchParams.get("cat");
    return catFromUrl && CATEGORIES.includes(catFromUrl) ? catFromUrl : "Tous";
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const { addItem, setIsOpen, totalItems } = useCart();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const SORT_OPTIONS = [
    { value: "default", label: "Par défaut" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name-asc", label: "Nom A → Z" },
    { value: "name-desc", label: "Nom Z → A" },
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory = category === "Tous" || p.category === category;
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return result;
  }, [products, category, search, sort]);

  // Slider state
  const [slideIndex, setSlideIndex] = useState(0);
  const slideLen = BOUTIQUE_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => ((prev + 1) % slideLen + slideLen) % slideLen);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideLen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Boutique Hero Slider */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Slides avec transition */}
        {BOUTIQUE_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: idx === slideIndex ? 1 : 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-900/95 z-10" />
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </a>
              <div className="overflow-hidden">
                <h1
                  key={`t-${slideIndex}`}
                  className="text-3xl md:text-4xl font-extrabold text-white mb-2 animate-fadeInUp"
                >
                  {BOUTIQUE_SLIDES[slideIndex].title}
                </h1>
              </div>
              <div className="overflow-hidden">
                <p
                  key={`s-${slideIndex}`}
                  className="text-blue-100 text-lg max-w-xl animate-fadeInUp"
                  style={{ animationDelay: "0.1s" }}
                >
                  {BOUTIQUE_SLIDES[slideIndex].subtitle}
                </p>
              </div>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative bg-white/10 hover:bg-white/20 text-white border border-white/20 p-3.5 rounded-xl transition-all flex-shrink-0 ml-4"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-blue-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Indicateurs (dots) */}
          <div className="flex gap-2 mt-8">
            {BOUTIQUE_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === slideIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nouveautés */}
      {products.some((p) => p.isNew) && (
        <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-900" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Nouveautés
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.isNew)
                .slice(0, 3)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addItem}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1">
              {/* Category pills */}
              <div className="flex gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      category === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Trier"}
                </button>
                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSortOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-slate-200 shadow-lg py-1 min-w-[160px]">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value);
                            setSortOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            sort === opt.value
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            key={`empty-${category}`}
            className="text-center py-20 animate-fadeIn"
          >
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">
              Aucun produit trouvé
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        ) : (
          <div
            key={`grid-${category}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Devis */}
      <section className="py-16 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-700 rounded-full opacity-50 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Besoin d'un devis personnalisé ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Nos experts étudient votre projet et vous établissent un devis
            gratuit sous 24 à 48 heures.
          </p>
          <button
            onClick={() => onOpenContact?.()}
            className="bg-white text-blue-600 px-8 py-4 rounded-md font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg"
          >
            Demander un devis
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer variant="boutique" />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
