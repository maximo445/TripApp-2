const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');


const tripSchema = new mongoose.Schema({
    driverEmail: {
        type: String,
        lowercase: true,
        trim: true,
        require: true,
        default: 'unassigned@frc.org',
        validate: {
            validator: function (email) {
                const emailRegex = /^\S+@\S+\.\S+$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email address'
        }
    },
    children: {
        type: String,
        require: [true, 'children field can not be empty']
    },
    days: {
        type: [Number]
    },
    pickUp: String,
    dropOff: String,
    // pickUp: [{
    //     type: {
    //         type: String,
    //         default: 'Point',
    //         enum: ['Point']
    //     },
    //     coordinates: [Number],
    //     address: String,
    //     description: String
    // }],
    // dropOff: [{
    //     type: {
    //         type: String,
    //         default: 'Point',
    //         enum: ['Point']
    //     },
    //     coordinates: [Number],
    //     address: String,
    //     description: String
    // }],
    numOfChildren: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;