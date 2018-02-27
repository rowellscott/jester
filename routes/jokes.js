const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')


router.get('/', ensureLoggedIn('/login'), (req, res, next)=>{
  //Get all jokes from database and send to jokes/main.ejs for display
  Joke.find({}, (err, jokes)=>{
        if(err){return next(err)} 
        //Create a List of Categories to Send to the Display
        var categories =[];
        jokes.forEach(joke =>{
          joke.categories.forEach(category => {
              if(categories.indexOf(category) === -1){
                categories.push(category)
              }
          })
        }) 
        //Sort Categories Alphabetically
        categories.sort();
        res.render('jokes/main', {jokes: jokes, categories: categories, layout: 'layouts/jokes', user: req.user});
    });
});

router.get('/:id/new', ensureLoggedIn('/login'), (req, res, next) => {
    Joke.find({}, (err, jokes)=>{
      if(err){return next(err)} 
      //Create a List of Categories to Send to the Display
      var categories =[];
      jokes.forEach(joke =>{
        joke.categories.forEach(category => {
            if(categories.indexOf(category) === -1){
              categories.push(category)
            }
        })
      }) 
      //Sort Categories Alphabetically
      categories.sort();
      console.log(req.session)
      res.render('jokes/new', {jokes: jokes, categories: categories});
  });
});

// Route for keyword searches 
// router.post('/search', ensureLoggedIn('/login'), (req, res, next)=>{
//   console.log(req.body.search);  
//   Joke.find({"content": {"$regex": req.body.search, "$options": "i" }}, (err, jokes)=>{
//     res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
//   });
// });

// router.get('/categories', ensureLoggedIn('/login'), (req, res, next)=>{
//   Joke.find({})
//   res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
// })

module.exports = router