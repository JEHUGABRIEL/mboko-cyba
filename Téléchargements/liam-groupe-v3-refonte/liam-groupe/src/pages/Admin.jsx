import { useState, useEffect, useCallback, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, X } from "lucide-react";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminContentManager from "../components/admin/AdminContentManager";
import AdminSiteSettings from "../components/admin/AdminSiteSettings";
import useFocusTrap from "../hooks/useFocusTrap";

export default function Admin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("liam-admin-authenticated");
    if (stored === "true") {
      startTransition(() => {
        setAuthenticated(true);
      });
    }
  }, []);

  const startCloseAnimation = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      setClosing(false);
    }, 300);
  }, [closing]);

  const cancelLogout = useCallback(() => {
    if (closing) return;
    startCloseAnimation();
  }, [closing, startCloseAnimation]);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!showLogoutModal) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") cancelLogout();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showLogoutModal, cancelLogout]);

  const logoutModalRef = useFocusTrap(showLogoutModal);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const handleLogout = () => {
    setShowLogoutModal(true);
    setClosing(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("liam-admin-authenticated");
    setAuthenticated(false);
    setShowLogoutModal(false);
  };

  const handleNavigate = (s) => {
    setSection(s);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={section}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-lg">
            LIAM<span className="text-brand-500">.</span>
            <span className="text-gray-400 text-xs font-medium ml-1.5">Admin</span>
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {section === "dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
          {["domains", "events", "news", "team", "partners", "testimonials"].includes(section) && (
            <AdminContentManager table={section} />
          )}
          {section === "settings" && <AdminSiteSettings />}
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop avec animation d'apparition / disparition */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-md ${closing ? "animate-fade-out" : "animate-fade-in"}`}
            onClick={cancelLogout}
          />
          <div
            ref={logoutModalRef}
            className={`relative bg-gradient-to-b from-[#1a0a2e] to-[#0f001d] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 ${closing ? "animate-scale-out" : "animate-scale-in"}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            {/* Close button */}
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & text */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <h3
                id="logout-modal-title"
                className="text-lg font-bold text-white"
              >
                Déconnexion
              </h3>
              <p className="text-white/50 text-sm mt-1.5 max-w-[250px] leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter de l'interface d'administration ?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] hover:border-white/[0.12] transition-all active:scale-[0.98]"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all active:scale-[0.98]"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


