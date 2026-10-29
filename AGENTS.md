# AGENTS.md

Instructions pour un agent IA (ou une personne) qui travaille sur ce projet. Lire ce fichier avant toute modification.

## Contexte du projet

DispoTruck met en relation des entreprises de transport et des chauffeurs intérimaires pour des missions urgentes. Voir README.md pour le contexte complet et docs/EXPLOITATION.md pour l'exploitation.

## Structure

```
dispotruck/
  backend/     API Node.js, Express, Prisma, PostgreSQL
  frontend/    Application React (Vite)
  docs/        ADR, plan de tests, guide d'exploitation
  .github/     Workflow d'intégration continue
```

## Commandes utiles

Depuis backend/ :

```
pnpm install                  installer les dépendances
pnpm dev                      lancer le serveur en local (port 4000)
pnpm test                     lancer les 13 tests Jest et Supertest
pnpm exec prisma migrate dev  appliquer une migration
pnpm audit --prod             vérifier les dépendances
```

Depuis frontend/ :

```
pnpm install
pnpm dev                      lancer le frontend (port 5173)
pnpm run lint                 contrôler le code avec ESLint
```

## Conventions de code

- Code simple et explicite : pas de raccourcis avancés, préférer if / else aux ternaires imbriqués.
- Noms de variables et de fonctions en français, sans accents (ex : entrepriseId, motDePasse).
- Chaque route suit le chemin : route, middleware, contrôleur, Prisma, réponse JSON.
- Toujours gérer les erreurs avec try / catch et répondre avec un code HTTP adapté (400, 401, 403, 404, 500).
- Ne jamais renvoyer le mot de passe (même haché) dans une réponse de l'API.
- Les routes sensibles passent par verifierToken puis verifierRole.
- Ne jamais écrire le corps des requêtes dans les journaux.

## Base de données

Le schéma Prisma (backend/prisma/schema.prisma) est la source de vérité. Toute modification de structure passe par une migration, jamais par une modification manuelle de la base.

## Sécurité

- Les secrets vivent dans backend/.env, qui n'est jamais versionné. Le modèle est backend/.env.example.
- Les requêtes SQL passent toujours par Prisma (requêtes paramétrées).
- Ne pas désactiver helmet, CORS ni le limiteur de requêtes. Le limiteur n'est désactivé qu'en mode test.

## Git et intégration continue

- Branche principale : main.
- Commits au format : partie: description courte (ex : backend: ajout route missions).
- Ne jamais committer .env ni node_modules.
- Le pipeline GitHub Actions lance les tests du backend et le lint du frontend à chaque envoi. Il doit rester vert.

## Règles pour un agent IA

- Lire ce fichier et le README avant d'écrire du code.
- Ne pas inventer de route, de colonne ou de dépendance : vérifier dans le code existant.
- Expliquer ce qui est modifié, pour que l'auteur du projet puisse le relire, le comprendre et le défendre.
- Proposer des tests pour toute nouvelle fonctionnalité, et lancer pnpm test avant de conclure.
- Ne jamais écrire de secret, de mot de passe réel ni de clé dans un fichier versionné.
- Signaler les doutes plutôt que d'improviser.
