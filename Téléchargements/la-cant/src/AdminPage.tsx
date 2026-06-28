import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Images,
  MessageSquare,
  Handshake,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  Layers,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowLeft,
  LogOut,
  Star,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  Bell,
  Shield,
  FileText,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductsContext";
import { useSite } from "./SiteContext";
import { useToast } from "./ToastContext";
import { AdminProductForm } from "./AdminProductForm";
import type { Product, HeroSlide, Testimonial, Partner } from "./data";

// ===== Navigation items =====
type Section =
  | "dashboard"
  | "products"
  | "slides"
  | "testimonials"
  | "partners"
  | "quotes"
  | "settings";

const NAV_ITEMS: { id: Section; label: string; icon: typeof Package }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "quotes", label: "Devis", icon: FileText },
  { id: "slides", label: "Slides", icon: Images },
  { id: "testimonials", label: "Témoignages", icon: MessageSquare },
  { id: "partners", label: "Partenaires", icon: Handshake },
  { id: "settings", label: "Réglages", icon: Settings },
];

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " FCFA";
}

const inputCls =
  "w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

// ===== Delete Confirm Modal =====
function DeleteConfirm({
  title,
  name,
  onConfirm,
  onCancel,
}: {
  title: string;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Cette action est irréversible.
            </p>
          </div>
        </div>
        <p className="text-slate-600 mb-6">
          Êtes-vous sûr de vouloir supprimer{" "}
          <strong className="text-slate-900">{name}</strong> ?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// SECTION: Products
// ==============================================================
function ProductsSection() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (undoRef.current) clearTimeout(undoRef.current); };
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const handleSave = (data: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      showToast("Produit modifié avec succès", "success");
    } else {
      addProduct(data);
      showToast("Produit ajouté avec succès", "success");
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Produits</h2>
        <button
          onClick={() => { setEditingProduct(undefined); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Produit</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Prix</th>
                <th className="text-center px-5 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider hidden md:table-cell">Stock</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      {search ? "Aucun produit trouvé" : "Aucun produit dans le catalogue"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-block text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{product.category}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-slate-900">{formatPrice(product.price)}</td>
                    <td className="px-5 py-4 text-center hidden md:table-cell">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> En stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                          <XCircle className="w-3 h-3" /> Rupture
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeletingProduct(product)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          {search && ` (filtré sur ${products.length})`}
        </div>
      </div>

      {showForm && (
        <AdminProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(undefined); }}
        />
      )}
      {deletingProduct && (
        <DeleteConfirm
          title="Supprimer le produit"
          name={deletingProduct.name}
          onConfirm={() => {
            const savedId = deletingProduct.id;
            const savedName = deletingProduct.name;
            setDeletingProduct(undefined);
            if (undoRef.current) clearTimeout(undoRef.current);
            showToast(
              `Produit supprimé : ${savedName}`,
              "success",
              { label: "Annuler", onClick: () => { if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } } }
            );
            undoRef.current = setTimeout(() => { deleteProduct(savedId); undoRef.current = null; }, 6000);
          }}
          onCancel={() => setDeletingProduct(undefined)}
        />
      )}
    </div>
  );
}

// ==============================================================
// SECTION: Hero Slides
// ==============================================================
function SlidesSection() {
  const { heroSlides, updateHeroSlide, addHeroSlide, removeHeroSlide } = useSite();
  const { showToast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (undoRef.current) clearTimeout(undoRef.current); };
  }, []);

  const handleUpdate = (index: number, field: keyof HeroSlide, value: string) => {
    updateHeroSlide(index, { ...heroSlides[index], [field]: value });
  };

  const handleAdd = () => {
    addHeroSlide({
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      badge: "NOUVEAU",
      title: "Titre du slide",
      highlight: "mise en avant",
      subtitle: "Description du slide...",
    });
    showToast("Slide ajouté", "success");
  };

  const handleRemove = (index: number) => {
    if (heroSlides.length <= 1) return;
    if (editingIndex === index) setEditingIndex(null);
    if (undoRef.current) clearTimeout(undoRef.current);
    showToast("Slide supprimé", "success", {
      label: "Annuler",
      onClick: () => { if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } },
    });
    undoRef.current = setTimeout(() => { removeHeroSlide(index); undoRef.current = null; }, 6000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Slides du héros</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter un slide
        </button>
      </div>

      <div className="space-y-6">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Image preview + edit button */}
            <div className="relative">
              <div className="aspect-[21/9] bg-slate-100 overflow-hidden">
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                  <div className="text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 px-2.5 py-1 rounded-md">
                      {slide.badge}
                    </span>
                    <p className="text-lg font-bold mt-2">
                      {slide.title} <span className="text-blue-300">{slide.highlight}</span>
                    </p>
                  </div>
                </div>
              </div>

              {editingIndex === idx && (
                <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Image URL</label>
                      <input type="text" value={slide.image} onChange={(e) => handleUpdate(idx, "image", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Badge</label>
                      <input type="text" value={slide.badge} onChange={(e) => handleUpdate(idx, "badge", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Titre</label>
                      <input type="text" value={slide.title} onChange={(e) => handleUpdate(idx, "title", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Mot mis en avant</label>
                      <input type="text" value={slide.highlight} onChange={(e) => handleUpdate(idx, "highlight", e.target.value)} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Sous-titre</label>
                      <textarea value={slide.subtitle} onChange={(e) => handleUpdate(idx, "subtitle", e.target.value)} className={`${inputCls} min-h-[60px] resize-y`} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-slate-100">
              <span className="text-xs text-slate-400">Slide #{idx + 1}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    editingIndex === idx
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {editingIndex === idx ? "Fermer" : "Modifier"}
                </button>
                {heroSlides.length > 1 && (
                  <button
                    onClick={() => handleRemove(idx)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================
// SECTION: Testimonials
// ==============================================================
function TestimonialsSection() {
  const { testimonials, addTestimonial, updateTestimonial, removeTestimonial } = useSite();
  const { showToast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (undoRef.current) clearTimeout(undoRef.current); };
  }, []);

  const [form, setForm] = useState<Testimonial>({
    name: "",
    role: "",
    company: "",
    content: "",
    initials: "",
    rating: 5,
  });

  const openNew = () => {
    setForm({ name: "", role: "", company: "", content: "", initials: "", rating: 5 });
    setEditingIndex(-1);
  };

  const openEdit = (idx: number) => {
    setForm({ ...testimonials[idx] });
    setEditingIndex(idx);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) return;
    const initials = form.initials || form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const data = { ...form, initials };
    if (editingIndex === -1) {
      addTestimonial(data);
      showToast("Témoignage ajouté", "success");
    } else if (editingIndex !== null) {
      updateTestimonial(editingIndex, data);
      showToast("Témoignage modifié", "success");
    }
    setEditingIndex(null);
  };

  const handleRemove = (idx: number) => {
    if (editingIndex === idx) setEditingIndex(null);
    if (undoRef.current) clearTimeout(undoRef.current);
    showToast("Témoignage supprimé", "success", {
      label: "Annuler",
      onClick: () => { if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } },
    });
    undoRef.current = setTimeout(() => { removeTestimonial(idx); undoRef.current = null; }, 6000);
  };

  const isEditing = editingIndex !== null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Témoignages</h2>
        <button
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 space-y-4">
          <h3 className="font-bold text-slate-900">
            {editingIndex === -1 ? "Nouveau témoignage" : "Modifier le témoignage"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Initiales</label>
              <input type="text" value={form.initials} onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value }))} className={inputCls} placeholder="Auto si vide" />
            </div>
            <div>
              <label className={labelCls}>Rôle</label>
              <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Société</label>
              <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Contenu</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className={`${inputCls} min-h-[80px] resize-y`} />
            </div>
            <div>
              <label className={labelCls}>Note (1-5)</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setForm((f) => ({ ...f, rating: star }))}>
                    <Star className={`w-5 h-5 ${star <= form.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingIndex(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              Annuler
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}{t.company ? ` — ${t.company}` : ""}</p>
                <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{t.content}</p>
                <div className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(idx)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleRemove(idx)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================
// SECTION: Partners
// ==============================================================
function PartnersSection() {
  const { partners, addPartner, updatePartner, removePartner } = useSite();
  const { showToast } = useToast();
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (undoRef.current) clearTimeout(undoRef.current); };
  }, []);

  const [form, setForm] = useState<Partner>({ name: "", logo: "" });
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const openNew = () => {
    setForm({ name: "", logo: "" });
    setEditingIdx(-1);
  };

  const openEdit = (idx: number) => {
    setForm({ ...partners[idx] });
    setEditingIdx(idx);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.logo.trim()) return;
    if (editingIdx === -1) {
      addPartner({ ...form });
      showToast("Partenaire ajouté", "success");
    } else if (editingIdx !== null) {
      updatePartner(editingIdx, { ...form });
      showToast("Partenaire modifié", "success");
    }
    setEditingIdx(null);
  };

  const handleRemove = (idx: number) => {
    if (editingIdx === idx) setEditingIdx(null);
    if (undoRef.current) clearTimeout(undoRef.current);
    showToast("Partenaire supprimé", "success", {
      label: "Annuler",
      onClick: () => { if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } },
    });
    undoRef.current = setTimeout(() => { removePartner(idx); undoRef.current = null; }, 6000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Partenaires</h2>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {editingIdx !== null && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 space-y-4">
          <h3 className="font-bold text-slate-900">
            {editingIdx === -1 ? "Nouveau partenaire" : "Modifier le partenaire"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL du logo</label>
              <input type="text" value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} className={inputCls} />
            </div>
          </div>
          {form.logo && (
            <img src={form.logo} alt="" className="h-12 object-contain border border-slate-200 rounded-lg p-2" />
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingIdx(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all">Annuler</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {partners.map((p, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-3 relative group">
            <img src={p.logo} alt={p.name} className="h-12 object-contain" />
            <p className="text-sm font-medium text-slate-700 text-center">{p.name}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => openEdit(idx)} className="p-1.5 bg-white rounded-lg shadow text-slate-400 hover:text-blue-600 transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleRemove(idx)} className="p-1.5 bg-white rounded-lg shadow text-slate-400 hover:text-red-600 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================
// SECTION: Quotes
// ==============================================================
function QuotesSection() {
  const { quoteRequests, updateQuoteStatus, deleteQuoteRequest } = useSite();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (undoRef.current) clearTimeout(undoRef.current); };
  }, []);

  const filtered = useMemo(() => {
    return quoteRequests.filter((q) => {
      const matchSearch =
        search === "" ||
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.email.toLowerCase().includes(search.toLowerCase()) ||
        q.company.toLowerCase().includes(search.toLowerCase()) ||
        q.message.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quoteRequests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: quoteRequests.length,
      new: quoteRequests.filter((q) => q.status === "new").length,
      read: quoteRequests.filter((q) => q.status === "read").length,
      responded: quoteRequests.filter((q) => q.status === "responded").length,
    };
  }, [quoteRequests]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig: Record<string, { label: string; cls: string }> = {
    new: { label: "Nouveau", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    read: { label: "Lu", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    responded: { label: "Répondu", cls: "bg-green-50 text-green-700 border-green-200" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Demandes de devis</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-xs text-blue-500">Nouveaux</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{stats.read}</p>
          <p className="text-xs text-amber-500">Lus</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
          <p className="text-xs text-green-500">Répondus</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "read", "responded"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s === "all"
                ? "Tous"
                : s === "new"
                ? "Nouveaux"
                : s === "read"
                ? "Lus"
                : "Répondus"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucune demande de devis</p>
          <p className="text-slate-400 text-xs mt-1">
            {search
              ? "Essayez un autre terme de recherche"
              : "Les demandes soumises via la boutique apparaîtront ici"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                q.status === "new"
                  ? "border-blue-200 ring-1 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              {/* Header */}
              <div
                onClick={() => {
                  setExpandedId(expandedId === q.id ? null : q.id);
                  if (q.status === "new") updateQuoteStatus(q.id, "read");
                }}
                className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                      {q.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 text-sm">
                          {q.name}
                        </p>
                        {q.status === "new" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(q.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {q.email}
                        </span>
                        {q.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {q.phone}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                      expandedId === q.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === q.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">Société</span>
                      <p className="text-slate-700 font-medium">
                        {q.company || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Catégorie</span>
                      <p className="text-slate-700 font-medium">
                        {q.category || "Non spécifiée"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">
                      Description du besoin
                    </span>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                      {q.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      {(
                        [
                          ["new", "Nouveau"],
                          ["read", "Lu"],
                          ["responded", "Répondu"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => updateQuoteStatus(q.id, value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            q.status === value
                              ? statusConfig[value].cls
                              : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setConfirmDelete(q.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete !== null && (
        <DeleteConfirm
          title="Supprimer la demande"
          name={`devis #${confirmDelete}`}
          onConfirm={() => {
            const savedId = confirmDelete;
            setConfirmDelete(null);
            if (undoRef.current) clearTimeout(undoRef.current);
            showToast("Demande supprimée", "success", {
              label: "Annuler",
              onClick: () => { if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } },
            });
            undoRef.current = setTimeout(() => { deleteQuoteRequest(savedId); undoRef.current = null; }, 6000);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ==============================================================
// SECTION: Settings
// ==============================================================
function SettingsSection() {
  const { settings, updateSettings } = useSite();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (confirmPassword && confirmPassword !== settings.adminPassword) {
      updateSettings({ adminPassword: confirmPassword });
      setConfirmPassword("");
      showToast("Mot de passe changé avec succès", "info");
      return;
    }
    showToast("Paramètres enregistrés", "info");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">Réglages du site</h2>

      <div className="space-y-6">
        {/* Promo Banner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Bandeau promo</h3>
              <p className="text-xs text-slate-500">Configurer la promotion affichée en haut du site</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateSettings({ promoEnabled: !settings.promoEnabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.promoEnabled ? "bg-green-500" : "bg-slate-300"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.promoEnabled ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {settings.promoEnabled ? "Bandeau activé" : "Bandeau désactivé"}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Message promo</label>
                <input type="text" value={settings.promoMessage} onChange={(e) => updateSettings({ promoMessage: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Code promo</label>
                <input type="text" value={settings.promoCode} onChange={(e) => updateSettings({ promoCode: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Réduction affichée</label>
                <input type="text" value={settings.promoDiscount} onChange={(e) => updateSettings({ promoDiscount: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Password */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Mot de passe administrateur</h3>
              <p className="text-xs text-slate-500">Changer le mot de passe de connexion à l'administration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={settings.adminPassword}
                  onChange={(e) => updateSettings({ adminPassword: e.target.value })}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Nouveau mot de passe</label>
              <input
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputCls}
                placeholder="Laisser vide pour conserver"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Informations de contact</h3>
              <p className="text-xs text-slate-500">Modifier les coordonnées affichées sur le site</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={settings.contactEmail} onChange={(e) => updateSettings({ contactEmail: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Téléphone</label>
              <input type="text" value={settings.contactPhone} onChange={(e) => updateSettings({ contactPhone: e.target.value })} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Adresse</label>
              <input type="text" value={settings.contactAddress} onChange={(e) => updateSettings({ contactAddress: e.target.value })} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Enregistrer les réglages
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// MAIN: AdminPage
// ==============================================================
export function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { heroSlides, testimonials, partners, settings, quoteRequests } = useSite();
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Stats
  const stats = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    const inStock = products.filter((p) => p.inStock).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    return { total: products.length, categories: categories.size, inStock, totalValue };
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px] md:pt-20">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200" style={{ marginTop: settings.promoEnabled ? "40px" : 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Site
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-lg font-bold text-slate-900">Administration</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} />
            </button>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-56 flex-shrink-0 ${mobileNavOpen ? "block" : "hidden"} lg:block`}>
            <nav className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-28">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                    section === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${section === item.id ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Dashboard */}
            {section === "dashboard" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Package className="w-5 h-5" /></div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        <p className="text-xs text-slate-500">Produits</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><Layers className="w-5 h-5" /></div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                        <p className="text-xs text-slate-500">Catégories</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.inStock}</p>
                        <p className="text-xs text-slate-500">En stock</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><TrendingUp className="w-5 h-5" /></div>
                      <div>
                        <p className="text-xl font-bold text-slate-900">{formatPrice(stats.totalValue)}</p>
                        <p className="text-xs text-slate-500">Valeur totale</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button onClick={() => setSection("slides")} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors"><Images className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">{heroSlides.length}</p>
                        <p className="text-xs text-slate-500">Slides héros</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Gérer le slider de la page d'accueil</p>
                  </button>
                  <button onClick={() => setSection("testimonials")} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-colors"><MessageSquare className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">{testimonials.length}</p>
                        <p className="text-xs text-slate-500">Témoignages</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Gérer les avis clients</p>
                  </button>
                  <button onClick={() => setSection("partners")} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-100 transition-colors"><Handshake className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">{partners.length}</p>
                        <p className="text-xs text-slate-500">Partenaires</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Gérer les logos partenaires</p>
                  </button>
                  <button onClick={() => setSection("quotes")} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors"><FileText className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">{quoteRequests.filter((q) => q.status === "new").length}</p>
                        <p className="text-xs text-slate-500">Nouveaux devis</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Consulter les demandes</p>
                  </button>
                </div>
              </div>
            )}

            {section === "products" && <ProductsSection />}
            {section === "quotes" && <QuotesSection />}
            {section === "slides" && <SlidesSection />}
            {section === "testimonials" && <TestimonialsSection />}
            {section === "partners" && <PartnersSection />}
            {section === "settings" && <SettingsSection />}
          </main>
        </div>
      </div>
    </div>
  );
}
