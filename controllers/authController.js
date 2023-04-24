const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
    promisify
} = require('util');
const User = require('./../models/userModel');
const errorCatcher = require('./../utilis/errorCatcher');
const AppError = require('./../utilis/appError');
const emaiJS = require('./../utilis/email');

const tokenSignIn = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {

    const token = tokenSignIn(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = errorCatcher(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    createSendToken(newUser, 201, res);
    // const token = await tokenSignIn(newUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // });
});

exports.login = errorCatcher(async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    // check if password and email exist in request

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 401))
    }

    // get the user by the email
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user) return next(new AppError('Wrong email or password', 401));

    const passwordMatched = await user.correctPassword(password, user.password);

    if (!passwordMatched) {
        return next(new AppError('Wrong email or password', 401));
    }

    createSendToken(user, 201, res);
    // const token = tokenSignIn(user._id);

    // res.status(201).json({
    //     status: 'success',
    //     token
    // });
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'hhhtttvvv', {
        expires: new Date(Date.now() + 10 * 1000),
        httOnly: true
    })
    req.isLoggedIn = false;
    req.userId = undefined;
    res.status(200).json({status: 'success'});
}

exports.protect = errorCatcher(async (req, res, next) => {

    let token;

    // check if token exist
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    
    if (req.cookies?.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    // check that token works (not tampered or expired)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exist
    const currentUser = await User.findById(decoded.id).select('+password');

    if (!currentUser) {
        return next(new AppError('User does not exist. Sad :(', 401));
    }

    //check if password changed
    if (currentUser.passwordChangedAfter(decoded.iat)) {
        return next(new AppError('Password changed recently :(', 401));
    }

    req.user = currentUser;

    next();

});

exports.isLoggedIn = async (req, res, next) => {

    try {
        // check if token exist
        if (req.cookies?.jwt) {

            // check that token works (not tampered or expired)
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            //check if user still exist
            const currentUser = await User.findById(decoded.id).select('+password');

            if (!currentUser) {
                return next();
            }

            //check if password changed
            if (currentUser.passwordChangedAfter(decoded.iat)) {
                return next();
            }

            res.locals.user = currentUser;
            req.isLoggedIn = true;
            req.userId = currentUser._id;

            return next();
        }
    } catch (err) {
        return next()
    }

    next();
};

exports.transportCoordinatorExis = (req, res, next) => {
    
    const exist = User.exists({role: 'transport-coordinator'});
    if (exist) {
        return next(new AppError('There can only be one transport coordinator :(', 401));
    }

    next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        //check if user role is in ...roles
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not athorized to change this trip', 403))
        }

        next();

    }
}

exports.forgotPassword = errorCatcher(async (req, res, next) => {

    const currentUser = await User.findOne({
        email: req.body.email
    });

    if (!currentUser) {
        return next(new AppError('Please enter a valid email', 401));
    }

    const resetToken = currentUser.getResetToken();
    console.log(`email: ${currentUser.email}`);
    await currentUser.save({
        validateBeforeSave: false
    });

    try {

        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
        await emaiJS.sendEmail({
            email: currentUser.email,
            subject: 'Password Reset Instructions',
            message: `Click on the following url to reset password\n\n${resetURL}`
        });

        res.status(200).json({
            message: "Password reset instructions sent to email"
        });

    } catch (err) {
        currentUser.passwordResetToken = undefined;
        currentUser.passwordResetExpires = undefined;
        currentUser.save({
            validateBeforeSave: false
        })
        console.log(err);
        return next(new AppError('Something went wrong sending email. Please try again later :(', 500));
    }

});

exports.resetPassword = errorCatcher(async (req, res, next) => {

    // 1) get user based on the token    

    const pwHashToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const currentUser = await User.findOne({
        passwordResetToken: pwHashToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });

    if (!currentUser) {
        return next(new AppError('Token invalid or Token Expired', 401));
    }

    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.passwordConfirm;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();

    createSendToken(currentUser, 201, res);
    // const token = tokenSignIn(currentUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token
    // });

});

exports.updatePassword = errorCatcher(async (req, res, next) => {

    //get user from collection
    const submitedPassword = req.body.password;
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    //get currently loggeg user
    const currentUser = await User.findById(req.user.id).select('+password');

    if (!currentUser) {
        return next(new AppError('Invalid email or password', 401));
    }

    //check that submited password is correct
    const passwordIsCorrect = await currentUser.correctPassword(submitedPassword, currentUser.password);

    if (!passwordIsCorrect) {
        return next(new AppError('Invalid email or password', 401));
    }

    //update password
    currentUser.password = newPassword;
    currentUser.passwordConfirm = newPasswordConfirm;
    await currentUser.save();

    //login user
    createSendToken(currentUser, 201, res);

    // const token = tokenSignIn(currentUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token
    // });

});