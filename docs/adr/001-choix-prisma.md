# ADR 001 — Choix de Prisma comme ORM

## Statut

Accepte

## Contexte

Le backend a besoin d'un moyen d'acceder a la base de donnees PostgreSQL depuis le code Node.js/Express. Deux options envisagees :

1. SQL brut avec la librairie pg (ecrire les requetes SQL a la main)
2. Un ORM (Object-Relational Mapping) comme Prisma ou Sequelize

## Decision

Le projet utilise Prisma.

Raisons :
- Le schema (prisma/schema.prisma) sert a la fois de documentation du modele de donnees et de source pour generer les migrations, ce qui evite les incoherences entre le code et la base reelle
- Les requetes generees par Prisma Client sont protegees automatiquement contre les injections SQL (parametrage automatique), ce qui repond a une exigence de securite du referentiel RNCP
- Comparaison avec Sequelize : Prisma a une syntaxe plus simple pour ce projet de taille reduite (4 tables), et sa documentation est plus accessible pour un debutant
- Comparaison avec SQL brut : SQL brut donne un controle total mais demande d'ecrire et maintenir les migrations a la main, plus risque d'erreur pour un projet solo avec delai contraint

## Consequences

- Ajoute une dependance et une couche d'abstraction supplementaire
- Necessite d'apprendre la syntaxe Prisma en plus de SQL
- Incident rencontre : Prisma 7 (version la plus recente au moment de l'installation) impose un fichier de configuration supplementaire (prisma.config.ts) et casse la compatibilite avec le schema.prisma classique. Decision : figer la version sur Prisma 6, stable et documentee, plutot que de suivre la derniere version.
