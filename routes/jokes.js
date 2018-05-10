const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const Joke = require("../models/joke");
const User = require("../models/user");
const shortUrl = require("node-url-shortener");
const urlBase = "https://jester-app.herokuapp.com";

router.get("/", ensureLoggedIn("/login"), (req, res, next) => {
  //Get all jokes from database and send to jokes/main.ejs for display
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

    //Put User Ratings Into An Array
    const userRatings = [];
    req.user.ratings.forEach(rating => {
      userRatings.push(rating.rating);
    });

    const userRatingIds = [];
    req.user.ratings.forEach(rating => {
      userRatingIds.push(rating.jokeId.toString());
    });
    console.log(
      userRatings,
      userRatingIds,
      userRatingIds.indexOf(jokes[0]._id.toString()),
      jokes[0]._id
    );

    //Sort Categories Alphabetically
    categories.sort();
    req.session.current_url = urlBase + "/jokes";

    res.render("jokes/main", {
      jokes: jokes,
      categories: categories,
      layout: "layouts/jokes",
      urlBase: urlBase,
      user: req.user,
      userRatings: userRatings,
      userRatingIds: userRatingIds
    });
  });
});

router.get("/new", ensureLoggedIn("/login"), (req, res, next) => {
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
    res.render("jokes/new", {
      jokes: jokes,
      categories: categories,
      layout: "layouts/jokes",
      user: req.user,
      message: req.flash("add-message")
    });
  });
});

// Redirect if User Goes to Search
router.get("/search", ensureLoggedIn("/login"), (req, res, body) => {
  res.redirect("/jokes");
});

//Route for Saving a Joke from Add Joke Form
router.post("/", ensureLoggedIn("/login"), (req, res, next) => {
  var content = req.body.newContent;
  var categories = req.body.category;
  console.log(categories);

  // If One Checkbox Checked, Cast Variable to An Array
  if (Array.isArray(categories) === false && categories !== undefined) {
    var categories = [req.body.category];
  }
  // Eliminate An Empty String From Entering Database
  if (req.body.newCategories !== "") {
    //Make Categories An Array if Undefined
    if (categories == undefined) {
      categories = [];
    }
    // Split new categories into separate strings
    var newCategories = req.body.newCategories.split(", ");
    //Add Each New Category to Cateogries Array
    console.log(newCategories);
    newCategories.forEach(category => {
      categories.push(category);
    });
  }

  if (categories == undefined) {
    categories = ["None"];
  }

  if (content === "") {
    req.flash("add-message", "Please fill in content");
    return res.redirect("jokes/new");
  }

  const jokeInfo = {
    content,
    categories,
    author: req.user._id
  };

  const newJoke = new Joke(jokeInfo);

  newJoke.save(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/jokes/" + req.user._id);
  });
});

//Route for Displaying User Jokes
router.get("/:id", ensureLoggedIn("/login"), (req, res, next) => {
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

    //Put User Ratings Into An Array
    const userRatings = [];
    req.user.ratings.forEach(rating => {
      userRatings.push(rating.rating);
    });

    const userRatingIds = [];
    req.user.ratings.forEach(rating => {
      userRatingIds.push(rating.jokeId.toString());
    });

    req.session.current_url = urlBase + "/jokes/" + req.params.id;
    // Find Jokes Associated With User
    Joke.find({ author: req.params.id }, (err, jokes) => {
      console.log(categories);
      console.log(jokes);
      req.session.current_url = urlBase + "/jokes/" + req.params.id;
      res.render("jokes/myJokes", {
        jokes: jokes,
        categories: categories,
        layout: "layouts/jokes",
        user: req.user,
        userRatings: userRatings,
        userRatingIds: userRatingIds,
        urlBase: urlBase
      });
    });
  });
});

router.get("/:id/edit", (req, res, next) => {
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

    var id = req.params.id;
    console.log(categories);
    Joke.findById(id, (err, joke) => {
      if (err) {
        return next(err);
      }
      res.render("jokes/edit", {
        categories: categories,
        layout: "layouts/jokes",
        user: req.user,
        joke: joke,
        message: req.flash("edit-message")
      });
    });
  });
});

//Route for Displaying Category Searches
router.get(
  "/categories/:category",
  ensureLoggedIn("/login"),
  (req, res, next) => {
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

      //Put User Ratings Into An Array
      const userRatings = [];
      req.user.ratings.forEach(rating => {
        userRatings.push(rating.rating);
      });

      const userRatingIds = [];
      req.user.ratings.forEach(rating => {
        userRatingIds.push(rating.jokeId.toString());
      });

      var category = req.params.category;
      console.log(category);
      req.session.current_url =
        urlBase + "/jokes/categories/" + req.params.category;
      Joke.find({ categories: { $in: [category] } }, (err, jokes) => {
        console.log(jokes);
        res.render("jokes/main", {
          jokes: jokes,
          categories: categories,
          layout: "layouts/jokes",
          urlBase: urlBase,
          user: req.user,
          userRatings: userRatings,
          userRatingIds: userRatingIds
        });
      });
    });
  }
);

// Route for Displaying Keyword Searches
router.post("/search", ensureLoggedIn("/login"), (req, res, next) => {
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

    //Put User Ratings Into An Array
    const userRatings = [];
    req.user.ratings.forEach(rating => {
      userRatings.push(rating.rating);
    });

    const userRatingIds = [];
    req.user.ratings.forEach(rating => {
      userRatingIds.push(rating.jokeId.toString());
    });

    console.log(req.body.query);
    Joke.find(
      { content: { $regex: req.body.query, $options: "i" } },
      (err, jokes) => {
        console.log(jokes);
        res.render("jokes/main", {
          jokes: jokes,
          categories: categories,
          layout: "layouts/jokes",
          urlBase: urlBase,
          user: req.user,
          userRatings: userRatings,
          userRatingIds: userRatingIds
        });
      }
    );
  });
});

//Route for Posting Updates to Database
router.post("/:id", ensureLoggedIn(), (req, res, next) => {
  var id = req.params.id;
  var content = req.body.content;
  var categories = req.body.editCategory;
  console.log(categories);
  // If One Checkbox Checked, Cast Variable to An Array
  if (Array.isArray(categories) === false && categories !== undefined) {
    var categories = [req.body.editCategory];
  }

  // Eliminate An Empty String From Entering Database
  if (req.body.newCategories !== "") {
    //Make Categories An Array if Undefined
    if (categories == undefined) {
      categories = [];
    }
    // Split new categories into separate strings
    var newCategories = req.body.newCategories.split(", ");
    //Add Each New Category to Cateogries Array
    console.log(newCategories);
    newCategories.forEach(category => {
      categories.push(category);
    });
  }

  //If Categories, Set Categories Equal to None as Placeholder
  if (categories == undefined) {
    categories = ["None"];
  }

  if (content === "") {
    req.flash("edit-message", "Please fill in content");
    return res.redirect("/jokes/" + id + "/edit");
  }

  const updates = {
    content,
    categories
  };

  Joke.findByIdAndUpdate(id, updates, (err, joke) => {
    if (err) {
      return next(err);
    }
    res.redirect("/jokes/" + joke.author);
  });
});

// Delete Joke Route
router.post("/:id/delete", ensureLoggedIn("/login"), (req, res, next) => {
  var id = req.params.id;
  Joke.findByIdAndRemove(id, (err, joke) => {
    if (err) {
      return next(err);
    }
    res.redirect("/jokes/" + joke.author);
  });
});

module.exports = router;
