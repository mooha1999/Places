const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const fs = require('fs');

const HttpError = require('./src/models/http-error');


const placesRoutes = require('./src/routes/places-routes');
const usersRoutes = require('./src/routes/users-routes');
const path = require('path');

const server = express();

server.use(bodyParser.json()); //Parse the request body into json format

server.use('/src/uploads/images', express.static(path.join('src/uploads', 'images')))

server.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); //The astric means that all domains have access
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
	next()
})

server.use('/api/places', placesRoutes);

server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
	throw new HttpError('Could not find this route.', 404);
})

server.use((error, req, res, next) => {
	//Multer adds 'file' property to the 'req' object if there is a file sent with the request
	if (req.file) {// Delete the file when there is an error
		fs.unlink(req.file.path, err => console.log(err));
	}
	//Check if the request has been already sent, if so forward the error to the next
	if (res.headerSent)
		return next(error);
	res.status(error.code || 500).json({ message: error.message || 'An unknown error occured' });
});
//* Connection string parameters:
//* username:password..../databaseName?...
mongoose
	.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cmcat.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
	.then(() => { server.listen(process.env.PORT || 5000) })
	.catch((val) => { console.log(val) })
