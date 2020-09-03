module.exports = function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'Please login')
        res.redirect('/users/login');
    }
}