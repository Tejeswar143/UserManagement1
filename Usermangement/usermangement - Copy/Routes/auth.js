const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

//user register
router.post('/register', authController.register);

//admin register
router.post('/admin-register', authController.adminRegister);

//both admin and user login
router.post('/login', authController.login);

module.exports = router;

