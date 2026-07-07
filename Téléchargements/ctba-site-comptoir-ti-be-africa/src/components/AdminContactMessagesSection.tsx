import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, User, Calendar, ChevronLeft, ChevronRight, RefreshCw, Search, MessageSquare } from 'lucide-react';
import { fetchContactMessages } from '../lib/api-client';

type ContactMessage = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
};

export function AdminContactMessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 10;

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchContactMessages();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const q = search.toLowerCase();
  const filtered = q
    ? messages.filter(
        (m) =>
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      )
    : messages;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const start = page * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return d; }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Messages de contact
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''} reçu{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadMessages}
          disabled={loading}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Rechercher dans les messages..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-slate-500">
            <RefreshCw size={24} className="animate-spin" />
            <span>Chargement des messages...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button onClick={loadMessages} className="mt-3 text-red-600 dark:text-red-400 font-medium underline">Réessayer</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
          <MessageSquare size={32} className="text-slate-400 dark:text-slate-500 mb-3" />
          <p className="text-slate-500 dark:text-slate-300 font-medium">
            {search ? 'Aucun message trouvé' : 'Aucun message pour le moment'}
          </p>
          {!search && (
            <p className="text-slate-400 text-sm mt-1">
              Les messages du formulaire de contact apparaîtront ici.
            </p>
          )}
        </div>
      )}

      {!loading && !error && paged.length > 0 && (
        <div className="space-y-3">
          {paged.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                className="w-full flex items-start justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {msg.firstName.charAt(0).toUpperCase()}{msg.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {msg.firstName} {msg.lastName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                        #{msg.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>}
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(msg.createdAt)}</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="inline-block bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-medium px-2 py-0.5 rounded">
                      {msg.subject}
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 dark:text-slate-500 ml-4 shrink-0">
                  <ChevronLeft
                    size={18}
                    className={`transition-transform duration-200 ${expandedId === msg.id ? '-rotate-90' : 'rotate-0'}`}
                  />
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === msg.id && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700 animate-slide-down">
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Réponse à votre message - CTBA&body=Bonjour ${msg.firstName},`}
                      className="inline-flex items-center gap-1.5 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Mail size={14} /> Répondre par email
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone size={14} /> Appeler
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page + 1} / {totalPages} ({filtered.length} messages)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
