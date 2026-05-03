# E-Bia Backend — Guide de démarrage

Stack complète : Nginx + Node.js API + Python Audio + PostgreSQL + Redis + MinIO

## Prérequis

- Docker Desktop (Windows/Mac) ou Docker + Docker Compose (Linux/Ubuntu)
- 2 Go de RAM disponibles minimum

## Démarrage en 3 étapes

```bash
# 1. Cloner et entrer dans le dossier
git clone https://github.com/JEHUGAB/e-bia-backend.git
cd e-bia-backend

# 2. Configurer les variables d'environnement
cp .env.example .env
# Ouvrir .env et remplir JWT_SECRET, POSTGRES_PASSWORD, etc.

# 3. Lancer toute la stack
chmod +x scripts/start.sh
./scripts/start.sh
```

## Services et ports

| Service          | Port interne | Port exposé  | Description                     |
|------------------|-------------|-------------|----------------------------------|
| Nginx            | 80          | 80, 443     | Reverse proxy, point d'entrée    |
| API Gateway      | 4000        | —           | Node.js, auth, tracks, artistes  |
| Audio Service    | 8000        | —           | Python, reconnaissance Shazam    |
| Payment Service  | 5000        | —           | Orange Money                     |
| PostgreSQL       | 5432        | —           | Base de données principale       |
| Redis            | 6379        | —           | Cache empreintes audio           |
| MinIO            | 9000        | 9001        | Stockage fichiers audio          |

## Endpoints principaux

```
POST /api/v1/auth/register          Inscription
POST /api/v1/auth/login             Connexion
POST /api/v1/auth/firebase          Échange token Firebase → JWT E-Bia

GET  /api/v1/artists                Liste des artistes
GET  /api/v1/artists/:slug          Profil artiste + discographie
GET  /api/v1/tracks?genre=Gospel    Liste des titres
GET  /api/v1/tracks/:id/stream      URL de streaming (JWT requis)
POST /api/v1/tracks/:id/play        Compteur d'écoute

POST /api/v1/recognize              Reconnaissance audio 10s (Shazam)
POST /api/v1/tracks/index           Indexer un titre dans la Hash DB (admin)

POST /api/v1/payments/init          Initier un paiement Orange Money (JWT requis)
POST /webhooks/orange-money         Webhook confirmation paiement

GET  /health                        Health check global
```

## Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f api-gateway
docker compose logs -f audio-service

# Redémarrer un service
docker compose restart api-gateway

# Accéder à PostgreSQL
docker compose exec postgres psql -U ebia -d ebia

# Arrêter la stack
docker compose down

# Tout réinitialiser (⚠️ supprime les données)
docker compose down -v
```

## Indexer un titre (reconnaissance audio)

```bash
# 1. Uploader l'audio dans MinIO (via console sur :9001)
# 2. Appeler l'endpoint d'indexation
curl -X POST http://localhost/api/v1/tracks/index \
  -H "Content-Type: application/json" \
  -d '{"track_id": "UUID_DU_TITRE", "audio_path": "/path/local/audio.mp3"}'
```

## Architecture

```
Client Flutter / Web
        │
    [Nginx :80]
        │
   ┌────┴────────┐
   │             │
[API Gateway] [Audio Service]
   │    └───────────────────── POST /recognize
   │
[PostgreSQL] [Redis] [MinIO]
```
