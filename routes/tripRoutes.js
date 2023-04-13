const express = require('express');
const authController = require('./../controllers/authController');

const {
    getAllTrips,
    addTrip,
    getTrip,
    updateTrip,
    deleteTrip,
    getTripStats,
    assignTripToDriver,
    getCaseManagerTrips,
    getDriverTrips,
    getTripOnStatus
} = require('../controllers/tripController');

const router = express.Router();

router.route('/')
    .get(authController.protect, getAllTrips)
    .post(authController.protect, authController.restrictTo('case-manager'), addTrip);

router.route('/:id')
    .get(getTrip)
    .patch(updateTrip)
    .delete(authController.protect, authController.restrictTo('case-manager', 'transport-coordinator'), deleteTrip);

router.route('/assignTrip/:tripId/:driverEmail')
    .patch(authController.protect, authController.restrictTo('transport-coordinator'), assignTripToDriver);

router.route('/trip-stats')
    .get(getTripStats);

router.route('/getCaseManagerTrips')
    .get(authController.protect, getCaseManagerTrips);

router.route('/getDriverTrips/:email')
    .get(getDriverTrips);

router.route('/getTripOnStatus/:status')
    .get(getTripOnStatus);


// router.route('/:id')
//     .get(getTrip)
//     .patch(updateTrip)
//     .delete(authController.protect, authController.restrictTo('case-manager', 'transport-coordinator'), deleteTrip);

// router.route('/getCaseManagerTrips').get(authController.protect, getCaseManagerTrips);

// router.route('/getDriverTrips/:email').get(getDriverTrips);

// router.route('/getTripOnStatus/:status').get(getTripOnStatus);



// router.route('/assignTrip/:tripId/:driverEmail').patch(authController.protect, authController.restrictTo('transport-coordinator'), assignTripToDriver);

// router.route('/trip-stats').get(getTripStats);

module.exports = router;