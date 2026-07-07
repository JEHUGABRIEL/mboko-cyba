/**
 * Logo officiel CTBA — utilise le logo réel de l'entreprise (fichier SVG),
 * plutôt qu'une icône générée. Le fichier source est dans /public/logo-ctba.svg
 */
export function Logo({ className = 'h-9 w-auto sm:h-10 md:h-12 lg:h-14', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-ctba.svg"
        alt="CTBA"
        className={`${className} object-contain flex-shrink-0`}
      />
      {showText && (
        <div>
          <span className="block text-xl font-bold text-slate-900 leading-tight tracking-tight">
            CTBA
          </span>
          <span className="block text-[11px] uppercase tracking-wider text-brand-700 font-medium">
            Forage • BTP • Commerce Général
          </span>
        </div>
      )}
    </div>
  );
}

/** Logo simplifié (juste l'icône, pour petits espaces comme le favicon ou le footer) */
export function LogoIcon({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <img
      src="/logo-ctba.svg"
      alt="CTBA"
      className={`${className} object-contain`}
    />
  );
}
