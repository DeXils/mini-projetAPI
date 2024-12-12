var express = require('express');
var router = express.Router();
const itemsController = require('../controllers/itemsController');
const buildingsController = require('../controllers/buildingsController');
const transportationsController = require('../controllers/transportationsController');
const fuelsController = require('../controllers/fuelsController');
const damagesController = require('../controllers/damagesController');
const faunasController = require('../controllers/faunasController');
const fuelUsedController = require('../controllers/fuelUsedController');
const RecipeItemsController = require('../controllers/recipeItemsController');
const RecipeBuildingsController = require('../controllers/recipeBuildingsController');
const RecipeTransportationsController = require('../controllers/recipeTransportationsController');


// --------------ITEMS--------------
// --POST--
router.post('/items',itemsController.postItem);
// --GET--
router.get('/items', itemsController.getItems)
router.get('/items/:id', itemsController.getItemById);
// --PUT--
router.put('/items',itemsController.putItem);
// --DELETE--
router.delete('/items/:id',itemsController.deleteItem);

// --------------BUILDINGS--------------
// --POST--
router.post('/buildings',buildingsController.postBuilding);
// --GET--
router.get('/buildings', buildingsController.getBuilding);
router.get('/buildings/:id', buildingsController.getBuildingById);
// --PUT--
router.put('/buildings',buildingsController.putBuilding);
// --DELETE--
router.delete('/buildings/:id',buildingsController.deleteBuilding);

// --------------BUILDINGS--------------
// --POST--
router.post('/transportations',transportationsController.postTransportation);
// --GET--
router.get('/transportations', transportationsController.getTransportation);
router.get('/transportations/:id', transportationsController.getTransportationById);
// --PUT--
router.put('/transportations',transportationsController.putTransportation);
// --DELETE--
router.delete('/transportations/:id',transportationsController.deleteTransportation);


// --------------FUEL--------------
// --POST--
router.post('/fuels',fuelsController.postFuel);
// --GET--
router.get('/fuels', fuelsController.getFuel );
router.get('/fuels/:id', fuelsController.getFuelById);
// --PUT--
router.put('/fuels', fuelsController.putFuel);
// --DELETE--
router.delete('/fuels/:id',fuelsController.deleteFuel);

// --------------DAMAGE--------------
// --POST--
router.post('/damages',damagesController.postDamage);
// --GET--
router.get('/damages', damagesController.getDamage);
router.get('/damages/:id', damagesController.getDamageById);
// --PUT--
router.put('/damages', damagesController.putDamage);
// --DELETE--
router.delete('/damages/:id',damagesController.deleteDamage);

// --------------FAUNA--------------
// --POST--
router.post('/faunas',faunasController.postFauna);
// --GET--
router.get('/faunas', faunasController.getFauna);
router.get('/faunas/:id', faunasController.getFaunaById);
// --PUT--
router.put('/faunas', faunasController.putFauna);
// --DELETE--
router.delete('/faunas/:id',faunasController.deleteFauna);

// --------------FUEL_USED--------------
// --POST--
router.post('/fuel_used',fuelUsedController.postFuelUsed);
// --GET--
router.get('/fuel_used', fuelUsedController.getFuelUsed);
router.get('/fuel_used/:id', fuelUsedController.getFuelUsedById);
// --PUT--
router.put('/fuel_used', fuelUsedController.putFuelUsed);
// --DELETE--
router.delete('/fuel_used/:id',fuelUsedController.deleteFuelUsed);

// --------------RECEIP_ITEM--------------
// --POST--
router.post('/recipe_items',RecipeItemsController.postRecipeItem);
// --GET--
router.get('/recipe_items', RecipeItemsController.getRecipeItem);
router.get('/recipe_items/:id', RecipeItemsController.getRecipeItemById);
// --PUT--
router.put('/recipe_items', RecipeItemsController.putRecipeItem);
// --DELETE--
router.delete('/recipe_items/:id',RecipeItemsController.deleteRecipeItem);

// --------------RECEIP_BUILDING--------------
// --POST--
router.post('/recipe_buildings',RecipeBuildingsController.postRecipeBuilding);
// --GET--
router.get('/recipe_buildings', RecipeBuildingsController.getRecipeBuilding);
router.get('/recipe_buildings/:id', RecipeBuildingsController.getRecipeBuildingById);
// --PUT--
router.put('/recipe_buildings', RecipeBuildingsController.putRecipeBuilding);
// --DELETE--
router.delete('/recipe_buildings/:id',RecipeBuildingsController.deleteRecipeBuilding);

// --------------RECEIP_TRANSPORTATION--------------
// --POST--
router.post('/recipe_transportations',RecipeTransportationsController.postRecipeTransportation );
// --GET--
router.get('/recipe_transportations', RecipeTransportationsController.getRecipeTransportation);
router.get('/recipe_transportations/:id', RecipeTransportationsController.getRecipeTransportationById);
// --PUT--
router.put('/recipe_transportations', RecipeTransportationsController.putRecipeTransportation);
// --DELETE--
router.delete('/recipe_transportations/:id',RecipeTransportationsController.deleteRecipeTransportation);

module.exports = router;

 