import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product, useSiteData } from '../context/SiteContext';
import { ImageSlider } from './ImageSlider';
type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { settings } = useSiteData();

  if (!product) return null;

  const whatsappNumber = settings.contact.phone1.replace(/\s/g, '').replace('+', '');
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis int\u00e9ress\u00e9(e) par le produit : ${product.name} (${product.price})`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Détails du produit
              </h3>
              <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square">
                  <ImageSlider
                    images={product.images ?? [product.image]}
                    alt={product.name}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col">
                <div className="text-sm text-brand-600 font-semibold uppercase tracking-wider mb-2">
                  {product.category}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {product.name}
                </h2>

                <div className="text-3xl font-bold text-slate-900 mb-6">
                  {product.price}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Description
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description ||
                  'Aucune description disponible pour ce produit.'}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    {product.inStock ?
                  <>
                        <CheckCircle2 className="text-green-500" size={20} />
                        <span className="text-green-700 font-medium">
                          En stock
                        </span>
                      </> :

                  <>
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="text-red-700 font-medium">
                          Rupture de stock
                        </span>
                      </>
                  }
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href={product.inStock ? whatsappUrl : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-colors ${product.inStock ? 'bg-[#25D366] text-white hover:bg-[#1ebe5a]' : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'}`}
                    >
                      <WhatsAppIcon size={20} />
                      {product.inStock ? 'Contacter via WhatsApp' : 'Indisponible'}
                    </a>

                    <button
                      disabled={!product.inStock}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors border ${product.inStock ? 'border-brand-600 text-brand-600 hover:bg-brand-50' : 'border-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      <ShoppingCart size={18} />
                      {product.inStock ? 'Demander un devis' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </motion.div>
      }
    </AnimatePresence>);

}