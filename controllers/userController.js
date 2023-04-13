const User = require("../models/userModel");
const errorCatcher = require("./../utilis/errorCatcher");
const AppError = require('./../utilis/appError');

const filteredParams = (body, ...params) => {
    const filteredFields = {};
    Object.keys(body).forEach(el => {
        if (params.includes(el)) {
            filteredFields[el] = body[el];
        }
    });
    return filteredFields;
}

exports.getAllUsers = errorCatcher(async (req, res, next) => {

    const users = await User.find().select('-trips');

    console.log(res);
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

exports.updateMe = errorCatcher(async (req, res, next) => {

    //create an error if trying to update passord
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not to update passwords. Try /updatePassword', 400))
    }

    //filter unwanted params
    const filteredFields = filteredParams(req.body, 'name', 'email');

    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredFields, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = errorCatcher(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    })

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.addUser = errorCatcher(async (req, res, next) => {
    res.status(500).json({
        status: 'failure',
        message: 'route not yet implemented addUser'
    });
});

exports.getUser = errorCatcher(async (req, res, next) => {
    res.status(500).json({
        status: 'faliure',
        message: 'route not yet implemented getUser'
    })
});

exports.updateUser = errorCatcher(async (req, res, next) => {
    res.status(500).json({
        status: 'faliure',
        message: 'route not yet implemented updateUser'
    })
});

exports.deleteUser = errorCatcher(async (req, res, next) => {
    res.status(500).json({
        status: 'faliure',
        message: 'route not yet implemented deleteUser'
    })
});