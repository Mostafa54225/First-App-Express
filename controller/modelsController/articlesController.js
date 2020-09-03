const Articles = require('../../models/articles');
const articles = require('../../models/articles');

exports.findAllArticles = (req, res, next) => {
    Articles.find({})
        .exec().then(article => {
            req.data = article;
            next();
        }).catch(error => console.log(error));
}