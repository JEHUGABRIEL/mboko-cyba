import { Upload } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUpload: (url: string) => void;
  label?: string;
  multiple?: boolean;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function CloudinaryUploader({ onUpload, label = 'Choisir une image', multiple = false }: CloudinaryUploaderProps) {
  const handleClick = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary Widget not loaded. Check the script in index.html.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dwmrzp61c',
        uploadPreset: 'ctba_upload',
        multiple,
        maxFiles: multiple ? 10 : 1,
        cropping: false,
        showAdvancedOptions: false,
        sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
        styles: {
          palette: {
            window: '#ffffff',
            sourceBg: '#f8fafc',
            windowBorder: '#e2e8f0',
            tabIcon: '#2563eb',
            inactiveTabIcon: '#94a3b8',
            menuIcons: '#64748b',
            link: '#2563eb',
            action: '#2563eb',
            inProgress: '#2563eb',
            complete: '#16a34a',
            error: '#dc2626',
            textDark: '#0f172a',
            textLight: '#ffffff',
          },
          fonts: { default: { active: true } },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const secureUrl = result.info.secure_url;
          if (multiple) {
            // For multiple uploads, we call onUpload for each
            onUpload(secureUrl);
          } else {
            onUpload(secureUrl);
          }
        }
      }
    );

    widget.open();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-lg hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all duration-200 ease-out group"
    >
      <Upload size={18} className="transition-transform duration-200 group-hover:scale-110" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
