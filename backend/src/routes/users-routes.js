const { Router } = require("express");
const { check } = require('express-validator');

const UsersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = Router();

router.get('/',UsersController.getAllUsers);
//Signup validators
const signupValidators = [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
    check('name').notEmpty(),
];
router.post('/signup', fileUpload.single('image'), signupValidators, UsersController.signUp);

signupValidators.pop();
router.post('/login', fileUpload.none(), signupValidators, UsersController.login);

module.exports = router;