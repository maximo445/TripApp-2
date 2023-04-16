const express = require('express');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController')

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
router.get('/userPage', authController.protect, viewController.userPage);
router.get('/tripPage/:id', authController.protect, viewController.tripPage);

module.exports = router;