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

function addDamage(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "damage" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.damage)) {
                // Ajoute le nouvel élément au tableau "damage"
                jsonData.damage.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'damage' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'damage'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyDamage(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'damage' est un tableau
        if (Array.isArray(jsonData.damage)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.damage.findIndex(damage => damage.id_damage === newData.id_damage);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.damage[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_damage} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_damage} non trouvé.`);
            }
        } else {
            console.error("'damage' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteDamage(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Récupérer toutes les dépendances
        const dependencies = dependencyUtils.findItemDependencies(id,'damage');
        
        // Supprimer les éléments de chaque tableau en fonction des dépendances
        if (Array.isArray(jsonData.damage)) {
            jsonData.damage = jsonData.damage.filter(damage => !dependencies.damage.includes(damage.id_damage));
        }
        if (Array.isArray(jsonData.fauna)) {
            jsonData.fauna = jsonData.fauna.filter(fauna => !dependencies.fauna.includes(fauna.id_fauna));
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
exports.postDamage = (req, res) => {
    let damage = getData().damage
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        damage.forEach(damage => {
            if(damage.id_damage === data.id_damage){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addDamage(data)
            res.status(200).send({success:true, message:'Damage Add Successfully'})
            console.log(damage.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getDamage = (req, res) => {
    let damage = getData().damage
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    damage.forEach((damage) => {
        result.push(damage);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, damages: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getDamageById = (req, res) => {
    let isPresent = false;
    let damage = getData().damage
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        damage.forEach((damage) => {
            if(damage.id_damage === idInt){
                isPresent = true;
                res.status(200).send({success:true,damages:damage});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error Damage Not Present'});
        }

    }
}

// -- PUT --
exports.putDamage = (req, res) => {
    let damage = getData().damage
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        damage.forEach((damage) => {
            if(damage.id_damage === data.id_damage){
                modifyDamage(data);
                isPresent = true;
                res.status(200).send({success:true,message:'Damage Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Damage Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteDamage = (req, res) => {
    let damage = getData().damage
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        damage.forEach((damage) => {
            if(damage.id_damage === idInt){
                deleteDamage(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'Damage Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Damage Not Present'});
        }
    }

}