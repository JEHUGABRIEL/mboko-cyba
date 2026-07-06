import { useState, useRef } from "react";
import { Upload, X, Loader2, Link } from "lucide-react";

const CLOUD_NAME = "dwmrzp61c";
const UPLOAD_PRESET = "liam-groupe";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function AdminImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "liam-groupe");

      const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (data.secure_url) {
        const url = data.secure_url;
        setPreview(url);
        onChange(url);
      } else {
        alert("Erreur d'upload : " + (data.error?.message || "Inconnue"));
      }
    } catch (err) {
      alert("Erreur réseau : " + err.message);
    }

    setUploading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  const handlePaste = () => {
    const url = prompt("Collez l'URL de l'image :");
    if (url) {
      setPreview(url);
      onChange(url);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-40 object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="Supprimer l'image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-sm text-gray-500">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                Cliquez ou glissez-déposez une image
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP — max 10 Mo</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL input (caché mais utile pour copier l'URL) */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="url"
            value={preview}
            onChange={(e) => {
              setPreview(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="URL de l'image..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handlePaste}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
          title="Coller une URL"
        >
          URL
        </button>
      </div>
    </div>
  );
}
