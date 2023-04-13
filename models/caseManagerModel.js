const mongoose = require('mongoose');
const validator = require('validator');

const caseManagerModel = mongoose.Schema({
    // name, photo, email, phone, password, passwordConfirm
    name: {
        type: String,
        require: [true, 'caseManager must have a name'],
        maxLength: 20
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: String,
        require: [true, 'caseManager must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'email format is not valid']
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        require: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm password']
    }
});

const CaseManager = mongoose.model('CaseManager', caseManagerModel);

module.exports = Driver;