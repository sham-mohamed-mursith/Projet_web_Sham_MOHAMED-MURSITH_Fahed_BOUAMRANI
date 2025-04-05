# Projet Web - Sham MOHAMED-MURSITH & Fahed BOUAMRANI

Ce projet est une application web en SPA (Single Page Application) permettant de naviguer entre différentes vues de personnages, équipements, favoris, et combats.

## Structure des fichiers JavaScript

### Dossier `js/`

- **app.js** : Point d'entrée de l'application SPA, gère la navigation entre les vues (`routes`) et initialise les composants à afficher dynamiquement.
- **config.js** : Contient des constantes de configuration comme les URLs des APIs ou le nom des ressources utilisées dans le projet.
- **provider.js** : Fichier utilitaire pour charger les données depuis des fichiers JSON ou API externes, utilisé par les vues pour accéder aux données.

### Dossier `js/views/`

- **combat.js** : Gère l'affichage et la logique de la page de combat entre personnages (choix d’équipe, lancement du combat, etc.).
- **detail.js** : Affiche les détails d’un personnage sélectionné, y compris ses caractéristiques et son équipement.
- **equipementDetail.js** : Affiche les détails d’un équipement individuel (nom, description, stats, etc.).
- **equipements.js** : Vue listant tous les équipements disponibles. Permet la navigation vers leurs détails.
- **favoris.js** : Vue dédiée à l'affichage des personnages ou équipements ajoutés aux favoris par l'utilisateur.

---

Chaque vue est chargée dynamiquement via `app.js` en fonction de l'URL (SPA sans rechargement de page).
