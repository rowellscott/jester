const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')
const User = require('../models/user')

//Display User's Favorites List
router.get('/favorites/:id', (req, res, next)=>{
  User.findOne({"_id": req.params.id}, "_id favorites").exec((err, user) =>{
    if (!user) {return next(err)}
    Joke.find({"_id" : {"$in" : user.favorites}}, (err, favorites)=>{
    
    Joke.find({}, (err, jokes)=>{
      if(err){return next(err)} 
      //Create a List of Categories to Send to the Display
      var categories =[];
      
      jokes.forEach(joke =>{
        joke.categories.forEach(category => {
            if(category ==="None"){
              return
            }
           else if(categories.indexOf(category) === -1){
              console.log(category)
              categories.push(category)
            }
        })
      }) 
      //Sort Categories Alphabetically
        categories.sort();

        console.log(user.favorites)
        res.render("jokes/main", {categories: categories, jokes: favorites, layout: 'layouts/jokes', user: req.user})
      })
    })
  })
});

//Add or Remove Joke to User Favorites List
router.post('/favorites/:user_id/:joke', ensureLoggedIn('/login'), (req, res) => {
        User.findOne({"_id": req.params.user_id}, "favorites").exec((err, user) =>{
          if (err){
            res.redirect("/jokes");
            return
          }
            
        // Joke.findOne({"_id": req.params.joke}).exec((err, favorite)=>{
            var favoriteIndex = user.favorites.indexOf(req.params.joke)
         
            if (favoriteIndex > -1){
              user.favorites.splice(favoriteIndex, 1)
            } else {
              user.favorites.push(req.params.joke)
            }
            
            user.save((err) =>{
              if(err){return next(err)};
              res.redirect('/jokes')
            })  
   })
})



module.exports = router 