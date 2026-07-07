import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteData, Product } from '../context/SiteContext';
import { HeroSlider } from '../components/HeroSlider';
import { ProductModal } from '../components/ProductModal';
import { OptimizedImage } from '../components/OptimizedImage';
export function Shop() {
  const { settings, products } = useSiteData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Extract unique categories
  const categories = [
  'Tous',
  ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.
    toLowerCase().
    includes(searchTerm.toLowerCase());
    const matchesCategory =
    selectedCategory === 'Tous' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <HeroSlider
        slides={settings.heroSlides.shop}
        bgImage="https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne" />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Filter size={20} /> Filtres
              </h3>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                  
                  <Search
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={18} />
                  
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">
                  Catégories
                </h4>
                <ul className="space-y-2">
                  {categories.map((cat, idx) =>
                  <li key={idx}>
                      <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === cat ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                      
                        {cat}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-600">
                Affichage de {filteredProducts.length} produit(s)
              </p>
            </div>

            {filteredProducts.length > 0 ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) =>
              <motion.div
                key={product.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer flex flex-col"
                onClick={() => openProductModal(product)}>
                
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    wrapperClassName="w-full h-full" />
                  
                      {!product.inStock &&
                  <div className="absolute top-2 right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">
                          Rupture
                        </div>
                  }
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                        {product.category}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-xl font-bold text-brand-600 mb-4">
                        {product.price}
                      </div>

                      <div className="mt-auto pt-4 flex gap-2">
                        <span
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      
                          <Eye size={18} />
                          Détails
                        </span>
                      </div>
                    </div>
                  </motion.div>
              )}
              </div> :

            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
                <p className="text-slate-500 text-lg">
                  Aucun produit ne correspond à votre recherche.
                </p>
                <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tous');
                }}
                className="mt-4 text-brand-600 font-medium hover:underline">
                
                  Réinitialiser les filtres
                </button>
              </div>
            }

            {/* Note */}
            <div className="mt-12 bg-brand-50 border border-brand-100 rounded-xl p-6 text-center">
              <p className="text-brand-800">
                <strong>Note :</strong> Les prix sont donnés à titre indicatif
                et peuvent varier. Pour toute commande ou demande de devis
                précis, veuillez nous contacter directement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
            Contactez notre équipe d'experts dès aujourd'hui pour discuter de
            vos besoins et obtenir un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`tel:${settings.contact.phone1.replace(/\s/g, '')}`}
              className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-brand-600 bg-white hover:bg-slate-50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-lg">
              
              Appeler le {settings.contact.phone1}
            </a>
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-md text-white hover:bg-brand-800 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
              
              Nous écrire
            </Link>
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} />
      
    </div>);

}
