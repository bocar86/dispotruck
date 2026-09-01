# Plan de tests — DispoTruck

## Perimetre

Tests automatises des routes API backend (authentification, missions, disponibilites),
executes avec Jest + Supertest contre la base PostgreSQL locale.

## Authentification

| # | Cas de test | Resultat attendu |
|---|---|---|
| A1 | Inscription entreprise avec des donnees valides | 201, compte cree |
| A2 | Inscription chauffeur avec des donnees valides | 201, compte cree |
| A3 | Inscription avec un email deja utilise | 400 ou 500, message d'erreur |
| A4 | Connexion avec le bon email et le bon mot de passe | 200, token JWT recu |
| A5 | Connexion avec un mauvais mot de passe | 401, acces refuse |

## Missions (role entreprise)

| # | Cas de test | Resultat attendu |
|---|---|---|
| M1 | Creer une mission avec un token entreprise valide | 201, mission creee |
| M2 | Creer une mission sans token | 401, acces refuse |
| M3 | Lister ses missions | 200, liste des missions de l'entreprise connectee |
| M4 | Annuler une mission | 200, statut passe a "annulee" |

## Disponibilites (role chauffeur / entreprise)

| # | Cas de test | Resultat attendu |
|---|---|---|
| D1 | Voir les missions disponibles (chauffeur) | 200, liste des missions en_attente |
| D2 | Repondre "disponible" a une mission | 201, disponibilite enregistree |
| D3 | Entreprise confirme un chauffeur | 200, statut de la mission passe a "confirmee" |
| D4 | Chauffeur voit la mission dans ses missions confirmees | 200, mission presente dans la liste |

## Execution

Commande : `pnpm test` (backend). Resultats consignes dans le compte rendu de progression.
