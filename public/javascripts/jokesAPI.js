const API = "https:/jester-app.herokuapp.com";

$(function() {
  $('[data-toggle="popover"]').popover();
});

$(document).ready(() => {
  //Color Stars According to User Rating in Database on
  const ratingsTwo = document.getElementsByClassName("rating");

  Array.from(ratingsTwo).forEach(element => {
    let starsTwo = element.children;

    Array.from(starsTwo).forEach(star => {
      let rating = element.dataset.rating;
      let starValue = parseInt(star.dataset.value, 10);
      if (starValue <= rating) {
        star.classList.remove("glyphicon-star-empty");
        star.classList.add("glyphicon-star");
        //Class to Indicate to Mouseover and Mouseout Functions that Rating Has Been Clicked
        star.classList.add("selected");
        //If Star is Already Selected, Remove Coloring If Clicked Star is To Left
      } else if (starValue > rating && star.classList.contains("selected")) {
        star.classList.remove("selected");
      }
    });
  });

  //Favorites Buttons Functionality
  const favButtons = document.getElementsByClassName("fav");

  Array.from(favButtons).forEach(element => {
    element.addEventListener("click", function(e) {
      e.preventDefault();

      //Get User ID and Joke ID from Html Tag to Send In Post Request
      const userID = e.currentTarget.dataset.user;
      const jokeID = e.currentTarget.dataset.joke;

      //Toggle Background Color
      e.currentTarget.classList.toggle("favorited");

      axios
        .post(`${API}/favorites/${userID}/${jokeID}`, {})
        .then(res => {
          console.log(res.status);
        })
        .catch(err => {
          console.log(err);
        });
    });
  });

  //Ratings Stars Functionality
  const ratings = document.getElementsByClassName("star");

  Array.from(ratings).forEach(element => {
    //Color Stars to the Left On Mouseover the Star
    element.addEventListener("mouseover", function(e) {
      var onStar = parseInt(e.currentTarget.dataset.value, 10);

      //Select All Stars For The Joke.
      const parent = e.currentTarget.parentElement;
      const children = Array.from(parent.children);

      //Eliminate Ratings Value Node From List
      const stars = [];
      for (i = 0; i < 5; i++) {
        stars.push(children[i]);
      }

      //Color All Stars Left of the Hovered Star
      stars.forEach(star => {
        let starValue = parseInt(star.dataset.value, 10);
        //If Star Is Left Of Hovered Star and Has Star Class (To Eliminate Ratings Value), Remove Coloring
        if (starValue <= onStar) {
          star.classList.remove("glyphicon-star-empty");
          star.classList.add("glyphicon-star");
        }
      });
    });

    //Remove Color From Stars on Mouseout
    element.addEventListener("mouseout", function(e) {
      var onStar = parseInt(e.currentTarget.dataset.value, 10);

      //Select All Stars For The Joke.
      const parent = e.currentTarget.parentElement;
      const children = Array.from(parent.children);

      //Eliminate Ratings Value Node From List
      const stars = [];
      for (i = 0; i < 5; i++) {
        stars.push(children[i]);
      }

      //Remove Coloring From All Stars
      stars.forEach(star => {
        //If Star Has Not Been Selected By Click Function, Remove Coloring
        if (star.classList.contains("selected") !== true) {
          star.classList.remove("glyphicon-star");
          star.classList.add("glyphicon-star-empty");
        }
      });
    });

    //Send Rating To Database on Click and Color Stars Appropriately
    element.addEventListener("click", function(e) {
      const jokeID = e.currentTarget.dataset.joke;
      var rating = parseInt(e.currentTarget.dataset.value, 10);

      //Select Stars For the Joke
      const parent = e.currentTarget.parentElement;
      const stars = Array.from(parent.children);

      //Color Stars To Left Of Clicked Star
      stars.forEach(star => {
        let starValue = parseInt(star.dataset.value, 10);
        if (starValue <= rating) {
          star.classList.remove("glyphicon-star-empty");
          star.classList.add("glyphicon-star");
          //Class to Indicate to Mouseover and Mouseout Functions that Rating Has Been Clicked
          star.classList.add("selected");
          //If Star is Already Selected, Remove Coloring If Clicked Star is To Left
        } else if (starValue > rating && star.classList.contains("selected")) {
          star.classList.remove("selected");
        }
      });

      //Submit Form to Star's Post Route in Ratings.js
      axios
        .post(`${API}/ratings/${jokeID}/${rating}`, {})
        .then(res => {
          console.log(res.status);
          // Set Avg. Rating Display to New Rating
          stars[5].innerHTML = `Avg. ${res.data.rating}`;
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});
