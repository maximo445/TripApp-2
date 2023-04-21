const express = require('express');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController')

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
router.get('/userPage', authController.protect, viewController.userPage);
router.get('/tripPage/:id', authController.protect, viewController.tripPage);
router.get('/driverInfo/:id', authController.protect, viewController.driverInfo);
// driverInfo/${driver._id}


module.exports = router;