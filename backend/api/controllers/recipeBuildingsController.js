const path = require('path')
const fs = require('fs')
const dataPath = path.resolve(__dirname, '../../../data.json');
const dependencyUtils = require('../utils/dependencyUtils');


function getData() {
    // Supprime le cache du module
    delete require.cache[require.resolve(dataPath)];

    // Recharge les données depuis le fichier
    return require(dataPath);
}

function addRecipeBuilding(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "recipe_building" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.recipe_building)) {
                // Ajoute le nouvel élément au tableau "recipe_building"
                jsonData.recipe_building.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'recipe_building' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'recipe_building'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyRecipeBuilding(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'recipe_building' est un tableau
        if (Array.isArray(jsonData.recipe_building)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.recipe_building.findIndex(recipe_building => recipe_building.id_recipe_building === newData.id_recipe_building);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.recipe_building[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_recipe_building} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_recipe_building} non trouvé.`);
            }
        } else {
            console.error("'recipe_building' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteRecipeBuilding(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'recipe_building');
        
        // Supprimer les éléments de chaque tableau en fonction des dépendances
        if (Array.isArray(jsonData.item)) {
            jsonData.item = jsonData.item.filter(item => !dependencies.item.includes(item.id_item));
        }
        if (Array.isArray(jsonData.recipe_item)) {
            jsonData.recipe_item = jsonData.recipe_item.filter(recipe => !dependencies.recipe_item.includes(recipe.id_recipe_item));
        }
        if (Array.isArray(jsonData.recipe_building)) {
            jsonData.recipe_building = jsonData.recipe_building.filter(recipe => !dependencies.recipe_building.includes(recipe.id_recipe_building));
        }
        if (Array.isArray(jsonData.recipe_transportation)) {
            jsonData.recipe_transportation = jsonData.recipe_transportation.filter(recipe => !dependencies.recipe_transportation.includes(recipe.id_transportation_recipe));
        }
        if (Array.isArray(jsonData.building)) {
            jsonData.building = jsonData.building.filter(building => !dependencies.building.includes(building.id_building));
        }
        if (Array.isArray(jsonData.transportation)) {
            jsonData.transportation = jsonData.transportation.filter(transport => !dependencies.transportation.includes(transport.id_transportation));
        }
        if (Array.isArray(jsonData.fuel)) {
            jsonData.fuel = jsonData.fuel.filter(fuel => !dependencies.fuel.includes(fuel.id_fuel));
        }
        if (Array.isArray(jsonData.fuel_used)) {
            jsonData.fuel_used = jsonData.fuel_used.filter(fuelUsed => !dependencies.fuels_used.includes(fuelUsed.id_fuel_used));
        }

        // Sauvegarder les modifications
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                return;
            }
            console.log(`Élément avec l'ID ${id} et ses dépendances supprimés avec succès !`);
        });
    });
}

// -- POST --
exports.postRecipeBuilding = (req, res) => {
    let recipeBuilding = getData().recipe_building
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        recipeBuilding.forEach(recipe_building => {
            if(recipe_building.id_recipe_building === data.id_recipe_building){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addRecipeBuilding(data)
            res.status(200).send({success:true, message:'RecipeBuilding Add Successfully'})
            console.log(recipeBuilding.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getRecipeBuilding = (req, res) => {
    let recipeBuilding = getData().recipe_building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    recipeBuilding.forEach((recipe_building) => {
        result.push(recipe_building);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, recipe_building: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getRecipeBuildingById = (req, res) => {
    let isPresent = false;
    let recipeBuilding = getData().recipe_building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        recipeBuilding.forEach((recipe_building) => {
            if(recipe_building.id_recipe_building === idInt){
                isPresent = true;
                res.status(200).send({success:true,recipe_building:recipe_building});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error RecipeBuilding Not Present'});
        }

    }
}

// -- PUT --
exports.putRecipeBuilding = (req, res) => {
    let recipeBuilding = getData().recipe_building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        recipeBuilding.forEach((recipe_building) => {
            if(recipe_building.id_recipe_building === data.id_recipe_building){
                modifyRecipeBuilding(data);
                isPresent = true;
                res.status(200).send({success:true,message:'RecipeBuilding Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error RecipeBuilding Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteRecipeBuilding = (req, res) => {
    let recipeBuilding = getData().recipe_building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        recipeBuilding.forEach((recipe_building) => {
            if(recipe_building.id_recipe_building === idInt){
                deleteRecipeBuilding(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'RecipeBuilding Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error RecipeBuilding Not Present'});
        }
    }

}