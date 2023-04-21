const AppError = require("../utilis/appError");

const handleProductionCastError = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
}

const handleDuplicateIdDB = (error) => {
    const message = `The children cannot have the same name`;
    return new AppError(message, 400);
}

const handleValidationInputDB = (error) => {
    const message = error.message;
    return new AppError(message, 400);
}

const handleJWTError = () => {
    return new AppError('Invalid Token. Login Again :(', 401);
}

const handleJWTExpirationError = () => {
    return new AppError('Token Expired. Login Again :(', 401);
}

const sendDevErr = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).render('errorPage', {
            title: "Something Went Wrong!!",
            message: err.message
        });
    }
}

const sendProdErr = (err, req, res) => {
    //Operational error caused by our code
    if (req.originalUrl.startsWith('/api')) {
        
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
    
            // Error caused by the outside world. Don't give the client much information.
        } else {
            // sending error to user
            res.status(500).json({
                status: 'error',
                message: 'Awful error :('
            });
        }
    } else {
        res.status(err.statusCode).render('errorPage', {
            title: "Something Went Wrong!!",
            message: err.message
        });
    }
}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendDevErr(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {

        let error = JSON.parse(JSON.stringify(err));

        // cuased when entering wrong data types
        if (error.name === 'CastError') {
            error = handleProductionCastError(error);
        }

        if (error.code === 11000) {
            error = handleDuplicateIdDB(error);
        }

        if (error.name === 'ValidationError') {
            error = handleValidationInputDB(error);
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }

        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpirationError();
        }

        sendProdErr(error, req, res);
    }

}