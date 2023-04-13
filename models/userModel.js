const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    // name, photo, email, phone, password, passwordConfirm
    name: {
        type: String,
        require: [true, 'user must have a name'],
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
        minlength: 8,
        validate: {
            validator: function () {
                return this.password === this.passwordConfirm;
            },
            message: 'Passwords are not the same :('
        },
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm password']
    },
    passwordChangedAt: {
        type: Date
    },
    role: {
        type: String,
        required: [true, 'Please assign a role'],
        enum: ['case-manager', 'transport-coordinator', 'driver']
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    trips: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Trip'
    }]
});

// before saving the aquired data to the data base
// this midelware allows us to act on it

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({
        active: {
            $ne: false
        }
    });
    next();
});

userSchema.pre(/^find/, function (next) {
    this.populate('trips');
    next();
});

userSchema.methods.correctPassword = async function (PasswordToConfirm, password) {
    return await bcrypt.compare(PasswordToConfirm, password);
}

userSchema.methods.passwordChangedAfter = function (initiateTimeStamp) {

    if (this.passwordChangedAt) {
        const timeOfPaswordCreation = parseInt(this.passwordChangedAt.getTime(), 10);
        if (timeOfPaswordCreation < initiateTimeStamp) {
            return true;
        }
    }

    return false;

}

userSchema.methods.getResetToken = function () {
    const restToken = crypto.randomBytes(32).toString('hex');
    const encryptedRestToken = crypto.createHash('sha256').update(restToken).digest('hex');
    this.passwordResetToken = encryptedRestToken;
    this.passwordResetExpires = Date.now() + (1000 * 60 * 10);
    return restToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;