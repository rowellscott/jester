const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')

function getCategories(){
  Joke.find({}, 'categories', (err, categories)=>{
    if(err){return next(err)} 
    // Create a List of Categories to Send to the Display
    var categories =[];
    jokes.forEach(joke =>{
      joke.categories.forEach(category => {
          if(categories.indexOf(category) === -1){
            categories.push(category)
          }
      })
    }) 
    // Sort Categories Alphabetically
    console.log(categories.sort())
    return categories
    // console.log(req.session)
    // res.render('jokes/new', {jokes: jokes, categories: categories, layout: "layouts/jokes"});
});
}

router.get('/', ensureLoggedIn('/login'), (req, res, next)=>{
  //Get all jokes from database and send to jokes/main.ejs for display
  getCategories();
  
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

router.get('/new', ensureLoggedIn('/login'), (req, res, next) => {
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
      res.render('jokes/new', {jokes: jokes, categories: categories, layout: "layouts/jokes"});
  });
});

//Route for Saving a Joke from Add Joke Form
router.post('/', ensureLoggedIn('/login'), (req, res, next)=>{
  
    var content = req.body.newContent;
    //Get Categories from Checkboxes and Put Into an Array
    if( typeof(req.body.category) !== "Array"){
      var categories = [req.body.category];
    }
    else{
      var categories = req.body.category
    }
    
    var newCategories = req.body.newCategories.split(", ")
    newCategories.forEach((category) =>{
      categories.push(category);
    });

    if(content===""){
        res.redirect('jokes/new');
    }
    
    const jokeInfo = {
      content, 
      categories,
      author: req.user._id
    }
    
    const newJoke = new Joke(jokeInfo);
    
    newJoke.save((err)=>{
        if (err) {return next(err)};
        res.redirect('/jokes')  
    })
    
});

//Route for User Jokes 
router.get("/:id", (req, res, next)=>{
      Joke.find({username: req.params.id}, (err, jokes)=>{
        res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes', user: req.user});
  });
});

// Route for keyword searches 
router.post('/search', ensureLoggedIn('/login'), (req, res, next)=>{
  console.log(req.body.search);  
  Joke.find({"content": {"$regex": req.body.search, "$options": "i" }}, (err, jokes)=>{
    console.log(jokes)
    res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
  });
});

// router.get('/categories', ensureLoggedIn('/login'), (req, res, next)=>{
//   Joke.find({})
//   res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
// })

module.exports = router