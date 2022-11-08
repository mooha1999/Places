const {Router} = require('express');
const { check } = require('express-validator');

const PlacesController = require('../controllers/places-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload')

const router = Router();
//Get a place with its id
router.get('/:pid', PlacesController.getPlaceById);
//Get all the places created by a given id
router.get('/user/:uid', PlacesController.getPlacesByUserId);
//This route is used to prevent unauthorised users from accessing the later routes
router.use(checkAuth);
//Input validation
const newPlaceValidators = [
    check('title').notEmpty(),
    check('description').isLength({min: 5}),
    check('address').notEmpty(),
];
//Create a new place
router.post('/', fileUpload.single('image'),newPlaceValidators, PlacesController.createPlace);
newPlaceValidators.pop();
//Update existing place
router.patch('/:pid', newPlaceValidators, PlacesController.updatePlace);
//Delete place
router.delete('/:pid', PlacesController.deletePlace);

module.exports = router;