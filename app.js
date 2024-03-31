require('dotenv').config(); // Correct dotenv configuration

const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
const app = express();
const ErrorHandler = require('./utils/ErrorHandler');
const blogRouter=require('./routes/blogRouter')
const indexRouter = require('./routes/indexRouter');
const PORT = 3000;
require('./models/config');

// Body parser middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Db connection
const session = require('express-session');
const cookieparser = require('cookie-parser');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SECRET
}));
app.use(cookieparser());

app.use(fileupload());

const logger = require('morgan');
app.use(logger('tiny'));

// Your routes
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use('/', indexRouter);
app.use('/',blogRouter)
app.all("*", (req, res, next) => {
    next(new ErrorHandler(`requested url not found ${req.url}`, 404));
});

app.listen(PORT, () => { // Use PORT variable
    console.log(`Server is running on port ${PORT}`);
});
