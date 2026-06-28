import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "./AuthContext";

const LOGO_URL = "/image.png";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers l'admin si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simuler un délai de vérification
    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate("/admin", { replace: true });
      } else {
        setError("Mot de passe incorrect. Veuillez réessayer.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Bouton retour */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au site
        </Link>

        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/20 border border-slate-200 overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-white p-2 shadow-lg">
              <img
                src={LOGO_URL}
                alt="LA CANT"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-white">Administration</h1>
            <p className="text-blue-100 text-sm mt-1">
              Connectez-vous pour gérer votre catalogue
            </p>
          </div>

          {/* Formulaire */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Champ mot de passe */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Mot de passe administrateur
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Entrez votre mot de passe"
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Vérification...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 text-center">
                  Espace réservé aux administrateurs de LA CANT.
                  <br />
                  Veuillez contacter votre administrateur si vous avez perdu
                  votre mot de passe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
