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

function addFuel(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "fuel" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.fuel)) {
                // Ajoute le nouvel élément au tableau "fuel"
                jsonData.fuel.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'fuel' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'fuel'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyFuel(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'fuel' est un tableau
        if (Array.isArray(jsonData.fuel)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.fuel.findIndex(fuel => fuel.id_fuel === newData.id_fuel);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.fuel[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_fuel} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_fuel} non trouvé.`);
            }
        } else {
            console.error("'fuel' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteFuel(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'fuel');

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
exports.postFuel = (req, res) => {
    let fuel = getData().fuel
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fuel.forEach(fuel => {
            if(fuel.id_fuel === data.id_fuel){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addFuel(data)
            res.status(200).send({success:true, message:'Fuel Add Successfully'})
            console.log(fuel.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getFuel = (req, res) => {
    let fuel = getData().fuel
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    fuel.forEach((fuel) => {
        result.push(fuel);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, fuels: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getFuelById = (req, res) => {
    let isPresent = false;
    let fuel = getData().fuel
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        fuel.forEach((fuel) => {
            if(fuel.id_fuel === idInt){
                isPresent = true;
                res.status(200).send({success:true,fuels:fuel});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error Fuel Not Present'});
        }

    }
}

// -- PUT --
exports.putFuel = (req, res) => {
    let fuel = getData().fuel
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fuel.forEach((fuel) => {
            if(fuel.id_fuel === data.id_fuel){
                modifyFuel(data);
                isPresent = true;
                res.status(200).send({success:true,message:'Fuel Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Fuel Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteFuel = (req, res) => {
    let fuel = getData().fuel
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        fuel.forEach((fuel) => {
            if(fuel.id_fuel === idInt){
                deleteFuel(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'Fuel Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Fuel Not Present'});
        }
    }

}