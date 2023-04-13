// async functions return a promise or an error 
// I returned the function and inside in I catch the error
// and send it to the error stack with the next method


// this is a wrapper function that catches 
// the rejected mongoose promise in each method
// of the tripController module and sends it to the 
// error stack on the next parameter

module.exports = fn => {

    return (req, res, next) => {

        // same as catch(err => next(err))
        fn(req, res, next).catch(next);

    };

};