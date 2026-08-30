# DispoTruck

Plateforme web qui met en relation des entreprises de transport et des chauffeurs interimaires, pour publier et repondre a des missions urgentes en temps reel.

## Contexte

Dans le transport routier, quand un chauffeur est absent tot le matin, l'agence d'interim n'est pas encore ouverte. Le chef d'equipe doit chercher manuellement dans ses contacts un remplacant disponible. DispoTruck resout ce probleme : une entreprise publie une mission urgente, les chauffeurs inscrits repondent disponible ou non en quelques clics.

## Utilisateurs cibles

- **Entreprise / chef d'equipe** : publie des missions, consulte les chauffeurs disponibles, confirme un chauffeur.
- **Chauffeur interimaire** : consulte les missions disponibles, repond dispo ou non, suit ses missions confirmees.

## Stack technique

| Partie | Technologie |
|---|---|
| Frontend | React (a venir) |
| Backend | Node.js, Express |
| Base de donnees | PostgreSQL |
| ORM | Prisma |
| Authentification | JWT, bcrypt |
| Gestionnaire de paquets | pnpm |

## Etat du projet

- [x] Conception (cahier des charges, maquettes, MCD/MLD/MPD)
- [x] Backend : authentification (inscription, connexion)
- [x] Backend : routes missions (creer, lister, modifier, annuler)
- [x] Backend : routes disponibilites (voir, repondre, confirmer)
- [ ] Frontend React
- [ ] Tests automatises
- [ ] Deploiement

## Installation du backend