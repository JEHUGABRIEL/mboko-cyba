#!/bin/bash
# scripts/start.sh — Démarre la stack E-Bia complète

set -e

echo "🎵 Démarrage E-Bia Backend..."

# Vérifier que .env existe
if [ ! -f .env ]; then
  echo "❌ Fichier .env manquant. Copier .env.example en .env et remplir les valeurs."
  exit 1
fi

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
  echo "❌ Docker n'est pas installé."
  exit 1
fi

# Construire et démarrer tous les services
docker compose up --build -d

echo ""
echo "✅ Stack E-Bia démarrée !"
echo ""
echo "  API Gateway   → http://localhost/api/v1"
echo "  Audio Service → http://localhost/api/v1/recognize"
echo "  MinIO Console → http://localhost:9001"
echo "  Health check  → http://localhost/health"
echo ""
echo "Logs : docker compose logs -f api-gateway"
