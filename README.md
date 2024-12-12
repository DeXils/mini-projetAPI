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
   git clone https://github.com/DeXils/mini-projetAPI.git
   ```

2. Accédez au dossier du projet :

   ```bash
   cd mini-projetAPI
   ```

3. Installez les dépendances requises :

   ```bash
   npm install
   ```

4. Si vous voulez retrouver les données de base, vous devrais :
- Supprimer le fichier 'data.json'
- Duppliquer le fichier 'BDD.json'
- Renommer le fichier dupliquer en 'data.json'

## Démarrage

Pour démarrer le serveur :

```bash
npm start
```

L'API sera disponible sur `http://localhost:3000` (par défaut).

## Endpoints

Voici un aperçu des principaux endpoints disponibles :

### GET /items
- Description : Récupérez toute les items disponibles.

### PUT /items
- Description : Modifier un item.

### POST /items
- Description : Ajoutez un nouveau item.

### DELETE /items/{itemID}
- Description : Supprimer un item grâce a son id.

Consultez la documentation complète pour plus de détails.


## Spécification système

Chaque entité est présentée avec ses attributs principaux, ce qui permet de mieux comprendre leur rôle dans l’API et leur interaction au sein du jeu.

### Item
- **Description** : Représente les ressources utilisées dans le jeu.
- **Attributs** :
   - `id_item` : Identifiant unique de l'item.
   - `name_item` : Nom de l'item.
   - `description_item` : Description détaillée de l'item.
   - `category_item` : Catégorie (ex. : Fluide, Matériau).
   - `unlock_item` : Condition pour débloquer l'item.
   - `stack_item` : Capacité maximale dans un inventaire.
   - `ressources_point_item` : Points de ressources associés.

### Building
- **Description** : Représente les bâtiments utilisés dans le jeu.
- **Attributs** :
   - `id_building` : Identifiant unique du bâtiment.
   - `name_building` : Nom du bâtiment.
   - `description_building` : Description des fonctions du bâtiment.
   - `category_building` : Catégorie (ex. : véhicules, production).
   - `unlock_building` : Condition pour débloquer le bâtiment.
   - `width_building`, `length_building`, `height_building` : Dimensions.
   - `area_building` : Surface occupée.
   - `power_building` : Consommation électrique.

###  Fuel
- **Description** : Sources d'énergie pour bâtiments et véhicules.
- **Attributs** :
   - `id_fuel` : Identifiant unique.
   - `id_item` : Référence à l'item correspondant.
   - `energy` : Valeur énergétique.
   - `stack_energy` : Capacité maximale de stockage.

###  Fuel_Used
- **Description** : Enregistre l'utilisation du carburant.
- **Attributs** :
   - `id_fuel_used` : Identifiant unique.
   - `id_fuel` : Référence au carburant utilisé.
   - `time_used` : Durée d'utilisation (en heures).
   - `id_building` : Référence au bâtiment utilisateur.
   - `id_transportation` : Référence au mode de transport (optionnel).
   - `id_item` : Référence à l'item associé (optionnel).

### Fauna
- **Description** : Représente les créatures présentes dans le jeu.
- **Attributs** :
   - `id_fauna` : Identifiant unique.
   - `name_fauna` : Nom de la créature.
   - `description_fauna` : Description détaillée.
   - `life_point_fauna` : Points de vie.
   - `damage_fauna_id` : Référence aux dégâts infligés.
   - `behavior_fauna` : Comportement (chassant, se déplaçant, etc.).
   - `loot_fauna_id` : Référence aux objets lâchés.
   - `loot_fauna_size` : Taille de la récompense.

### Damage
- **Description** : Enregistre les types de dommages infligés.
- **Attributs** :
   - `id_damage` : Identifiant unique.
   - `name_damage_1`, `point_damage_1` : Premier type de dommage et ses points associés.
   - `name_damage_2`, `point_damage_2` : Deuxième type de dommage (optionnel).
   - `name_damage_3`, `point_damage_3` : Troisième type de dommage (optionnel).

### Transportation
- **Description** : Moyens de transport pour déplacer des ressources.
- **Attributs** :
   - `id_transportation` : Identifiant unique.
   - `name_transportation` : Nom.
   - `description_transportation` : Description détaillée.
   - `category_transportation` : Catégorie (ex. : routier, ferroviaire).
   - `unlock_transportation` : Condition pour débloquer.
   - `width_transportation`, `length_transportation`, `height_transportation` : Dimensions.
   - `area_transportation` : Surface occupée.
   - `power_transportation` : Consommation énergétique.

### Recipe_Item
- **Description** : Recettes de production d’items.
- **Attributs** :
   - `id_recipe_item` : Identifiant unique.
   - `id_item` : Référence à l'item produit.
   - `recipe_name` : Nom de la recette.
   - `is_alternate_recipe` : Indique si la recette est alternative.
   - `ingredient_id_x`, `ingredient_size_x` : Ingrédients nécessaires (jusqu'à 4).
   - `building_id` : Référence au bâtiment d'application.
   - `building_time` : Temps nécessaire.
   - `prerequisite_x` : Conditions nécessaires (jusqu'à 3).

### Recipe_Building
- **Description** : Recettes de construction des bâtiments.
- **Attributs** :
   - `id_recipe_building` : Identifiant unique.
   - `ingredient_id_x`, `ingredient_size_x` : Ingrédients nécessaires (jusqu'à 6).

### Recipe_Transportation
- **Description** : Recettes pour construire des moyens de transport.
- **Attributs** :
   - `id_transportation_recipe` : Identifiant unique.
   - `ingredient_id_x`, `ingredient_size_x` : Ingrédients nécessaires (jusqu'à 5).

### Relations entre les entités
- **Item ↔ Fuel** : Un item peut être associé à plusieurs carburants.
- **Item ↔ Recipe_Item** : Les items ont une ou plusieurs recettes.
- **Item ↔ Recipe_Building** : Les bâtiments sont construits grâce aux items.
- **Item ↔ Recipe_Transportation** : Les transports sont construits grâce aux items.
- **Building ↔ Recipe_Item** : Les bâtiments utilisent des recettes pour produire des items.
- **Building ↔ Recipe_Building** : Les bâtiments possèdent une recette.
- **Building ↔ Fuel_Used** : Les bâtiments consomment du carburant.
- **Transportation ↔ Recipe_Transportation** : Les moyens de transport sont construits à l’aide de recettes.
- **Transportation ↔ Fuel_Used** : Les transports consomment du carburant.
- **Fauna ↔ Damage** : La faune peut infliger des dégâts, enregistrés dans l'entité Damage.


## Méthodologie suivie
Pour ce projet, je me suis concentré sur la mise en place du serveur afin de tester les fonctionnalité de ce dernier.\
La spécification OpenAPI c'est fais en dernier, affin de me permettre de me concentrer d'avantage sur la réalisation du serveur et de l'API.

