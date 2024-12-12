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

function addBuilding(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "building" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.building)) {
                // Ajoute le nouvel élément au tableau "building"
                jsonData.building.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'building' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'building'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyBuilding(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'building' est un tableau
        if (Array.isArray(jsonData.building)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.building.findIndex(building => building.id_building === newData.id_building);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.building[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_building} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_building} non trouvé.`);
            }
        } else {
            console.error("'building' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteBuilding(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);
        
        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'building');
        
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
exports.postBuilding = (req, res) => {
    let building = getData().building
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        building.forEach(building => {
            if(building.id_building === data.id_building){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addBuilding(data)
            res.status(200).send({success:true, message:'Building Add Successfully'})
            console.log(building.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all building
exports.getBuilding = (req, res) => {
    let building = getData().building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    building.forEach((building) => {
        result.push(building);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, buildings: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getBuildingById = (req, res) => {
    let building = getData().building
    let isPresent = false;
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        building.forEach((building) => {
            if(building.id_building === idInt){
                isPresent = true;
                res.status(200).send({success:true,buildings:building});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error Building Not Present'});
        }

    }
}

// -- PUT --
exports.putBuilding = (req, res) => {
    let building = getData().building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        building.forEach((building) => {
            if(building.id_building === data.id_building){
                modifyBuilding(data);
                isPresent = true;
                res.status(200).send({success:true,message:'Building Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Building Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteBuilding = (req, res) => {
    let building = getData().building
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        building.forEach((building) => {
            if(building.id_building === idInt){
                deleteBuilding(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'Building Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Building Not Present'});
        }
    }

}