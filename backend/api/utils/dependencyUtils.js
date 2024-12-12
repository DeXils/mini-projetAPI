const path = require('path');
const dataPath = path.resolve(__dirname, '../../../data.json');

function getData() {
    delete require.cache[require.resolve(dataPath)];
    return require(dataPath);
}

function findItemDependencies(id,type) {
    console.log("Tous les dépendance de : " + id)
    let data = getData();
    let dependencies = {
        recipe_item: [],
        recipe_building : [],
        recipe_transportation: [],
        item: [],
        building: [],
        transportation : [],
        fuel: [],
        fuels_used: [],
        fauna: [],
        damage: []

    }
    
    switch (type) {
        case 'item':
            setRecipItemAndItemAndItem(id,data,dependencies)
            break;
        case 'building':
            setRecipItemAndItemAndItemWithBuilding(id,data,dependencies)
            break;
        case 'transportation':
            dependencies.transportation.push(id)
            dependencies.recipe_transportation.push(id)
            return dependencies
        case 'recipe_item':
            let idItem = 0
            data.recipe_item.forEach(item => {
                if (item.id_recipe_item === id) {
                    dependencies.recipe_item.push(id)
                    dependencies.item.push(item.id_item)
                    idItem = item.id_item
                }
            })
            setRecipItemAndItemAndItem(idItem,data,dependencies)
            break
        case 'recipe_building': 
            setRecipItemAndItemAndItemWithBuilding(id,data,dependencies,true)
            break;
        case 'fuel':
            dependencies.fuel.push(id);
            setFuelUsed(id,data,dependencies);
            return dependencies
        case 'damage':
            setdDamageAndFauna(id,data,dependencies)
            break
    }
    dependencies.item.forEach(item => {
        setRecipeBuildingAndBuilding(item,data,dependencies);
        setRecipeTransportationAndTransportation(item,data,dependencies);
        setFuel(item,data,dependencies);
    })
    dependencies.fuel.forEach(fuel => {
        setFuelUsed(fuel,data,dependencies);
    })
    console.log("--RECETTE/ITEM---")
    console.log(dependencies.recipe_item.length)
    console.log(dependencies.item.length)
    //dependencies.recipe_item.forEach(item => console.log(item))
    //dependencies.item.forEach(item => console.log(item))
    console.log("--RECETTE/BUILDING---")
    console.log(dependencies.recipe_building.length)
    console.log(dependencies.building.length)
    console.log("--RECETTE/TRANSPORTATION---")
    console.log(dependencies.recipe_transportation.length)
    console.log(dependencies.transportation.length)
    console.log("--FUEL/FUEL_USED---")
    console.log(dependencies.fuel.length)
    console.log(dependencies.fuels_used.length)
    console.log("--DAMAGE/FAUNA---")
    console.log(dependencies.damage.length)
    console.log(dependencies.fauna.length)
    
    
    return dependencies
}

function setRecipItemAndItemAndItem(id, data, dependencies, processedItems = new Set()) {
    // Si l'item a déjà été traité, on arrête la récursion
    if (processedItems.has(id)) {
        return;
    }
    
    // Marquer l'item comme traité
    processedItems.add(id);

    if (Array.isArray(data.recipe_item)) {
        data.recipe_item.forEach(recipe => {
            if (recipe.ingredient_id_1 === id || 
                recipe.ingredient_id_2 === id || 
                recipe.ingredient_id_3 === id || 
                recipe.ingredient_id_4 === id || 
                recipe.product_id_1 === id || 
                recipe.product_id_2 === id) {
                
                // Ajouter la recette si elle n'est pas déjà présente
                if (!dependencies.recipe_item.includes(recipe.id_recipe_item)) {
                    dependencies.recipe_item.push(recipe.id_recipe_item);
                    
                    // Ajouter l'item associé s'il n'est pas déjà présent
                    if (!dependencies.item.includes(recipe.id_item)) {
                        dependencies.item.push(recipe.id_item);
                        // Appel récursif pour le nouvel item trouvé
                        setRecipItemAndItemAndItem(recipe.id_item, data, dependencies, processedItems);
                    }
                }
            }
        });
    }
}

function setRecipeBuildingAndBuilding(id,data, dependencies) {
    if(Array.isArray(data.recipe_building)) {
        data.recipe_building.forEach(recipe => {
            if (recipe.ingredient_id_1 === id || 
                recipe.ingredient_id_2 === id || 
                recipe.ingredient_id_3 === id || 
                recipe.ingredient_id_4 === id || 
                recipe.ingredient_id_5 === id || 
                recipe.ingredient_id_6 === id ) {

                    // Ajouter la recette si elle n'est pas déjà présente
                    if(!dependencies.recipe_building.includes(recipe.id_recipe_building)) {
                        dependencies.recipe_building.push(recipe.id_recipe_building)

                        // Ajouter l'item associé s'il n'est pas déjà présent
                        if (!dependencies.building.includes(recipe.id_recipe_building)) {
                            dependencies.building.push(recipe.id_recipe_building);
                        }
                    }
                }
        });
    }

}

function setRecipeTransportationAndTransportation(id,data, dependencies) {
    if(Array.isArray(data.recipe_transportation)) {
        data.recipe_transportation.forEach(recipe => {
            if (recipe.ingredient_id_1 === id || 
                recipe.ingredient_id_2 === id || 
                recipe.ingredient_id_3 === id || 
                recipe.ingredient_id_4 === id || 
                recipe.ingredient_id_5 === id ) {

                    // Ajouter la recette si elle n'est pas déjà présente
                    if(!dependencies.recipe_transportation.includes(recipe.id_transportation_recipe)) {
                        dependencies.recipe_transportation.push(recipe.id_transportation_recipe)

                        // Ajouter l'item associé s'il n'est pas déjà présent
                        if (!dependencies.transportation.includes(recipe.id_transportation_recipe)) {
                            dependencies.transportation.push(recipe.id_transportation_recipe);
                        }
                    }
                }
        });
    }

}

function setFuel(id,data,dependencies) {
    if(Array.isArray(data.fuel)) {
        data.fuel.forEach(fuel => {
            if(fuel.id_item === id) {
                if(!dependencies.fuel.includes(fuel.id_fuel)){
                    dependencies.fuel.push(fuel.id_fuel);
                }
            }
        })
    }
}

function setFuelUsed(id,data,dependencies) {
    if(Array.isArray(data.fuel_used)) {
        data.fuel_used.forEach(fuel => {
            if(fuel.id_fuel === id) {
                if(!dependencies.fuels_used.includes(fuel.id_fuel_used)){
                    dependencies.fuels_used.push(fuel.id_fuel_used);
                }
            }
        })
    }
}


function setRecipItemAndItemAndItemWithBuilding(id, data, dependencies, isRecipe = false) {
    let listItems = []
    if(isRecipe) {
        dependencies.recipe_building.push(id);
        if(Array.isArray(data.building)) {
            data.building.forEach(building => {
                if(building.id_building === id) {
                    dependencies.building.push(building.id_building)
                }
            })
        }
    }else {
        dependencies.building.push(id);
        if(Array.isArray(data.recipe_building)) {
            data.recipe_building.forEach(building => {
                if(building.id_recipe_building === id) {
                    dependencies.recipe_building.push(building.id_recipe_building)
                }
            })
        }
    }
    

    if(Array.isArray(data.recipe_item)) {
        data.recipe_item.forEach(item => {
            if(item.building_id === id) {
                if(!listItems.includes(item.id_item)) {
                    listItems.push(item.id_item)
                }
            }
        })
    }

    listItems.forEach(item => {
        if(!dependencies.item.includes(item)) {
            setRecipItemAndItemAndItem(item,data,dependencies)
        }
        
    })
}

function setdDamageAndFauna(id,data,dependencies){
    dependencies.damage.push(id)
    if(Array.isArray(data.fauna)){
        data.fauna.forEach(fauna => {
            if(fauna.damage_fauna_id === id) {
                dependencies.fauna.push(fauna.id_fauna)
            }
        })
    }
}



module.exports = {
    findItemDependencies
};