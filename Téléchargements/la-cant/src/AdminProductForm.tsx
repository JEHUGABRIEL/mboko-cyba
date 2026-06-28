import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Product } from "./data";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  features: string[];
  specs: { key: string; value: string }[];
  inStock: boolean;
  isNew: boolean;
}

const CATEGORIES = ["Réseau", "Sécurité", "Énergie", "Téléphonie", "Informatique"];

function emptyForm(product?: Product): ProductFormData {
  if (product) {
    return {
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      images: product.images,
      category: product.category,
      features: product.features,
      specs: Object.entries(product.specs).map(([key, value]) => ({
        key,
        value,
      })),
      inStock: product.inStock,
      isNew: product.isNew ?? false,
    };
  }
  return {
    name: "",
    description: "",
    price: "",
    image: "",
    images: [""],
    category: "Réseau",
    features: [""],
    specs: [{ key: "", value: "" }],
    inStock: true,
    isNew: false,
  };
}

interface AdminProductFormProps {
  product?: Product;
  onSave: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}

export function AdminProductForm({
  product,
  onSave,
  onCancel,
}: AdminProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(() => emptyForm(product));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.description.trim())
      errs.description = "La description est requise";
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Prix invalide";
    if (!form.image.trim()) errs.image = "L'URL de l'image principale est requise";
    const validImages = form.images.filter((u) => u.trim());
    if (validImages.length === 0) errs.images = "Au moins une image est requise";
    const validFeatures = form.features.filter((f) => f.trim());
    if (validFeatures.length === 0) errs.features = "Au moins une caractéristique est requise";
    const validSpecs = form.specs.filter((s) => s.key.trim() && s.value.trim());
    if (validSpecs.length === 0) errs.specs = "Au moins une spécification est requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const validImages = form.images.filter((u) => u.trim());
    const validFeatures = form.features.filter((f) => f.trim());
    const validSpecs = form.specs.filter((s) => s.key.trim() && s.value.trim());

    const specs: Record<string, string> = {};
    validSpecs.forEach((s) => {
      specs[s.key.trim()] = s.value.trim();
    });

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      images: validImages.map((u) => u.trim()),
      category: form.category,
      features: validFeatures.map((f) => f.trim()),
      specs,
      inStock: form.inStock,
      isNew: form.isNew,
    });
  };

  const addArrayItem = (key: "images" | "features" | "specs") => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "specs"
          ? [...prev.specs, { key: "", value: "" }]
          : [...(prev as any)[key], ""],
    }));
  };

  const removeArrayItem = (key: "images" | "features" | "specs", idx: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: (prev as any)[key].filter((_: any, i: number) => i !== idx),
    }));
  };

  const updateArrayItem = (
    key: "images" | "features",
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[idx] = value;
      return { ...prev, [key]: arr };
    });
  };

  const updateSpecItem = (
    idx: number,
    field: "key" | "value",
    value: string
  ) => {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[idx] = { ...specs[idx], [field]: value };
      return { ...prev, specs };
    });
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const errorCls = "border-red-400 focus:ring-red-500/20 focus:border-red-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {product ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nom du produit</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`${inputCls} ${errors.name ? errorCls : ""}`}
                placeholder="Ex: Routeur Professionnel Cisco ISR 1100"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={`${inputCls} min-h-[80px] resize-y ${
                  errors.description ? errorCls : ""
                }`}
                placeholder="Description du produit..."
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Prix (FCFA)</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={`${inputCls} ${errors.price ? errorCls : ""}`}
                placeholder="Ex: 850000"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Nouveau toggles */}
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateField("inStock", !form.inStock)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.inStock ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.inStock ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {form.inStock ? "En stock" : "Rupture de stock"}
              </span>
            </label>
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateField("isNew", !form.isNew)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.isNew ? "bg-amber-400" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.isNew ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {form.isNew ? "Marqué Nouveau" : "Nouveauté"}
              </span>
            </label>
          </div>

          {/* Main Image */}
          <div>
            <label className={labelCls}>URL image principale</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className={`${inputCls} ${errors.image ? errorCls : ""}`}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="Prévisualisation"
                className="mt-2 h-20 rounded-lg object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className={labelCls}>Images additionnelles</label>
            {errors.images && (
              <p className="text-xs text-red-500 mb-2">{errors.images}</p>
            )}
            <div className="space-y-2">
              {form.images.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateArrayItem("images", idx, e.target.value)}
                    className={`${inputCls} flex-1`}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem("images")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une image
            </button>
          </div>

          {/* Features */}
          <div>
            <label className={labelCls}>Caractéristiques</label>
            {errors.features && (
              <p className="text-xs text-red-500 mb-2">{errors.features}</p>
            )}
            <div className="space-y-2">
              {form.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      updateArrayItem("features", idx, e.target.value)
                    }
                    className={`${inputCls} flex-1`}
                    placeholder="Ex: Pare-feu intégré..."
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("features", idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem("features")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une caractéristique
            </button>
          </div>

          {/* Specs */}
          <div>
            <label className={labelCls}>Spécifications techniques</label>
            {errors.specs && (
              <p className="text-xs text-red-500 mb-2">{errors.specs}</p>
            )}
            <div className="space-y-2">
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecItem(idx, "key", e.target.value)
                      }
                      className={inputCls}
                      placeholder="Nom (ex: Débit maximal)"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecItem(idx, "value", e.target.value)
                      }
                      className={inputCls}
                      placeholder="Valeur (ex: 1 Gbps)"
                    />
                  </div>
                  {form.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("specs", idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem("specs")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une spécification
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
            >
              {product ? "Enregistrer" : "Créer le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
