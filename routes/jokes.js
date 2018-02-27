const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')

const categories= []
function getCategories(){
  Joke.find({}, (err, categories)=>{
    if(err){return next(err)} 
    // Create a List of Categories to Send to the Display
    jokes.forEach(joke =>{
      joke.categories.forEach(category => {
          if(categories.indexOf(category) === -1){
            categories.push(category)
          }
      })
    }) 
    // Sort Categories Alphabetically
    categories.sort()
});
}


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
      res.render('jokes/new', {jokes: jokes, categories: categories, layout: "layouts/jokes", user: req.user});
  });
});

//Route for Saving a Joke from Add Joke Form
router.post('/', ensureLoggedIn('/login'), (req, res, next)=>{
    var content = req.body.newContent;
    if( req.body.category.indexOf(",") !== -1){
      var categories = req.body.category
    }
    else{
      var categories=[req.body.category]
    }
    console.log(req.body.newCategories)
    if(req.body.newCategories !== ""){
    var newCategories = req.body.newCategories.split(", ")
    newCategories.forEach((category) =>{
      categories.push(category);
    });
    } 

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
    });
});

//Route for User Jokes 
router.get("/:id", ensureLoggedIn('/login'), (req, res, next)=>{
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
     
    Joke.find({author: req.params.id}, (err, jokes)=>{
        console.log(categories)
        res.render('jokes/myJokes', {jokes: jokes, categories: categories, layout: 'layouts/jokes', user: req.user});
    }); 
  });
});

router.get("/:id/edit", (req, res, next)=>{
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
  
    var id= req.params.id;
    Joke.findById(id, (err, joke)=>{
      if (err) {return next(err)}
      res.render('jokes/edit', {categories: categories, layout: "layouts/jokes", user: req.user, joke: joke})
    })
  
  })
});

router.post("/:id", ensureLoggedIn(), (req, res, next) =>{
    
    var id= req.params.id;  
    var content = req.body.content;
    var categories = req.body.category;
    if( req.body.category.indexOf(",") !== -1){
      var categories = req.body.category
    }
    else{
      var categories=[req.body.category]
    }
    
    if(req.body.newCategories !== ""){
    var newCategories = req.body.newCategories.split(", ")
    newCategories.forEach((category) =>{
      categories.push(category);
    });
    } 

    if(content===""){
        res.redirect('jokes/' + id + '/edit');
    }

    const updates = {
      content, 
      categories,
    }
   
    Joke.findByIdAndUpdate(id, updates, (err, joke)=>{
      if (err){return next(err)}
      res.redirect('/jokes/'+ joke.author)
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