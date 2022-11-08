const fs = require('fs');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');

class PlacesController {
  static getPlaceById = async (req, res, next) => { // :uid tells express that this is a dynamic url
    const placeId = req.params.pid; // { uid: 'p1' }
    //const place = DUMMY_PLACES.find(p => p.id === placeId);
    let place;
    try {
      place = await Place.findById(placeId).exec();
    } catch (error) {
      return next(new HttpError('Something went wrong, could not find the place'));
    }
    if (!place)
      return next(new HttpError('Could not find a place with the provided id.', 404));
    res.json(place.toObject({ getters: true }));// getters: true removes the underscore from the id property
    // { place } => { place: place }
  }
  static getPlacesByUserId = async (req, res, next) => { // :uid tells express that this is a dynamic url
    const creator = req.params.uid; // { uid: 'p1' }
    // filter() returns array of elements that matched the given criteria
    //const place = DUMMY_PLACES.filter(p => p.creator === creator);
    let places;
    try {
      const userWithPlaces = await User.findById(creator).populate('places');
      places = userWithPlaces.places;
    } catch (error) {
      return next(new HttpError('Something went wrong, could not find the place(s)', 500));
    }
    if (!places)
      return next(new HttpError('Could not find a place with the provided user id.', 404));
    res.json({ places: places.map(place => place.toObject({ getters: true })) }); // => { place } => { place: place }
  }
  static createPlace = async (req, res, next) => {
    const errors = validationResult(req);//errors will be empty if no input error has occured
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError('Invalid inputs passed', 422));
    }
    const { title, description, address } = req.body;

    const createdPlace = new Place({
      title,
      description,
      address,
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      image: req.file.path,
      creator: req.userData.userId
    });
    let user;
    try {
      user = await User.findById(req.userData.userId);
      if (!user)
        throw new Error('User does not exist', 500);
      //Sessions are used when there are multiple operations that don't
      //depend on each other but if one fails this means all the others should be undone
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({ session: sess }); //save() inserts the new document(Place) in the database 
      user.places.push(createdPlace);// This only adds the palce's id to the user's document
      await user.save({ session: sess });
      await sess.commitTransaction(); //Here all the operations are saved
      sess.endSession();

      sess.endSession();
    } catch (err) {
      return next(new HttpError(err, 500));

    }

    //DUMMY_PLACES.unshift(createdPlace); //Push to first place in the array;

    res.status(201).json(createdPlace);
  }
  static updatePlace = async (req, res, next) => {
    //Validation Results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError('Invalid inputs passed', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
      // place = await Place.findByIdAndUpdate(placeId, {title, description},{
      //   new: true,
      //   runValidators: true
      // }).exec();
      place = await Place.findById(placeId);
      //Check if the request is coming from an authorised user
      if(place.creator.toString() !== req.userData.userId) // req.userData.userId is dynamically added in check-auth middleware
        throw new HttpError('Authorization Error', 401)
      place.title = title;
      place.description = description;
      await place.save();
    } catch (error) {
      return next(error || new HttpError('Something went wrong, could not update the place', 500));
    }

    res.status(201).json(place);
  }
  static deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let imagePath;
    let place;
    try {
      place = await Place.findById(placeId).populate('creator');
      //populate(arg) -> arg is an object id of a document in another collection,
      //which populate() replaces by the actual document giving us full access to it 
      if (!place) throw new Error('Place does not exist'); 

      if(place.creator.id !== req.userData.userId)
        return next(new HttpError('Authorization Error', 401));
      imagePath = place.image;

      const session = await mongoose.startSession();
      session.startTransaction();
      await place.remove({session});// Removes the place from the places database
      place.creator.places.pull(place); //Removes the place from the user's array
      await place.creator.save({session});
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      return next(new HttpError('Deletion failed',500));
    }
    fs.unlink(imagePath, err => console.log(err));
    res.status(201).json({ message: 'Place deleted' });
  }
}

module.exports = PlacesController;