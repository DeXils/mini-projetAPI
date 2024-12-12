const path = require('path')
const fs = require('fs')
const dataPath = path.resolve(__dirname, '../../../data.json');


function getData() {
    // Supprime le cache du module
    delete require.cache[require.resolve(dataPath)];

    // Recharge les données depuis le fichier
    return require(dataPath);
}

function addFuelUsed(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "fuel_used" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.fuel_used)) {
                // Ajoute le nouvel élément au tableau "fuel_used"
                jsonData.fuel_used.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'fuel_used' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'fuel_used'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyFuelUsed(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'fuel_used' est un tableau
        if (Array.isArray(jsonData.fuel_used)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.fuel_used.findIndex(fuel_used => fuel_used.id_fuel_used === newData.id_fuel_used);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.fuel_used[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_fuel_used} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_fuel_used} non trouvé.`);
            }
        } else {
            console.error("'fuel_used' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteFuelUsed(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'fuel_used' est un tableau
        if (Array.isArray(jsonData.fuel_used)) {
            // Filtrer le tableau pour supprimer l'élément avec l'ID spécifié
            const newFuelUsedArray = jsonData.fuel_used.filter(fuel_used => fuel_used.id_fuel_used !== id);

            // Vérifier si l'élément a bien été supprimé
            if (newFuelUsedArray.length === jsonData.fuel_used.length) {
                console.log(`Aucun élément avec l'ID ${id} n'a été trouvé pour suppression.`);
            } else {
                // Mettre à jour le tableau 'fuel_used' avec les éléments restants
                jsonData.fuel_used = newFuelUsedArray;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${id} supprimé avec succès !`);
                });
            }
        } else {
            console.error("'fuel_used' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

// -- POST --
exports.postFuelUsed = (req, res) => {
    let fuelUsed = getData().fuel_used
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fuelUsed.forEach(fuel_used => {
            if(fuel_used.id_fuel_used === data.id_fuel_used){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addFuelUsed(data)
            res.status(200).send({success:true, message:'FuelUsed Add Successfully'})
            console.log(fuelUsed.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getFuelUsed = (req, res) => {
    let fuelUsed = getData().fuel_used
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    fuelUsed.forEach((fuel_used) => {
        result.push(fuel_used);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, fuel_used: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getFuelUsedById = (req, res) => {
    let isPresent = false;
    let fuelUsed = getData().fuel_used
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        fuelUsed.forEach((fuel_used) => {
            if(fuel_used.id_fuel_used === idInt){
                isPresent = true;
                res.status(200).send({success:true,fuel_used:fuel_used});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error FuelUsed Not Present'});
        }

    }
}

// -- PUT --
exports.putFuelUsed = (req, res) => {
    let fuelUsed = getData().fuel_used
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fuelUsed.forEach((fuel_used) => {
            if(fuel_used.id_fuel_used === data.id_fuel_used){
                modifyFuelUsed(data);
                isPresent = true;
                res.status(200).send({success:true,message:'FuelUsed Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error FuelUsed Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteFuelUsed = (req, res) => {
    let fuelUsed = getData().fuel_used
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        fuelUsed.forEach((fuel_used) => {
            if(fuel_used.id_fuel_used === idInt){
                deleteFuelUsed(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'FuelUsed Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error FuelUsed Not Present'});
        }
    }

}