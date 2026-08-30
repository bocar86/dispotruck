# ADR 002 — Choix de PostgreSQL comme base de donnees

## Statut

Accepte

## Contexte

Le projet doit stocker des donnees fortement structurees et liees entre elles : entreprises, chauffeurs, missions, disponibilites. Ces entites ont des relations claires (une entreprise a plusieurs missions, une mission a plusieurs disponibilites, etc.). Deux familles de bases de donnees etaient envisageables :

1. Une base relationnelle (PostgreSQL, MySQL)
2. Une base NoSQL orientee document (MongoDB)

## Decision

Le projet utilise PostgreSQL.

Raisons :
- Les donnees du projet sont naturellement relationnelles (cles etrangeres entre missions, chauffeurs, entreprises, disponibilites) : un modele relationnel avec contraintes d'integrite (REFERENCES) correspond mieux au besoin qu'un modele document
- PostgreSQL est une base mature, gratuite, largement documentee et compatible avec Prisma
- Comparaison avec MongoDB : MongoDB aurait demande de dupliquer ou d'imbriquer des donnees (ex: dupliquer les infos chauffeur dans chaque disponibilite) pour eviter les jointures, ce qui complique la coherence des donnees pour un projet ou l'integrite (ex: un chauffeur ne doit pas pouvoir etre confirme deux fois sur la meme mission) est importante
- Comparaison avec MySQL : les deux auraient convenu, PostgreSQL a ete choisi pour sa compatibilite native avec les types de donnees utilises (DATE, TIME separes) et parce que c'est la base recommandee dans le referentiel RNCP6 pour ce type de projet

## Consequences

- Necessite une instance PostgreSQL installee et configuree (en local pour le developpement)
- Les migrations Prisma doivent etre appliquees a chaque changement de schema
- Bon respect du cahier des charges initial qui mentionnait explicitement une base de donnees relationnelle
