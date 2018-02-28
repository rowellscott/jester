const express = require('express');
const router = express.Router(); 
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')
const Joke = require('../models/joke')

const categories= []
function getCategories(){
  Joke.find({}, (err, jokes)=>{
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
    return categories.sort()
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
      res.render('jokes/new', {jokes: jokes, categories: categories, layout: "layouts/jokes", user: req.user});
  });
});

//Route for Saving a Joke from Add Joke Form
router.post('/', ensureLoggedIn('/login'), (req, res, next)=>{
    var content = req.body.newContent;
    var categories = req.body.category
    console.log(categories)
    
    // If One Checkbox Checked, Cast Variable to An Array
    if (Array.isArray(categories) === false && categories !== undefined){
      var categories = [req.body.category]
    }
    // Eliminate An Empty String From Entering Database
    if( req.body.newCategories !== ""){
      //Make Categories An Array if Undefined
      if (categories == undefined){
        categories = [];
      }
      // Split new categories into separate strings
      var newCategories = req.body.newCategories.split(", ")
      //Add Each New Category to Cateogries Array
      console.log(newCategories)
      newCategories.forEach((category) =>{
        categories.push(category);
      });
    }

       
     if (categories == undefined){
       categories=["None"]
     }
    
    if (content===""){
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

//Route for Displaying User Jokes 
router.get("/:id", ensureLoggedIn('/login'), (req, res, next)=>{
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
    
    var id= req.params.id;
    Joke.findById(id, (err, joke)=>{
      if (err) {return next(err)}
      res.render('jokes/edit', {categories: categories, layout: "layouts/jokes", user: req.user, joke: joke, message: req.flash('error')})
    })
  
  })
});


//Route for Displaying Category Searches
router.get("/categories/:category", (req, res, next)=>{
    var category = req.params.category;
    console.log(category)
    Joke.find({"categories": { $in : [category]}}, (err, jokes) =>{
        console.log(jokes)
        
    });

  });
// Route for Displaying Keyword Searches 
router.post('/search', ensureLoggedIn('/login'), (req, res, next)=>{
  console.log(req.body.query);  
  Joke.find({"content": {"$regex": req.body.query, "$options": "i" }}, (err, jokes)=>{
    console.log(jokes)
    // res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
    res.redirect('/jokes')
  });
});


//Route for Posting Updates to Database
router.post("/:id", ensureLoggedIn(), (req, res, next) =>{
    
    var id= req.params.id;  
    var content = req.body.content;
    var categories = req.body.editCategory
    console.log(categories)
    // If One Checkbox Checked, Cast Variable to An Array
    if (Array.isArray(categories) === false && categories !== undefined){
      var categories = [req.body.editCategory]
    }
    
    
    // Eliminate An Empty String From Entering Database
    if( req.body.newCategories !== ""){
      //Make Categories An Array if Undefined
      if (categories == undefined){
        categories = [];
      }
    // Split new categories into separate strings
    var newCategories = req.body.newCategories.split(", ")
    //Add Each New Category to Cateogries Array
    console.log(newCategories)
    newCategories.forEach((category) =>{
      categories.push(category);
    });
  }

    //If Categories, Set Categories Equal to None as Placeholder
    if (categories == undefined){
      categories=["None"]
    }
    
    if(content===""){
        res.redirect('/jokes/' + id + '/edit');
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

  // Delete Joke Route
  router.post('/:id/delete', ensureLoggedIn('/login'), (req, res, next)=>{
      var id = req.params.id
      Joke.findByIdAndRemove(id, (err, joke)=>{
          if(err){return next(err)}
          res.redirect('/jokes/' + joke.author)
      });
  });


// router.get("/search", (req, res, next)=>{
//   res.redirect('/jokes');
// });



// router.get('/categories', ensureLoggedIn('/login'), (req, res, next)=>{
//   Joke.find({})
//   res.render('jokes/main', {jokes: jokes, layout: 'layouts/jokes'});
// })

module.exports = router