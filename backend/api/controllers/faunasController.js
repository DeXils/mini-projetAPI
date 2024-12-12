const path = require('path')
const fs = require('fs')
const dataPath = path.resolve(__dirname, '../../../data.json');


function getData() {
    // Supprime le cache du module
    delete require.cache[require.resolve(dataPath)];

    // Recharge les données depuis le fichier
    return require(dataPath);
}

function addFauna(newData) {
    fs.readFile(dataPath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        try {
            // On parse le contenu du fichier JSON
            const jsonData = JSON.parse(fileContent);

            // Vérifie si "fauna" est un tableau dans le fichier JSON
            if (Array.isArray(jsonData.fauna)) {
                // Ajoute le nouvel élément au tableau "fauna"
                jsonData.fauna.push(newData);

                // Transforme les données mises à jour en chaîne JSON avec indentation
                const updatedData = JSON.stringify(jsonData, null, 2);

                // Écrit les données mises à jour dans le fichier
                fs.writeFile(dataPath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log("Élément ajouté avec succès au tableau 'fauna' !");
                });
            } else {
                console.error("Le fichier JSON ne contient pas de tableau 'fauna'.");
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }
    });
}

function modifyFauna(newData) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'fauna' est un tableau
        if (Array.isArray(jsonData.fauna)) {
            // Trouver l'index de l'élément à modifier
            const index = jsonData.fauna.findIndex(fauna => fauna.id_fauna === newData.id_fauna);

            if (index !== -1) {
                // Remplacer l'élément à cet index par les nouvelles données
                jsonData.fauna[index] = newData;

                // Sauvegarder les modifications
                fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                        return;
                    }
                    console.log(`Élément avec l'ID ${newData.id_fauna} modifié avec succès !`);
                });
            } else {
                console.log(`Élément avec l'ID ${newData.id_fauna} non trouvé.`);
            }
        } else {
            console.error("'fauna' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

function deleteFauna(id) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return;
        }

        // Conversion en objet JavaScript
        let jsonData = JSON.parse(data);

        // Vérifier que 'fauna' est un tableau
        if (Array.isArray(jsonData.fauna)) {
            // Filtrer le tableau pour supprimer l'élément avec l'ID spécifié
            const newFaunasArray = jsonData.fauna.filter(fauna => fauna.id_fauna !== id);

            // Vérifier si l'élément a bien été supprimé
            if (newFaunasArray.length === jsonData.fauna.length) {
                console.log(`Aucun élément avec l'ID ${id} n'a été trouvé pour suppression.`);
            } else {
                // Mettre à jour le tableau 'fauna' avec les éléments restants
                jsonData.fauna = newFaunasArray;

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
            console.error("'fauna' n'est pas un tableau dans le fichier JSON.");
        }
    });
}

// -- POST --
exports.postFauna = (req, res) => {
    let fauna = getData().fauna
    res.set('Cache-Control:private, no-cache, no-store, must-revalidate, max-age=0');
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fauna.forEach(fauna => {
            if(fauna.id_fauna === data.id_fauna){
                res.status(409).send({success:false, message:'Error ID Already Exists'})
                isPresent = true;
                return
            }
        })
        if(!isPresent){
            addFauna(data)
            res.status(200).send({success:true, message:'Fauna Add Successfully'})
            console.log(fauna.length)
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }

}

// -- GET --

// Get all item
exports.getFauna = (req, res) => {
    let fauna = getData().fauna
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let result = [];
    fauna.forEach((fauna) => {
        result.push(fauna);
    })

    if(result.length > 0){
        res.status(200).json({succes: true, faunas: result});
    }else {
        res.status(500).json({succes: false, message: 'Error Server'});
    }
}

// Get Item by Id
exports.getFaunaById = (req, res) => {
    let isPresent = false;
    let fauna = getData().fauna
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "L'ID doit être un entier positif valide"});
    } else {
        fauna.forEach((fauna) => {
            if(fauna.id_fauna === idInt){
                isPresent = true;
                res.status(200).send({success:true,faunas:fauna});
            }
        })

        if(!isPresent) {
            res.status(409).send({success: false, message: 'Error Fauna Not Present'});
        }

    }
}

// -- PUT --
exports.putFauna = (req, res) => {
    let fauna = getData().fauna
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    const data = req.body;
    let isPresent = false;
    console.log(data)

    if(data.length !== null){
        fauna.forEach((fauna) => {
            if(fauna.id_fauna === data.id_fauna){
                modifyFauna(data);
                isPresent = true;
                res.status(200).send({success:true,message:'Fauna Updated Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Fauna Not Present'});
        }
    }else {
        res.status(400).send({success:false, message:'Error No Body'});
    }
}

// -- DELETE --
exports.deleteFauna = (req, res) => {
    let fauna = getData().fauna
    res.set({'Cache-Control':'private, no-cache, no-store, must-revalidate, max-age=0', 'Pragma':'no-cache'});
    let isPresent = false;
    const { id } = req.params; // ID passer dans l'url
    const idInt = parseInt(id);
    if(isNaN(idInt) || idInt <= 0) {
        res.status(422).send({ success: false, message: "Error ID Must Be A Positive Valid "});
    }else {
        fauna.forEach((fauna) => {
            if(fauna.id_fauna === idInt){
                deleteFauna(idInt)
                isPresent = true;
                res.status(200).send({success:true,message:'Fauna Deleted Successfully'});
            }
        })

        if(!isPresent){
            res.status(409).send({success:false, message:'Error Fauna Not Present'});
        }
    }

}