const User = require('../models/userModel');
const Trip = require('../models/tripModel');
const errorCatcher = require('./../utilis/errorCatcher');

exports.login = errorCatcher(async (req, res, next) => {

    res.status(200).render('loginForm', {
        title: "Welcome"
    });
});

exports.userPage = errorCatcher(async (req, res, next) => {

    console.log('Driver email: ',  req.user.email);
    console.log('User role: ', req.user.role);

    let trips = null;

    if (req.user.role === 'driver')  {
        trips = await Trip.find({driverEmail: req.user.email});
    } else if (req.user.role === 'case-manager')  {
        trips = await Trip.find({createdBy: req.user._id});
    } else if (req.user.role === 'transport-coordinator') {
        trips = await Trip.find({status: 'pending'});
    }

    
    res.status(200).render('userPage', {
        title: "Welcome",
        trips
    });
});

exports.tripPage = errorCatcher(async (req, res, next) => {

    const trip = await Trip.findById(req.params.id);

    const drivers = await User.find({role: 'driver'});
    
    res.status(200).render('tripPage', {
        title: "Welcome",
        trip,
        drivers
    });
});