const Trip = require('./../models/tripModel');
const User = require('./../models/userModel');
const ApiFeatures = require('./../utilis/apiFeatures');
const errorCatcher = require('./../utilis/errorCatcher');
const AppError = require('./../utilis/appError');

exports.getAllTrips = errorCatcher(async (req, res, next) => {

    // --Form Query-- //
    const apiFeatures = new ApiFeatures(Trip.find(), req.query).filter();

    //--Excute the query--//
    const tours = await apiFeatures.query;

    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    })

});

exports.addTrip = errorCatcher(async (req, res, next) => {

    const newTrip = await Trip.create(req.body);

    newTrip.createdBy = req.user.id;

    await newTrip.save({
        validateBeforeSave: false
    });

    res.status(201).json({
        status: 'success',
        data: {
            trip: newTrip
        }
    });

});

exports.getTrip = errorCatcher(async (req, res, next) => {

    const tour = await Trip.findById(req.params.id);

    if (!tour) {
        return next(new AppError('Invalid ID. No trip has that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    });

});

exports.getTripOnStatus = errorCatcher(async (req, res, next) => {

    if (req.params.status === undefined) {
        return next(new AppError('You need to add a status', 400));
    }

    if (!['pending', 'approved', 'rejected'].includes(req.params.status) || !req.params.status) {
        return next(new AppError('That status is invalid', 400));
    }

    const trips = await Trip.find({
        status: req.params.status
    });

    res.status(200).json({
        status: 'success',
        data: {
            trips
        }
    });
});

exports.getCaseManagerTrips = errorCatcher(async (req, res, next) => {

    const trips = await Trip.find({
        createdBy: req.user.id
    });

    res.status(200).json({
        status: 'success',
        data: {
            trips
        }
    });
});

exports.getDriverTrips = errorCatcher(async (req, res, next) => {

    const driverExist = User.exists({
        email: req.params.email
    });

    if (!driverExist) {
        return next(new AppError('No driver has that email', 404));
    }

    const trips = await Trip.find({
        driverEmail: req.params.email
    });

    res.status(200).json({
        status: 'success',
        data: {
            trips
        }
    });
});

exports.assignTripToDriver = errorCatcher(async (req, res, next) => {

    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
        return next(new AppError('Invalid ID. No trip has that id', 404));
    }

    trip.status = "approved";
    await trip.save();

    const driver = await User.findOne({
        email: req.params.driverEmail
    });

    if (!driver) {
        return next(new AppError('No driver has that email address', 404));
    }

    if (driver.role !== 'driver') {
        return next(new AppError('That user is not a driver', 404));
    }

    trip.driverEmail = req.params.driverEmail;

    await trip.save();

    res.status(200).json({
        status: 'success',
        data: {
            assignedTo: trip.driverEmail
        }
    });

});

exports.deleteTrip = errorCatcher(async (req, res, next) => {

    Trip.findById(req.params.id, (err, trip) => {
        if (err) {
            return next(new AppError('Invalid ID. No trip has that id', 404));
        } else if (req.user.id !== trip.createdBy) {
            console.log(trip);
            return next(new AppError('Not your trip. You can not delete it', 401));
        } else {
            trip.remove(err => {
                if (err) {
                    return next(new AppError(err.message, 500));
                } else {
                    res.status(204).json({
                        status: 'success',
                        data: 'null'
                    });
                }
            })
        }
    });




});

exports.updateTrip = errorCatcher(async (req, res, next) => {

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
    });

    if (!updatedTrip || !req.body) {
        return next(new AppError('Invalid ID. No trip has that id', 404));
    }

    console.log(updatedTrip);

    res.status(200).json({
        status: 'success',
        data: {
            tour: updatedTrip
        }
    });

});

exports.getTripStats = errorCatcher(async (req, res, next) => {

    const stats = await Trip.aggregate([{
        $match: {
            numOfChildren: {
                $gte: 1
            }
        },

    }, {
        $group: {
            _id: null,
            numTrips: {
                $count: 1
            }
        }
    }]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});