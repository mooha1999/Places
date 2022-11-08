const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


class UsersController {
    static getAllUsers = async (req, res, next) => {
        let users;
        try {
            users = await User.find({}, '-password');
        } catch (error) {
            return next(new HttpError('Could not retrieve users, try again later', 500));
        }
        res.status(200).json({ users: users.map(u => u.toObject({ getters: true })) });
    }
    static signUp = async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            console.log(errors);
            return next(new HttpError('Invalid inputs passed', 422));
        }
        const { name, email, password } = req.body;
        let existingUser, createdUser, token;
        try {
            existingUser = await User.findOne({ email }).exec();
            if (existingUser)
                throw new Error('Email already taken');


            const hashedPassword = await bcrypt.hash(password, 12);

            token = jwt.sign({
                userId: createdUser.id,
                email: createdUser.email,
            }, process.env.JWT_KEY, {expiresIn: '1h'});
            
            createdUser = new User({
                name,
                email,
                image: req.file.path,
                password: hashedPassword,
                places: []
            })
            await createdUser.save();

        } catch (error) {
            return next(new HttpError(error.message || 'Something went wrong, could not sign up', 500));
        }


        res.status(201).json({
            userId: createdUser.id,
            email: createdUser.email,
            token,
        });
    }
    static login = async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return next(new HttpError('Invalid inputs passed', 422));
        }
        const { email, password } = req.body;
        let user, token;
        try {
            user = await User.findOne({ email });
            if (!user)
                return next(new HttpError('Invalid credentials', 403));
            //compare hashed password with actual password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword)
                return next(new HttpError('Invalid credentials', 403));
            token = jwt.sign({
                userId: user.id,
            }, process.env.JWT_KEY, {expiresIn: '1h'});
        } catch (err) {
            return next(new HttpError('Something went wrong, could not login', 500));
        }
        res.status(200).json({
            userId: user.id,
            token,
        });
    }
}
module.exports = UsersController;