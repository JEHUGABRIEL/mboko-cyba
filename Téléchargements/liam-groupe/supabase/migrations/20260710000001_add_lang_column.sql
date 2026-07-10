-- Ajout de la colonne `lang` aux tables de contenu pour le support multilingue
-- Les données existantes sont marquées comme français par défaut
ALTER TABLE domains ADD COLUMN lang TEXT DEFAULT 'fr';
ALTER TABLE events ADD COLUMN lang TEXT DEFAULT 'fr';
ALTER TABLE news ADD COLUMN lang TEXT DEFAULT 'fr';
ALTER TABLE team ADD COLUMN lang TEXT DEFAULT 'fr';
ALTER TABLE partners ADD COLUMN lang TEXT DEFAULT 'fr';
ALTER TABLE testimonials ADD COLUMN lang TEXT DEFAULT 'fr';

-- Index pour accélérer les filtres par langue
CREATE INDEX idx_domains_lang ON domains(lang);
CREATE INDEX idx_events_lang ON events(lang);
CREATE INDEX idx_news_lang ON news(lang);
CREATE INDEX idx_team_lang ON team(lang);
CREATE INDEX idx_partners_lang ON partners(lang);
CREATE INDEX idx_testimonials_lang ON testimonials(lang);
