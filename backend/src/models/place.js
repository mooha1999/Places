const { Schema, model, default: mongoose } = require("mongoose");
const duplicate = {type: String, required: true};
// A schema is the blueprint of a document
const placeSchema = new Schema({
    title: duplicate,
    description: duplicate,
    image: duplicate,
    address: duplicate,
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    creator: {type: mongoose.Types.ObjectId, required: true, ref: "User"}
})
module.exports = model('Place', placeSchema);