const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const articles = require('./modelsController/articlesController');
const {body, validationResult} = require('express-validator');
const User = require('../models/users');
const ensureAuthenticated = require('../config/auth');

router.get('/', articles.findAllArticles ,(req, res) => {
    res.render('articles', {
        articles: req.data,
        title: 'Articles'
    })
})


// Load edit form
router.get('/edit/:id', ensureAuthenticated , async (req, res) => {
    let articleId = req.params.id;
    try {
        let article = await Article.findById(articleId);
        if(article.author !== req.user.id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/articles');
        }
        res.render('edit_article', {
            title: `${article.title}`,
            article
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
    
        
})
//Update Information
router.post('/edit/:id', async (req, res) => {
    let query = {_id: req.params.id};
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    try{
        await Article.updateOne(query, article);
        req.flash('success', 'Article Updated Successfully');
        res.redirect('/articles');
    } catch(error) {
        console.log(error);
        throw error;
    }
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-article', {
        title: 'Add Article'
    });
});


router.post('/add', [
    body('title', `Title dosen't exists`).notEmpty(),
    // body('author', `author dosen't exists`).notEmpty(),
    body('body', `body dosen't exists`).notEmpty()
], (req, res) => {
    let title = req.body.title;
    let author = req.user._id;
    let body = req.body.body;
    const errors = validationResult(req).array();
    if(Object.keys(errors).length !== 0){
        res.render('add-article', {errors, title: 'Add Article', body});
     } else {
        let newArticle = new Article({title, author, body});
        newArticle.save().then(article => {
            req.flash('success', 'The Article added successfully');
            res.redirect('/articles')
        }).catch(error => {
            req.flash('error', `Their is something wrong`);
        });
    }
})


// get a single article
router.get('/:id', async (req, res) => {
    let articleId = req.params.id;
    try {
        let article = await Article.findById(articleId);
        let user = await User.findById(article.author);
        res.render('article', {
            title: `Article: ${article.title}`,
            article, author: user.name
        })    
    } catch (error) {
        console.log(error);
        throw error;
    }
});

// delete article using ajax function 
router.delete('/:id', ensureAuthenticated , async (req, res) => {
    let query = {_id: req.params.id};
    try {
        await Article.deleteOne(query);
        res.send('Succes');
    } catch (error) {
        console.log(error);
        throw error;
    }
    
})



module.exports = router;