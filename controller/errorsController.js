
const router = require('express').Router();

router.use((req, res) => {
    res.locals.title = 'Not Found Page';
    res.status(404);
    res.render('error/404');
})

router.use((error, req, res, next) => {
    res.status(500);
    res.send(`Server Not Working right now please try again later`);
    next();
})

module.exports = router;