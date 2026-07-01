import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import book1 from '../assets/book1.png';
import book2 from '../assets/book2.png';
import book3 from '../assets/book3.png';
import book4 from '../assets/book4.png';
import book5 from '../assets/book5.png';

const covers = [book1, book2, book3, book4, book5];

interface Book {
  title: string;
  category: string;
  subtitle: string;
  link?: string;
  badge?: string;
}

// Couleurs des badges selon le type — les labels viennent des traductions i18n
const badgeStyles: Record<string, { bg: string; text: string }> = {
  new: { bg: 'bg-emerald-500', text: 'text-white' },
  bestseller: { bg: 'bg-amber-500', text: 'text-white' },
};

export function Publications() {
  const { t } = useTranslation();
  const books = t('publications.books', { returnObjects: true }) as Book[];

  return (
    <section id="publications" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-900 font-semibold tracking-wide uppercase text-sm mb-3">
            {t('publications.badge')}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif">
            {t('publications.title')}
          </h3>
          <p className="text-lg text-slate-600">{t('publications.description')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex flex-col"
            >
              <div className="rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 mb-4 aspect-[3/4] relative">
                {book.badge && badgeStyles[book.badge] && (
                  <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider shadow-lg ${badgeStyles[book.badge].bg} ${badgeStyles[book.badge].text}`}>
                    {t(`publications.badges.${book.badge}`)}
                  </div>
                )}
                <img
                  src={covers[index]}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[0.7rem] font-semibold tracking-wide text-amber-600 uppercase">
                {book.category}
              </span>
              <h4 className="text-slate-900 font-bold leading-snug mt-1 flex-1">{book.title}</h4>
              <p className="text-slate-500 text-sm italic mt-1 mb-4">{book.subtitle}</p>
              <a
                href={book.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.027 4.295.069l1.584 1.585a1.379 1.379 0 0 0 1.95-.001 1.38 1.38 0 0 0 0-1.952l-1.584-1.585a3.034 3.034 0 0 0-2.028-.84 2.663 2.663 0 0 0-1.875.81L11.37 7.53 13.01 5.887l3.942-4.212a1.377 1.377 0 0 0 .03-1.942 1.371 1.371 0 0 0-1.07-.484 1.398 1.398 0 0 0-.429.072z" />
                </svg>
                Acheter sur Amazon
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
