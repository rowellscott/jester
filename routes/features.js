const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const Joke = require("../models/joke");
const User = require("../models/user");
const urlBase = "https://jester-app.herokuapp.com";

//Display User's Favorites List
router.get("/favorites/:id", ensureLoggedIn("/login"), (req, res, next) => {
  User.findOne({ _id: req.params.id }, "_id favorites").exec((err, user) => {
    if (!user) {
      return next(err);
    }
    Joke.find({ _id: { $in: user.favorites } }, (err, favorites) => {
      Joke.find({}, (err, jokes) => {
        if (err) {
          return next(err);
        }
        //Create a List of Categories to Send to the Display
        var categories = [];

        jokes.forEach(joke => {
          joke.categories.forEach(category => {
            if (category === "None") {
              return;
            } else if (categories.indexOf(category) === -1) {
              console.log(category);
              categories.push(category);
            }
          });
        });
        //Sort Categories Alphabetically
        categories.sort();
        req.session.current_url = urlBase + "/favorites/" + req.params.id;
        console.log(user.favorites);
        res.render("jokes/main", {
          categories: categories,
          jokes: favorites,
          layout: "layouts/jokes",
          urlBase: urlBase,
          user: req.user
        });
      });
    });
  });
});

//Add or Remove Joke to User Favorites List
router.post(
  "/favorites/:user_id/:joke",
  ensureLoggedIn("/login"),
  (req, res) => {
    User.findOne({ _id: req.params.user_id }, "favorites").exec((err, user) => {
      if (err) {
        res.redirect("/jokes");
        return;
      }

      // Joke.findOne({"_id": req.params.joke}).exec((err, favorite)=>{
      var favoriteIndex = user.favorites.indexOf(req.params.joke);

      if (favoriteIndex > -1) {
        user.favorites.splice(favoriteIndex, 1);
      } else {
        user.favorites.push(req.params.joke);
      }

      user.save(err => {
        if (err) {
          return next(err);
        }
        res.json({ message: "Success" });
      });
    });
  }
);

//Post Rating To Database
router.post(
  "/ratings/:joke/:rating",
  ensureLoggedIn("/login"),
  (req, res, next) => {
    //Find all Users to Get Ratings for Each User
    User.find(
      { ratings: { $elemMatch: { jokeId: req.params.joke } } },
      "ratings",
      (err, users) => {
        if (err) {
          console.log(err);
          return next(err);
        }

        // console.log(users);
        //Find Average of All Ratings for Joke
        const userRatings = [];
        users.forEach(user => {
          // console.log(user);
          user.ratings.forEach(rating => {
            if (rating.jokeId.toString() === req.params.joke.toString()) {
              userRatings.push(rating.rating);
            }
          });
        });
        console.log("userRatings for Joke:", userRatings);

        let ratingsSum=0
        let count =0
       
        if(userRatings.length !==0){
        ratingsSum = userRatings.reduce((sum, current) => {
          return current + sum;
        });
        count = userRatings.length;
        const currentRating = ratingsSum / count;
      } 

        // console.log("currentRating:", currentRating);

        User.findById(req.user._id, (err, user) => {
          Joke.findById(
            { _id: req.params.joke },
            "rating ratingCount _id",
            (err, joke) => {
              if (err) {
                console.log(err);
                return next(err);
              }

              // console.log("currentRating:", currentRating);
              // console.log("joke:", joke);
              // console.log("user:", user);

              //Find User's Previous Rating For Joke If Applicable.
              let previousRating = 0;
            
              user.ratings.forEach(rating => {
                if (rating.jokeId.toString() === req.params.joke.toString()) {
                  previousRating = rating.rating;
                }
              });
              
              // console.log("previousUserRating:", previousRating);

              // let currentRating = joke.rating;

              let userRating = parseInt(req.params.rating, 10);
              console.log("userRating:", userRating);
              // let count = joke.ratingCount;
        

              let newRating = 0;
              console.log("count:", count);
              console.log("ratingsSum:", ratingsSum);
              console.log("previousRating:", previousRating);


              
              if (count > 1 || userRatings.length > 0) {
                //Check if There's a Previous Rating
                if (previousRating > userRating) {
                 
                  newRating = (ratingsSum - (previousRating - userRating))/count;
                  console.log("newRatingTop:", newRating);
                }   else if(previousRating = userRating){
                  newRating = previousRating
                } else if (previousRating < userRating) {
                  newRating = (ratingsSum + (userRating - previousRating))/(count + 1);
                  console.log("newRatingBtm:", newRating);
                }
              
                console.log("newRating:", newRating);
                //   (currentRating * count - 1 + userRating) / (count + 1);
                joke.rating = newRating.toFixed(1);
                // console.log("Joke Rating:", joke.rating);
              } else {
                joke.rating = userRating;
                // console.log("Joke Rating:", joke.rating);
              }

              //Add Rating to User Object In Database
              let ratingsBool = false;
              //If User Object Already Has Rating For the Joke, Update
              user.ratings.forEach((ratingTwo, index) => {
                if (ratingTwo.jokeId.equals(joke._id)) {
                  console.log("found");
                  user.ratings[index].rating = userRating;
                  ratingsBool = true;
                }
              });

              //If User Object Doesn't Have Rating For the Joke, Add
              if (ratingsBool === false) {
                user.ratings.push({ jokeId: joke._id, rating: userRating });
                joke.ratingCount = count + 1;
              }
              console.log("ratingCount:", joke.ratingCount, "Joke Rating:", joke.rating);

              joke.save(err => {
                if (err) {
                  return next(err);
                }
                user.save(err => {
                  if (err) {
                    return next(err);
                  }
                });
                // res.redirect(req.session.current_url);
                res.json({ rating: joke.rating });
              });
            }
          );
        });
      }
    );
  }
);

router.get("/share/:jokeId", ensureLoggedIn("/login"), (req, res, next) => {
  Joke.findById({ _id: req.params.jokeId }, (err, Thejoke) => {
    console.log("Share Joke:", Thejoke);
    console.log("Share Joke Id:", req.params.jokeId);
    if (err) {
      console.log("Share Error:", err);
      return next(err);
    }

    Joke.find({}, (err, jokes) => {
      if (err) {
        return next(err);
      }
      //Create a List of Categories to Send to the Display
      var categories = [];

      jokes.forEach(joke => {
        joke.categories.forEach(category => {
          if (category === "None") {
            return;
          } else if (categories.indexOf(category) === -1) {
            console.log(category);
            categories.push(category);
          }
        });
      });
      //Sort Categories Alphabetically
      categories.sort();

      //Cast the Joke As An Array For forEach in main.ejs
      Thejoke = [Thejoke];
      // console.log(user.favorites)
      res.render("jokes/main", {
        categories: categories,
        jokes: Thejoke,
        layout: "layouts/jokes",
        urlBase: urlBase,
        user: req.user
      });
    });
  });
});

module.exports = router;
