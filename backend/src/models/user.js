const { Schema, model, default: mongoose } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const dup = {type: String, required: true};
const userSchema = new Schema({
    name: dup,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength: 6},
    image: dup,
    places: [{type: mongoose.Types.ObjectId, required: true, ref: "Place"}],
});
//This plugin queries the email faster and makes sure no 2 identical emails are created
userSchema.plugin(mongooseUniqueValidator);

// This tells mongoose to create a new collection with the given schema
//! When 'User' is passed as an argument the name of the collection will be 'users' 
module.exports = model('User', userSchema);
