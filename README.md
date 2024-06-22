#  Interface utilisateur pour une application web Python  - JustStreamIt

## Présentation du projet 

Développer une interface web l'association "JustStreamIt" et son application python qui propose des classements de films. L'objectif était de créer une interface de visualiser en temps réel un classement de films intéressants. L'interface est conçue pour être responsive et permettre aux utilisateurs  de consulter les films les mieux notés par catégories avec leurs détails spécifiques.

Les données des films sont récupérées à partir de l'API [OCMovies-API-EN-FR](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR) - qui reprends les données [du site IMBD](https://www.imdb.com/) - spécialement développée pour ce projet, afin de garantir une mise à jour en temps réel.


## Structure du Projet

Le répertoire du projet contient les fichiers et dossiers suivants :

- `index.html` : Le fichier HTML principal qui contient la structure de la page web.
- `js/script.js` : Contient le code JavaScript principal pour gérer les requêtes API et le contenu dynamique.
- `js/movieCardCreator.js` : Contient le code pour créer les cartes de films affichées sur l'interface.
- `css/style.css` : Le fichier CSS principal qui contient les styles de la page web.
- `css/reset.css` : Un fichier CSS pour réinitialiser les styles par défaut du navigateur.
- `images/` : Un dossier contenant les images des logos.

## Instructions d'Installation

Assurez vous d'installer l'API et de récupérer les données au préalable

## Télécharger et Configurer l'API

L'API utilisée pour récupérer les données des films est disponible sur GitHub. Suivez les instructions fournies dans le dépôt pour configurer l'API.

**Dépôt de l'API** : [OCMovies-API-EN-FR](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR)

Suivez les instructions dans le dépôt de l'API pour installer et exécuter l'API localement. Assurez-vous que l'API est en cours d'exécution avant d'accéder à l'interface web.

1. **Cloner le Répertoire**

   ```sh
   git clone https://github.com/hericlibong/userWebInterface-P6
   
   ```
- Dans le terminal
   ```sh
   cd userWebInterface-P6\Interface
   
   ```
   
- lancer le l'index `html`

 ```sh
   start index.html 
   
   ```



## Utilisation

- L'interface web affichera les informations des films récupérées depuis l'API.
- Vous pouvez consulter les détails de chaque film en cliquant sur les cartes de films.
- L'interface est responsive et fonctionne sur les appareils de bureau, tablettes et mobiles.


## Remerciements

- OpenClassrooms pour avoir fourni l'API du projet.
- Tous les contributeurs et développeurs ayant travaillé sur ce projet.
