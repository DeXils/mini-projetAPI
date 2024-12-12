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

function addRecipeTransportation(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "recipe_transportation" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.recipe_transportation)) {
                // Ajoute le nouvel élément au tableau "recipe_transportation"
                jsonData.recipe_transportation.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'recipe_transportation' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'recipe_transportation'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyRecipeTransportation(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'recipe_transportation' est un tableau
        if (Array.isArray(jsonData.recipe_transportation)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.recipe_transportation.findIndex(recipe_transportation => recipe_transportation.id_transportation_recipe === newData.id_transportation_recipe);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.recipe_transportation[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_transportation_recipe} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_transportation_recipe} non trouvé.`);
            }
        } else {
            console.error("'recipe_transportation' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteRecipeTransportation(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'transportation');

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
exports.postRecipeTransportation = (req, res) => {
    let recipeTransportation = getData().recipe_transportation
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        recipeTransportation.forEach(recipe_transportation => {
            if(recipe_transportation.id_transportation_recipe === data.id_transportation_recipe){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addRecipeTransportation(data)
            res.status(200).send({success:true, message:'RecipeTransportation Add Successfully'})
            console.log(recipeTransportation.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getRecipeTransportation = (req, res) => {
    let recipeTransportation = getData().recipe_transportation
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    recipeTransportation.forEach((recipe_transportation) => {
        result.push(recipe_transportation);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, recipe_transportation: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getRecipeTransportationById = (req, res) => {
    let isPresent = false;
    let recipeTransportation = getData().recipe_transportation
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        recipeTransportation.forEach((recipe_transportation) => {
            if(recipe_transportation.id_transportation_recipe === idInt){
                isPresent = true;
                res.status(200).send({success:true,recipe_transportation:recipe_transportation});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error RecipeTransportation Not Present'});
        }

    }
}

// -- PUT --
exports.putRecipeTransportation = (req, res) => {
    let recipeTransportation = getData().recipe_transportation
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        recipeTransportation.forEach((recipe_transportation) => {
            if(recipe_transportation.id_transportation_recipe === data.id_transportation_recipe){
                modifyRecipeTransportation(data);
                isPresent = true;
                res.status(200).send({success:true,message:'RecipeTransportation Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error RecipeTransportation Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteRecipeTransportation = (req, res) => {
    let recipeTransportation = getData().recipe_transportation
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        recipeTransportation.forEach((recipe_transportation) => {
            if(recipe_transportation.id_transportation_recipe === idInt){
                deleteRecipeTransportation(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'RecipeTransportation Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error RecipeTransportation Not Present'});
        }
    }

}