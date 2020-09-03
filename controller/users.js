const router = require('express').Router();
const User = require('../models/users');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require('passport');
//Register form
router.get('/register', (req, res) => {
    res.render('register')
})


router.post('/register', [
    check('name', 'You Should write your name').notEmpty(),
    check('email', 'Email Invalid').isEmail(),
    check('username', 'You shoudld write your username').notEmpty(),
    check('password',  'Passwod is Invalid').notEmpty().isLength({min: 6})
]
, async (req, res) => {
    const {name, email, username, password, password2} = req.body;

    if(password) await check('password2', 'Passwords do not match').equals(password).run(req);
    const validationErrors = validationResult(req).array();
    if(Object.keys(validationErrors).length !== 0) res.status(400).json({validationErrors}); 
    let errors = [];
    
    try {
        const user = await User.findOne({email});
        if(user) {
            errors.push({msg: `This email is already registered`});
            res.render('register', {errors, name, email, username})
        } else {
            const newUser = new User({name, email, username, password});
            newUser.password = await bcrypt.hash(newUser.password, 10);
            try {
                await newUser.save();
                res.redirect('/users/login');
            } catch (error) {
                console.log(error);
                
            }
        }
    } catch (error) {
        console.log(error);
        
    }
})


router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login')
})

module.exports = router;