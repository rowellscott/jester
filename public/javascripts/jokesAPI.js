// const jokesAPI = new APIHandler("http://localhost:3000");

const API = "http://localhost:3000";

$(function() {
  $('[data-toggle="popover"]').popover();
});

$(document).ready(() => {
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
          console.log(star);
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
          console.log(star);
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
        }
      });

      //Submit Form to Star's Post Route in Ratings.js
      axios
        .post(`${API}/ratings/${jokeID}/${rating}`, {})
        .then(res => {
          console.log(res.status);
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

//   // List All Jokes
//   jokesAPI.getFullList();
//   //On Search Button, Find All Jokes By Keyword
//   document.getElementById("search-button").onclick = function() {
//     event.preventDefault();
//     var query = document.getElementById("search-input").value;
//     jokesAPI.getByKeyword(query);
//   };
//   //On All Button Click, Display All Jokes
//   document.getElementById("all-link").onclick = function() {
//     event.preventDefault();
//     jokesAPI.getFullList();
//   };
//   // On Category Click, Display Jokes for that Category
//   $(".dropdown-item").click(function() {
//     console.log("test");
//     const category = $(this).attr("id");
//     jokesAPI.getByCategory(category);
//   });
//   document.getElementById("new-joke-button").onclick = function() {
//     jokesAPI.createJoke();
//   };
// });
// $(document).on('click', ".glyphicon-star-empty", function(){
//   console.log('hello')
//   $(this).toggleClass('glyphicon-star glyphicon-star-empty')
// })
//Highlight Rating Stars
// $(document)
//   .on("mouseover", ".star", function() {
//     var onStar = parseInt($(this).data("value"), 10);
//     console.log(onStar);
//     $(this)
//       .parent()
//       .children(".star")
//       .each(function(e) {
//         if (e < onStar && $(this).hasClass("selected") !== true) {
//           $(this).addClass("glyphicon-star ");
//           $(this).removeClass("glyphicon-star-empty");
//         } else if ($(this).hasClass("selected") !== true) {
//           $(this).removeClass("glyphicon-star");
//           $(this).addClass("glyphicon-star-empty");
//         }
//       });
//   })
//   .on("mouseout", ".star", function() {
//     $(this)
//       .parent()
//       .children(".star")
//       .each(function(e) {
//         if ($(this).hasClass("selected") !== true) {
//           $(this).removeClass("glyphicon-star");
//           $(this).addClass("glyphicon-star-empty");
//         }
//       });
//   });
// //Click Rating Stars
// $(document).on("click", ".glyphicon-star", function() {
//   var onStar = parseInt($(this).data("value"), 10);
//   var stars = $(this)
//     .parent()
//     .children(".star");
//   for (i = 0; i < stars.length; i++) {
//     $(stars[i]).removeClass("selected");
//   }
//   for (i = 0; i < onStar; i++) {
//     $(stars[i]).addClass("selected");
//   }
//   for (i = onStar; i < 5 - onStar; i++) {
//     $(stars[i]).removeClass("glyphicon-star");
//     $(stars[i]).addClass("glyphicon-star-empty");
//   }
