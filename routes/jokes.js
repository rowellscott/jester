const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')

router.get('/', ensureLoggedIn('/login'), (req, res, next)=>{
  //Get all jokes from database and send to jokes/main.ejs for displlay
  Joke.find({}, (err, jokes)=>{
        if(err){return next(err)}  
        res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
    });
});

//Route for keyword searches 
router.post('/search', ensureLoggedIn('/login'), (req, res, next)=>{
  console.log(req.body.search);  
  Joke.find({"content": {"$regex": req.body.search, "$options": "i" }}, (err, jokes)=>{
    res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
  });
});

// router.get('/categories', ensureLoggedIn('/login'), (req, res, next)=>{
//   Joke.find({})
//   res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
// })

module.exports = router