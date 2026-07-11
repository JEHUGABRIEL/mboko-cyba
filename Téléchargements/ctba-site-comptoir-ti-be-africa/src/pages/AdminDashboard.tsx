import { useState, useEffect } from 'react';
import { useSiteData, type Product, type Project, type Testimonial } from '../context/SiteContext';
import {
  Settings,
  Package,
  Briefcase,
  MessageSquare,
  LayoutGrid,
  Moon,
  Sun,
  FileText,
  Phone,
  Image,
  Mail,
  Home,
  BookOpen,
  Clock,
  List,
  Plus,
  Inbox,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { TestimonialFormModal } from '../components/TestimonialFormModal';
import { ToastContainer } from '../components/Toast';
import { showToast } from '../components/toastUtils';
import { LogoIcon } from '../components/Logo';
import { AdminSidebar, type TabItem } from '../components/AdminSidebar';
import { AdminLoginForm } from '../components/AdminLoginForm';
import { AdminPagesEditor } from '../components/AdminPagesEditor';
import { AdminSettingsForm } from '../components/AdminSettingsForm';
import { AdminProductsSection } from '../components/AdminProductsSection';
import { AdminProjectsSection } from '../components/AdminProjectsSection';
import { AdminTestimonialsSection } from '../components/AdminTestimonialsSection';
import { AdminContactMessagesSection } from '../components/AdminContactMessagesSection';

const AUTH_KEY = 'ctba_admin_auth';

type ConfirmAction = {
  type: 'delete-product' | 'delete-project' | 'delete-testimonial' | 'logout';
  id?: string;
  label?: string;
} | null;

const tabs: TabItem[] = [
  { id: 'overview', name: "Vue d'ensemble", icon: <LayoutGrid size={20} /> },
  { id: 'products', name: 'Boutique', icon: <Package size={20} />,
    subTabs: [
      { id: 'products-list', name: 'Tous les produits', icon: <List size={16} /> },
      { id: 'products-add', name: 'Ajouter', icon: <Plus size={16} /> },
    ],
  },
  { id: 'projects', name: 'Réalisations', icon: <Briefcase size={20} />,
    subTabs: [
      { id: 'projects-list', name: 'Tous les projets', icon: <List size={16} /> },
      { id: 'projects-add', name: 'Ajouter', icon: <Plus size={16} /> },
    ],
  },
  { id: 'testimonials', name: 'Témoignages', icon: <MessageSquare size={20} />,
    subTabs: [
      { id: 'testimonials-list', name: 'Tous les témoignages', icon: <List size={16} /> },
      { id: 'testimonials-add', name: 'Ajouter', icon: <Plus size={16} /> },
    ],
  },
  { id: 'messages', name: 'Messages', icon: <Mail size={20} />,
    subTabs: [
      { id: 'messages-list', name: 'Boîte de réception', icon: <Inbox size={16} /> },
    ],
  },
  { id: 'pages', name: 'Pages', icon: <FileText size={20} />,
    subTabs: [
      { id: 'pages-home', name: 'Accueil', icon: <Home size={16} /> },
      { id: 'pages-services', name: 'Services', icon: <BookOpen size={16} /> },
      { id: 'pages-contact', name: 'Contact', icon: <Clock size={16} /> },
    ],
  },
  { id: 'settings', name: 'Paramètres', icon: <Settings size={20} />,
    subTabs: [
      { id: 'coordinates', name: 'Coordonnées', icon: <Phone size={16} /> },
      { id: 'hero', name: 'Textes Hero', icon: <Image size={16} /> },
    ],
  },
];

/** Sous-titres pour la barre du haut */
const SUBTAB_LABELS: Record<string, string> = {
  'products-list': 'Liste des produits',
  'products-add': 'Ajouter un produit',
  'projects-list': 'Liste des projets',
  'projects-add': 'Ajouter un projet',
  'testimonials-list': 'Liste des témoignages',
  'testimonials-add': 'Ajouter un témoignage',
  'messages-list': 'Boîte de réception',
  'pages-home': 'Page d\'accueil',
  'pages-services': 'Page des services',
  'pages-contact': 'Page de contact',
  coordinates: 'Coordonnées',
  hero: 'Textes Hero',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

export function AdminDashboard() {
  const {
    products,
    projects,
    testimonials,
    settings,
    services,
    pageContent,
    updatePageContent,
    updateSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useSiteData();

  // Auth state
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');

  // App state
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    products: true,
    projects: true,
    testimonials: true,
    messages: true,
    pages: true,
    settings: true,
  });
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ctba_admin_dark') === 'true');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.add('theme-transition');
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('ctba_admin_dark', String(!isDark));
    setIsDark(!isDark);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Écouter l'événement auth:expired (dispatché par api-client.ts)
  useEffect(() => {
    const onAuthExpired = () => setIsAuth(false);
    window.addEventListener('auth:expired', onAuthExpired);
    return () => window.removeEventListener('auth:expired', onAuthExpired);
  }, []);

  // Search & pagination state
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(0);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectPage, setProjectPage] = useState(0);
  const [testimonialSearch, setTestimonialSearch] = useState('');
  const [testimonialPage, setTestimonialPage] = useState(0);
  const ITEMS_PER_PAGE_TABLE = 8;
  const ITEMS_PER_PAGE_CARDS = 6;

  // Handlers
  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem(AUTH_KEY);
    setConfirmAction(null);
    showToast('Déconnexion réussie');
  };

  const handleProductFormSave = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(product.id, product);
        showToast('Produit modifié avec succès');
      } else {
        await addProduct(product);
        showToast('Produit ajouté avec succès');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de synchroniser le produit avec la base de données'), 'error');
    }
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async () => {
    try {
      if (confirmAction?.type === 'delete-product' && confirmAction.id) {
        await deleteProduct(confirmAction.id);
        showToast('Produit supprimé avec succès');
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de supprimer le produit côté serveur'), 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleProjectFormSave = async (project: Project) => {
    try {
      if (editingProject) {
        await updateProject(project.id, project);
        showToast('Réalisation modifiée avec succès');
      } else {
        await addProject(project);
        showToast('Réalisation ajoutée avec succès');
      }
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de synchroniser la réalisation avec la base de données'), 'error');
    }
  };

  const handleProjectFormClose = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async () => {
    try {
      if (confirmAction?.type === 'delete-project' && confirmAction.id) {
        await deleteProject(confirmAction.id);
        showToast('Réalisation supprimée avec succès');
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de supprimer la réalisation côté serveur'), 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleTestimonialFormSave = async (testimonial: Testimonial) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial(testimonial.id, testimonial);
        showToast('Témoignage modifié avec succès');
      } else {
        await addTestimonial(testimonial);
        showToast('Témoignage ajouté avec succès');
      }
      setShowTestimonialForm(false);
      setEditingTestimonial(null);
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de synchroniser le témoignage avec la base de données'), 'error');
    }
  };

  const handleTestimonialFormClose = () => {
    setShowTestimonialForm(false);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = async () => {
    try {
      if (confirmAction?.type === 'delete-testimonial' && confirmAction.id) {
        await deleteTestimonial(confirmAction.id);
        showToast('Témoignage supprimé avec succès');
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de supprimer le témoignage côté serveur'), 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleSettingsSave = async (updated: Partial<typeof settings>) => {
    try {
      await updateSettings(updated);
      showToast('Paramètres enregistrés avec succès');
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de synchroniser les paramètres avec la base de données'), 'error');
    }
  };

  const handlePageContentSave = async (content: typeof pageContent) => {
    try {
      await updatePageContent(content);
      showToast('Contenu des pages enregistré avec succès');
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Impossible de synchroniser le contenu des pages avec la base de données'), 'error');
    }
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const handleSubTabChange = (parentId: string, subId: string) => {
    setActiveSubTab(subId);
    setActiveTab(parentId);
    // Actions automatiques selon le sous-menu
    if (subId === 'products-add') { setShowProductForm(true); }
    if (subId === 'projects-add') { setShowProjectForm(true); }
    if (subId === 'testimonials-add') { setShowTestimonialForm(true); }
  };

  const handleToggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /** Titre affiché dans la barre du haut */
  const headerTitle = activeSubTab
    ? SUBTAB_LABELS[activeSubTab] || activeSubTab
    : activeTab === 'overview' ? "Tableau de bord"
    : tabs.find((t) => t.id === activeTab)?.name || activeTab;

  // Not authenticated
  if (!isAuth) {
    return <AdminLoginForm onLoginSuccess={() => setIsAuth(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* ===== Navbar ===== */}
      <header className="bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LayoutGrid size={20} />
              </button>
              <div className="flex items-center gap-3">
                <LogoIcon className="w-8 h-8" />
                <div className="hidden sm:block">
                  <h1 className="text-base font-bold text-white leading-tight">CTBA</h1>
                  <p className="text-xs text-brand-100 leading-tight">Administration</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium text-white/90 bg-white/15 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {headerTitle}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="text-sm font-medium text-white/80">Administration</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Layout: Sidebar + Content ===== */}
      <div className="flex">
        <AdminSidebar
          tabs={tabs}
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          expandedSections={expandedSections}
          sidebarOpen={sidebarOpen}
          onTabChange={handleTabChange}
          onSubTabChange={handleSubTabChange}
          onToggleSection={handleToggleSection}
          onLogoutClick={() => setConfirmAction({ type: 'logout' })}
          onSidebarClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto" key={`${activeTab}-${activeSubTab}`}>
            <div className="animate-tab-in">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Tableau de bord</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-700 dark:text-slate-200">Produits</h3>
                      <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 rounded-lg flex items-center justify-center">
                        <Package size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-700 dark:text-slate-200">Réalisations</h3>
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-700 dark:text-slate-200">Témoignages</h3>
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg flex items-center justify-center">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{testimonials.length}</p>
                  </div>
                </div>
                <div className="mt-8 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl p-6">
                  <h3 className="text-brand-800 dark:text-brand-200 font-bold mb-2">Information</h3>
                  <p className="text-brand-700 dark:text-brand-300">
                    Ceci est une interface d'administration simplifiée. Les modifications effectuées ici sont sauvegardées dans le
                    navigateur (localStorage) et se reflètent immédiatement sur le site public.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <AdminProductsSection
                products={products}
                search={productSearch}
                page={productPage}
                itemsPerPage={ITEMS_PER_PAGE_TABLE}
                onSearchChange={setProductSearch}
                onPageChange={setProductPage}
                onAdd={() => setShowProductForm(true)}
                onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                onDelete={(id, label) => setConfirmAction({ type: 'delete-product', id, label })}
                onReorder={reorderProducts}
              />
            )}

            {activeTab === 'projects' && (
              <AdminProjectsSection
                projects={projects}
                search={projectSearch}
                page={projectPage}
                itemsPerPage={ITEMS_PER_PAGE_TABLE}
                onSearchChange={setProjectSearch}
                onPageChange={setProjectPage}
                onAdd={() => setShowProjectForm(true)}
                onEdit={(p) => { setEditingProject(p); setShowProjectForm(true); }}
                onDelete={(id, label) => setConfirmAction({ type: 'delete-project', id, label })}
                onReorder={reorderProjects}
              />
            )}

            {activeTab === 'testimonials' && (
              <AdminTestimonialsSection
                testimonials={testimonials}
                search={testimonialSearch}
                page={testimonialPage}
                itemsPerPage={ITEMS_PER_PAGE_CARDS}
                onSearchChange={setTestimonialSearch}
                onPageChange={setTestimonialPage}
                onAdd={() => setShowTestimonialForm(true)}
                onEdit={(t) => { setEditingTestimonial(t); setShowTestimonialForm(true); }}
                onDelete={(id, label) => setConfirmAction({ type: 'delete-testimonial', id, label })}
              />
            )}

            {activeTab === 'messages' && (
              <AdminContactMessagesSection />
            )}

            {activeTab === 'pages' && (
              <AdminPagesEditor
                pageContent={pageContent}
                onSave={handlePageContentSave}
                section={activeSubTab}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsForm
                settings={settings}
                settingsSubTab={activeSubTab as 'coordinates' | 'hero' | null}
                onSave={handleSettingsSave}
              />
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal isOpen={showProductForm} onClose={handleProductFormClose} onSave={handleProductFormSave} editProduct={editingProduct} />
      <ProjectFormModal isOpen={showProjectForm} onClose={handleProjectFormClose} onSave={handleProjectFormSave} editProject={editingProject} services={services} />
      <TestimonialFormModal isOpen={showTestimonialForm} onClose={handleTestimonialFormClose} onSave={handleTestimonialFormSave} editTestimonial={editingTestimonial} />
      <ToastContainer />

      <ConfirmModal isOpen={confirmAction?.type === 'delete-product'} title="Supprimer le produit" message={`Êtes-vous sûr de vouloir supprimer "${confirmAction?.label ?? 'ce produit'}" ? Cette action est irréversible.`} confirmLabel="Supprimer" cancelLabel="Annuler" variant="danger" onConfirm={handleDeleteProduct} onCancel={() => setConfirmAction(null)} />
      <ConfirmModal isOpen={confirmAction?.type === 'delete-project'} title="Supprimer la réalisation" message={`Êtes-vous sûr de vouloir supprimer "${confirmAction?.label ?? 'cette réalisation'}" ? Cette action est irréversible.`} confirmLabel="Supprimer" cancelLabel="Annuler" variant="danger" onConfirm={handleDeleteProject} onCancel={() => setConfirmAction(null)} />
      <ConfirmModal isOpen={confirmAction?.type === 'delete-testimonial'} title="Supprimer le témoignage" message={`Êtes-vous sûr de vouloir supprimer le témoignage de "${confirmAction?.label ?? 'ce client'}" ? Cette action est irréversible.`} confirmLabel="Supprimer" cancelLabel="Annuler" variant="danger" onConfirm={handleDeleteTestimonial} onCancel={() => setConfirmAction(null)} />
      <ConfirmModal isOpen={confirmAction?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter de l'interface d'administration ?" confirmLabel="Se déconnecter" cancelLabel="Annuler" variant="danger" onConfirm={handleLogout} onCancel={() => setConfirmAction(null)} />
    </div>
  );
}
