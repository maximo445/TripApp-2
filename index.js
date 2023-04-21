const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const csp = require('helmet-csp');


const AppError = require('./utilis/appError');
const errorController = require('./controllers/errorController');
const tripRouter = require('./routes/tripRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

// if (process.env.NODE_ENV !== 'production') {
//     require('longjohn');
// }

const app = express();

//server side rendering template and static files
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers

// app.use(csp({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", `'sha256-${hash}'`],
//     scriptSrcAttr: ["'none'"]
//   }
// }));

// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//             'script-src': ["'self'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "maps.googleapis.com", "https://ajax.googleapis.com", "https://maxcdn.bootstrapcdn.com"],
//             'connect-src': ["'self'", "maps.googleapis.com", "maps.gstatic.com"],
//             'style-src': ["'self'", "cdn.jsdelivr.net"]
//         }
//     }
// }));

app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'", "maps.googleapis.com"],
        scriptSrc: ["'self'", "cdnjs.cloudflare.com", "maps.googleapis.com", "cdn.jsdelivr.net", "ajax.googleapis.com"],
        styleSrc: ["'self'", "cdn.jsdelivr.net", "unsafe-inline"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

const inlineScript = 'alert("Hello, world!")'
const hash = crypto.createHash('sha256').update(inlineScript).digest('base64');


//Limit requests from same api 
const limiter = rateLimit({
    max: 200,
    window: 60 * 60 * 1000,
    message: 'Limit of request exceded, try in one hour.'
});

app.use('/api', limiter);

//Enable JSON reading from the body in req.body
// app.use(bodyParser.urlencoded({
//     exended: false
// }))

// //Serving static files
// app.use(express.static(`${__dirname}/public`));

app.use(express.json({
    limit: '10kb'
}));

// read cookies in request
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Protect against parameter pollution
//Can pass {whitelist: ['parameter']} to allow duplication
//for certain parameters

app.use(hpp());

// test middleware

// app.use((req, res, next) => {
//     console.log(req.cookies);
//     next();
// })

//routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tripRouter);
app.use('/api/v1/users', userRouter);

// app.use((req, res, next) => {
//     console.log(`Expiration ${process.env.JWT_EXPIRES_IN}`);
// });

app.all('*', (req, res, next) => {

    // res.status(404).json({
    //     status: 'fail',
    //     message: `Route: ${req.originalUrl} is invalid`
    // })
    // next()

    // const err = Error(`Route: ${req.originalUrl} is invalid`);
    // err.status = 'fail';
    // err.statusCode = '404';
    // next(err);

    next(new AppError(`Route: ${req.originalUrl} is invalid`, 404));
});

//Error handling 
app.use(errorController);

module.exports = app;