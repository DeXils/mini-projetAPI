# Satisfactory API

Bienvenue dans le projet **Satisfactory API**, une API construite en Node.js permettant d'exploiter les données du jeu *Satisfactory*.

## Description

Cette API est conçue pour fournir des données sur divers aspects du jeu Satisfactory, y compris :
- Les différentes recettes
- Les différents objets, bâtiments, ou moyen de transport
- La faune ansi que les dégats qu'ils peuvents causer

## Fonctionnalités

- **Endpoints REST** pour interagir avec les données de Satisfactory.
- Support pour les opérations CRUD (Écriture, Lecture, Mise à jour et Suppression).
- Documentation complète pour chaque endpoint.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine avant de démarrer :

- [Node.js](https://nodejs.org/) (v14 ou plus récent)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- Un outil comme Postman, HTTPie ou cURL pour tester l'API

## Installation

1. Clonez ce dépôt sur votre machine locale :

   ```bash
   git clone https://github.com/votre-utilisateur/satisfactory-api.git
   ```

2. Accédez au dossier du projet :

   ```bash
   cd satisfactory-api
   ```

3. Installez les dépendances requises :

   ```bash
   npm install
   ```

## Configuration

1. Créez un fichier `.env` à la racine du projet avec le contenu suivant :

   ```env
   PORT=3000
   API_KEY=your_api_key_here
   DATABASE_URL=your_database_url_here
   ```

2. Remplacez les valeurs par vos paramètres personnels.

## Démarrage

Pour démarrer le serveur en mode développement :

```bash
npm run dev
```

Pour démarrer le serveur en mode production :

```bash
npm start
```

L'API sera disponible sur `http://localhost:3000` (par défaut).

## Endpoints

Voici un aperçu des principaux endpoints disponibles :

### GET /resources
- Description : Récupérez toutes les ressources disponibles.

### GET /recipes
- Description : Obtenez la liste des recettes.

### POST /resources
- Description : Ajoutez une nouvelle ressource.

Consultez la documentation complète pour plus de détails.

## Tests

Pour exécuter les tests unitaires :

```bash
npm test
```

## Contribution

Les contributions sont les bienvenues ! Suivez ces étapes pour contribuer :

1. Forkez ce dépôt.
2. Créez une branche pour votre fonctionnalité : `git checkout -b ma-fonctionnalite`
3. Effectuez vos modifications et committez-les : `git commit -m "Ajout de ma fonctionnalité"`
4. Poussez vos modifications : `git push origin ma-fonctionnalite`
5. Ouvrez une pull request.

## Licence

Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

---

Merci d'utiliser **Satisfactory API** !

