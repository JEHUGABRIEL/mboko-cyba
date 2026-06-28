import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Package,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { useProducts } from "./ProductsContext";
import { useCart } from "./CartContext";

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " FCFA";
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, setIsOpen, items } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Produit non trouvé
          </h1>
          <p className="text-slate-500 mb-8">
            Le produit que vous recherchez n'existe pas ou a été retiré.
          </p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const cartItem = items.find((item) => item.product.id === product.id);
  const totalInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link
              to="/boutique"
              className="hover:text-blue-600 transition-colors"
            >
              Boutique
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Stock badge */}
              <div className="absolute top-4 left-4">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-200">
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (prev) =>
                          (prev - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600 transition-all shadow opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (prev) => (prev + 1) % product.images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600 transition-all shadow opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === selectedImage
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category & Name */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-md mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">(12 avis)</span>
            </div>

            {/* Price */}
            <div className="border-y border-slate-100 py-6">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-slate-400 mb-1">TTC</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                Caractéristiques principales
              </h3>
              <ul className="space-y-2.5">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Quantité
                </span>
                <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-md"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Ajouté au panier !
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Acheter maintenant
                </button>
              </div>

              {totalInCart > 0 && (
                <p className="text-center text-sm text-green-600 font-medium">
                  {totalInCart} article{totalInCart > 1 ? "s" : ""} déjà dans
                  votre panier
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Garantie incluse
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {product.specs["Garantie"] || "Voir détails"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Livraison</p>
                  <p className="text-[10px] text-slate-500">
                    Bangui & provinces
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                <RotateCcw className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Retour possible
                  </p>
                  <p className="text-[10px] text-slate-500">Sous 14 jours</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-slate-100">
                <Headphones className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Support</p>
                  <p className="text-[10px] text-slate-500">
                    Assistance technique
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Fiche technique
              </h2>
              <p className="text-sm text-slate-500">
                Spécifications détaillées du{" "}
                {product.name.toLowerCase()}
              </p>
            </div>
            <div className="border-t border-slate-100">
              {Object.entries(product.specs).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`flex items-center px-8 py-4 ${
                    idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <span className="w-1/2 text-sm font-medium text-slate-700">
                    {key}
                  </span>
                  <span className="w-1/2 text-sm text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-8">
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(
                (p) =>
                  p.category === product.category && p.id !== product.id
              )
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.id}
                  to={`/boutique/${related.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">
                      {related.name}
                    </h3>
                    <p className="text-blue-600 font-bold">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
