const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcryptjs');


module.exports = function initialize(passport) { 
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        let user = await User.findOne({email});
        if(!user) return done(null, false, {message: 'This email is not registered'});
        if(!await bcrypt.compare(password, user.password)) {
            return done(null, false, {message: 'Invalid Password'});
        }
        return done(null, user);
    }))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}