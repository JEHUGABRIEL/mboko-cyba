-- ============================================================
--  E-Bia — Schéma PostgreSQL complet
--  Exécuté automatiquement au premier lancement du container
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Recherche full-text floue

-- ── UTILISATEURS ─────────────────────────────────────────────

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           VARCHAR(20) UNIQUE,           -- +236XXXXXXXX
  email           VARCHAR(255) UNIQUE,
  display_name    VARCHAR(100),
  avatar_url      TEXT,
  role            VARCHAR(20) NOT NULL DEFAULT 'listener'
                    CHECK (role IN ('listener', 'artist', 'admin')),
  subscription    VARCHAR(20) NOT NULL DEFAULT 'free'
                    CHECK (subscription IN ('free', 'weekly', 'monthly', 'yearly')),
  sub_expires_at  TIMESTAMPTZ,
  firebase_uid    VARCHAR(128) UNIQUE,          -- lien Firebase Auth
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ARTISTES ─────────────────────────────────────────────────

CREATE TABLE artists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,  -- "idylle-mamba"
  name            VARCHAR(200) NOT NULL,
  bio             TEXT,
  genre           VARCHAR(50),
  city            VARCHAR(100) DEFAULT 'Bangui',
  country         CHAR(3) DEFAULT 'CAF',         -- ISO 3166-1 alpha-3
  avatar_url      TEXT,
  cover_url       TEXT,
  verified        BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  plays_count     BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_name_trgm ON artists USING GIN (name gin_trgm_ops);

-- ── ALBUMS ───────────────────────────────────────────────────

CREATE TABLE albums (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id       UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title           VARCHAR(300) NOT NULL,
  cover_url       TEXT,
  released_at     DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TITRES (TRACKS) ──────────────────────────────────────────

CREATE TABLE tracks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id       UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  album_id        UUID REFERENCES albums(id) ON DELETE SET NULL,
  title           VARCHAR(300) NOT NULL,
  duration_s      INTEGER NOT NULL,             -- durée en secondes
  file_path       TEXT,                         -- chemin MinIO
  file_size_kb    INTEGER,
  bitrate_kbps    INTEGER DEFAULT 64,
  genre           VARCHAR(50),
  language        VARCHAR(10) DEFAULT 'fr',     -- fr, sg (sango), ln (lingala)
  plays_count     BIGINT DEFAULT 0,
  is_public       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracks_artist ON tracks(artist_id);
CREATE INDEX idx_tracks_title_trgm ON tracks USING GIN (title gin_trgm_ops);

-- ── EMPREINTES AUDIO (Fingerprints Shazam-like) ──────────────

CREATE TABLE fingerprints (
  hash            BIGINT NOT NULL,              -- hash 64-bit (f1, f2, Δt)
  track_id        UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  time_offset     REAL NOT NULL                 -- position dans le titre (secondes)
);

-- INDEX HASH pour recherche ultra-rapide (<50ms)
CREATE INDEX idx_fingerprints_hash ON fingerprints USING HASH (hash);
CREATE INDEX idx_fingerprints_track ON fingerprints(track_id);

-- ── ÉCOUTES (PLAYS) ──────────────────────────────────────────

CREATE TABLE plays (
  id              BIGSERIAL PRIMARY KEY,
  track_id        UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  played_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  offline         BOOLEAN DEFAULT FALSE,
  duration_s      INTEGER,                      -- combien de secondes écoutées
  country         CHAR(3) DEFAULT 'CAF'
);

CREATE INDEX idx_plays_track ON plays(track_id);
CREATE INDEX idx_plays_user ON plays(user_id);
CREATE INDEX idx_plays_date ON plays(played_at);

-- ── PLAYLISTS ────────────────────────────────────────────────

CREATE TABLE playlists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  is_public       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playlist_tracks (
  playlist_id     UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id        UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (playlist_id, track_id)
);

-- ── ABONNEMENTS & PAIEMENTS ──────────────────────────────────

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_fcfa     INTEGER NOT NULL,
  plan            VARCHAR(20) NOT NULL CHECK (plan IN ('weekly', 'monthly', 'yearly')),
  provider        VARCHAR(30) DEFAULT 'orange_money',
  provider_tx_id  VARCHAR(200) UNIQUE,          -- ID transaction Orange Money
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_provider_tx ON payments(provider_tx_id);

-- ── FOLLOWS ──────────────────────────────────────────────────

CREATE TABLE follows (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_id       UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  followed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- ── QUEUE RECONNAISSANCE OFFLINE ────────────────────────────

CREATE TABLE recognition_jobs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','processing','found','not_found','error')),
  audio_url       TEXT,                         -- fichier temporaire sur MinIO
  result_track_id UUID REFERENCES tracks(id),
  confidence      REAL,
  retry_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at    TIMESTAMPTZ
);

-- ── TRIGGERS auto updated_at ─────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── DONNÉES INITIALES ────────────────────────────────────────

INSERT INTO users (id, display_name, role, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Admin E-Bia', 'admin', 'admin@e-bia.rca');
