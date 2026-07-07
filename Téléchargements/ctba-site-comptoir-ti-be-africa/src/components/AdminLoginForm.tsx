import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('ctba_admin_auth', 'true');
        localStorage.setItem('ctba_admin_token', data.token || '');
        onLoginSuccess();
      } else {
        setLoginError(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setLoginError('Erreur de connexion au serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Administration</h1>
          <p className="text-brand-100 text-sm">CTBA</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-5">
            <label htmlFor="admin-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Identifiant
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-username"
                name="username"
                type="text"
                value="Administrateur"
                disabled
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                placeholder="Entrez le mot de passe"
                autoFocus
                autoComplete="current-password"
                aria-describedby={loginError ? 'admin-password-error' : undefined}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {loginError && (
              <p id="admin-password-error" className="text-brand-600 text-sm mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
                {loginError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Lock size={18} />
            )}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Back to site link */}
        <div className="p-6 pt-0 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
