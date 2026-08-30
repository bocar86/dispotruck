cat > AGENTS.md << 'EOF'
# AGENTS.md

Instructions pour un agent IA (ou une personne) qui travaille sur ce projet.

## Contexte du projet

DispoTruck met en relation des entreprises de transport et des chauffeurs interimaires pour des missions urgentes. Voir README.md pour le contexte complet.

## Structure

dispotruck/
  backend/     API Node.js / Express / Prisma
  frontend/    Application React (a venir)
  docs/adr/    Decisions d'architecture

## Commandes utiles (depuis backend/)

pnpm install       installer les dependances
pnpm dev           lancer le serveur en local (port 3000)
npx prisma migrate dev   appliquer une migration de base de donnees
npx prisma studio        interface graphique pour voir les donnees

## Conventions de code

- Code simple et explicite, pas de raccourcis avances (pas de ternaires imbriques, preferer if/else classique)
- Noms de variables et fonctions en francais, sans accents (ex: entrepriseId, motDePasse)
- Chaque route passe par : route -> controller -> Prisma -> reponse JSON
- Toujours gerer les erreurs avec try/catch et repondre avec un code HTTP adapte (400, 401, 403, 404, 500)
- Ne jamais renvoyer le mot de passe (meme hashe) dans une reponse API
- Les routes sensibles (missions, disponibilites) passent par le middleware verifierToken et verifierRole

## Base de donnees

Le schema Prisma (backend/prisma/schema.prisma) est la source de verite. Toute modification de structure passe par une migration (npx prisma migrate dev), jamais de modification manuelle de la base.

## Git

- Branche principale : main
- Commits au format : partie: description courte (ex: backend: ajout route missions)
- Ne jamais committer .env ou node_modules (voir .gitignore)
EOF