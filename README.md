# DispoTruck

[![CI](https://github.com/bocar86/dispotruck/actions/workflows/ci.yml/badge.svg)](https://github.com/bocar86/dispotruck/actions/workflows/ci.yml)

Plateforme web qui met en relation des entreprises de transport et des chauffeurs interimaires, pour publier et repondre a des missions urgentes.

## Contexte

Dans le transport routier, quand un chauffeur est absent tot le matin, l'agence d'interim n'est pas encore ouverte. Le chef d'equipe doit chercher manuellement dans ses contacts un remplacant disponible. DispoTruck resout ce probleme : une entreprise publie une mission urgente, les chauffeurs inscrits repondent disponible ou non en quelques clics.

## Utilisateurs cibles

- **Entreprise / chef d'equipe** : publie des missions, consulte les chauffeurs disponibles, confirme un chauffeur.
- **Chauffeur interimaire** : consulte les missions disponibles, repond dispo ou non, suit ses missions confirmees.

## Stack technique

| Partie | Technologie |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Base de donnees | PostgreSQL |
| ORM | Prisma |
| Authentification | JWT, bcrypt |
| Securite | Helmet, CORS restreint, limitation de requetes |
| Tests | Jest, Supertest |
| CI | GitHub Actions (tests backend, lint frontend) |
| Gestionnaire de paquets | pnpm |

## Etat du projet

- [x] Conception (cahier des charges, maquettes, MCD/MLD/MPD)
- [x] Backend : authentification (inscription, connexion)
- [x] Backend : routes missions (creer, lister, modifier, annuler)
- [x] Backend : routes disponibilites (voir, repondre, confirmer)
- [x] Frontend React (accueil, authentification, deux tableaux de bord)
- [x] Tests automatises backend (13 tests)
- [x] Pipeline CI GitHub Actions
- [x] Securite de base (Helmet, CORS, limitation de requetes, audit des dependances)
- [x] Endpoint de sante et journalisation structuree
- [ ] Deploiement

## Prerequis

- Node.js 22 ou plus
- pnpm
- PostgreSQL (une base vide, par exemple `dispotruck`)

## Installation

### 1. Recuperer le projet

```bash
git clone https://github.com/bocar86/dispotruck.git
cd dispotruck
```

### 2. Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

Ouvrir `backend/.env` et renseigner les valeurs :

| Variable | Role |
|---|---|
| DATABASE_URL | adresse de la base PostgreSQL |
| JWT_SECRET | longue phrase secrete pour signer les jetons |
| PORT | port du backend (4000) |
| FRONTEND_URL | origine autorisee par CORS (http://localhost:5173) |

Creer les tables puis lancer le serveur :

```bash
pnpm exec prisma migrate deploy
pnpm dev
```

Verification : ouvrir http://localhost:4000/health, la reponse doit contenir `"statut": "ok"`.

### 3. Frontend

Dans un second terminal :

```bash
cd frontend
pnpm install
pnpm dev
```

L'application est disponible sur http://localhost:5173.

## Tests et qualite

Les tests backend utilisent une vraie base PostgreSQL (celle de `DATABASE_URL`), il est conseille d'utiliser une base dediee aux tests.

```bash
cd backend
pnpm test
```

```bash
cd frontend
pnpm run lint
```

Le plan de tests est dans `docs/plan-de-tests.md`.

## Endpoints de l'API

| Methode | Route | Role | Acces |
|---|---|---|---|
| GET | /health | etat du serveur et de la base | public |
| POST | /api/auth/register/entreprise | inscription entreprise | public |
| POST | /api/auth/register/chauffeur | inscription chauffeur | public |
| POST | /api/auth/login | connexion (renvoie un jeton JWT) | public |
| GET | /api/missions | lister les missions de l'entreprise | entreprise |
| POST | /api/missions | publier une mission | entreprise |
| PUT | /api/missions/:id | modifier une mission | entreprise |
| DELETE | /api/missions/:id | annuler une mission | entreprise |
| GET | /api/disponibilites/missions | missions ouvertes | chauffeur |
| POST | /api/disponibilites | repondre a une mission | chauffeur |
| GET | /api/disponibilites/mes-missions | missions confirmees | chauffeur |
| GET | /api/disponibilites/mission/:missionId | chauffeurs disponibles pour une mission | entreprise |
| PUT | /api/disponibilites/:id/confirmer | confirmer un chauffeur | entreprise |

Les routes protegees demandent l'en-tete `Authorization: Bearer <jeton>`.

## Documentation

- `docs/EXPLOITATION.md` : verification de l'etat, lecture des logs, runbook d'incidents
- `docs/plan-de-tests.md` : strategie et cas de tests
- `AGENTS.md` : regles de travail du projet

## Limites connues

- Le frontend appelle l'API sur une adresse ecrite en dur (`localhost:4000`), elle n'est pas encore configurable par variable d'environnement.
- Pas de notification en temps reel : un chauffeur voit les nouvelles missions en rechargeant sa page.
- La limitation de requetes est stockee en memoire, elle est remise a zero au redemarrage du serveur.
- Pas de pagination sur les listes de missions.
- Pas encore de deploiement ni de conteneurisation Docker.
