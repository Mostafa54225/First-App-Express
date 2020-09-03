const express = require('express');
const app = express();
const error = require('./controller/errorsController');
const InitiateMongoServer = require('./config/db');
const session = require('express-session')
const flash = require('connect-flash');
const articlesRouter = require('./controller/articles');
const usersRouter = require('./controller/users');
const passport = require('passport');


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: 'secret_code',
    resave: true,
    saveUninitialized: true
}))

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
})

InitiateMongoServer();

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})



app.get('/', (req, res) => res.render('home', {title: 'Home Page'}))


app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use(error);

app.listen(app.get('port'), console.log(`Server is running on port: ${app.get('port')}`));