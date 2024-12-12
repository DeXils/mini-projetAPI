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

function addItem(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "item" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.item)) {
                // Ajoute le nouvel élément au tableau "item"
                jsonData.item.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'item' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'item'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyItem(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'items' est un tableau
        if (Array.isArray(jsonData.item)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.item.findIndex(item => item.id_item === newData.id_item);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.item[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_item} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_item} non trouvé.`);
            }
        } else {
            console.error("'items' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteItem(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);
        
        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'item');
        
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
exports.postItem = (req, res) => {
    let items = getData().item
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        items.forEach(item => {
            if(item.id_item === data.id_item){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addItem(data)
            res.status(200).send({success:true, message:'Item Add Successfully'})
            console.log(items.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getItems = (req, res) => {
    let items = getData().item
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    items.forEach((item) => {
        result.push(item);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, items: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getItemById = (req, res) => {
    let items = getData().item
    let isPresent = false;
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid"});
    } else {
        items.forEach((item) => {
            if(item.id_item === idInt){
                isPresent = true;
                res.status(200).send({success:true,items:item});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error Item Not Present'});
        }
    }
}

// -- PUT --
exports.putItem = (req, res) => {
    let items = getData().item
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        items.forEach((item) => {
            if(item.id_item === data.id_item){
                modifyItem(data);
                isPresent = true;
                res.status(200).send({success:true,message:'Item Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Item Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteItem = (req, res) => {
    let items = getData().item
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params;
    const idInt = parseInt(id);

    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        items.forEach((item) => {
            if(item.id_item === idInt){
                deleteItem(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'Item And Dependencies Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Item Not Present'});
        }
    }

}