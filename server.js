const dotenv = require('dotenv');
const mongoose = require('mongoose');

// listen for all uncaught exceptions in the application

process.on('uncaughtException', err => {
    console.log(err);
    console.log(err.name, err.message);
    process.exit();
});

dotenv.config({
    path: './config.env'
});

const app = require('./index');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful!');
});

const port = process.env.PORT || 8000;

const server = app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Running on port ${port}`);
});

// listens to all unhandled promise rejections in the application

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);

    // waits for sever to close all connections and then exits the application

    server.close(() => {
        process.exit();
    });
});


// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// // listen for all uncaught exceptios in the application

// process.on('uncaughtException', err => {
//     console.log(err)
//     console.log(err.name, err.message);
//     process.exit();
// });

// dotenv.config({
//     path: './config.env'
// });

// const app = require('./index');

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// }).then(con => {
//     console.log('DB connection successful!')
// });


// const port = process.env.PORT || 8080;

// const server = app.listen(port, (err) => {
//     console.log(err);
//     console.log(`Running on port ${port}`);
// });

// // listens to all unhandled promise rejections in the application 

// process.on('unhandledRejection', err => {
//     console.log(err.name, err.message);

//     // waits for sever to close all conections and the exits the application

//     server.close(() => {
//         process.exit();
//     });
// });