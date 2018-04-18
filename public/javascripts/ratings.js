$(function() {
  $('[data-toggle="popover"]').popover();
});

$(".star")
  .on("mouseover", function(e) {
    var onStar = parseInt($(this).data("value"), 10);
    console.log("hello");
    // var parent = $(this).parent()
    // var grandparent = parent.parent()
    // var starForms = grandparent.children();
    // var stars= [];
    // for(i=0; i < 5; i++){
    //     stars.push($(starForms[i]).find('span'))
    // }

    var stars = document.getElementsByClassName("star");
    console.log(stars);
    $(stars).each(function(e) {
      if (e < onStar && $(this).hasClass("selected") !== true) {
        $(this).addClass("glyphicon-star ");
        $(this).removeClass("glyphicon-star-empty");
      } else if ($(this).hasClass("selected") !== true) {
        $(this).removeClass("glyphicon-star");
        $(this).addClass("glyphicon-star-empty");
      }
    });
  })
  .on("mouseout", ".star", function() {
    // var parent = $(this).parent();
    // var grandparent = parent.parent();
    // var starForms = grandparent.children();
    // var stars = [];
    // for (i = 0; i < 5; i++) {
    //   stars.push($(starForms[i]).find("span"));
    // }

    if ($(this).hasClass("selected") !== true) {
      $(this).removeClass("glyphicon-star");
      $(this).addClass("glyphicon-star-empty");
    }
  });

//Click Rating Stars
$(document).on("click", ".glyphicon-star", function(e) {
  e.preventDefault();
  var onStar = parseInt($(this).data("value"), 10);

  // document.getElementById('star-' + onStar).submit();

  //Select Each Star in Form and Push To Stars Array
  // var parent = $(this).parent();
  // var grandparent = parent.parent();
  // // console.log("stars ancestors:", parent, grandparent);
  // var starForms = grandparent.children();
  // var stars = [];
  // for (i = 0; i < 5; i++) {
  //   stars.push($(starForms[i]).find("span"));
  // }

  const jokeID = e.currentTarget.dataset.joke;
  //Submit Form to Star's Post Route in Ratings.js
  axios
    .post(`${API}/ratings/${jokeID}/${onStar}`, {})
    .then(res => {
      console.log(res.status);
    })
    .catch(err => {
      console.log(err);
    });
  // jokeRatingsUpdates.push($(starForms[onStar-1]));
  // console.log(jokeRatingsUpdates)

  for (i = 0; i < stars.length; i++) {
    $(stars[i]).removeClass("selected");
  }

  for (i = 0; i < onStar; i++) {
    $(stars[i]).removeClass("glyphicon-star-empty");
    $(stars[i]).addClass("glyphicon-star selected");
    // console.log("selected stars:", $(stars[i]))
  }

  for (i = onStar; i < 5; i++) {
    // console.log(i)
    $(stars[i]).removeClass("glyphicon-star selected");
    $(stars[i]).addClass("glyphicon-star-empty");
    // console.log("removed stars::", $(stars[i]))
  }
});

// $(window).on("beforeunload", function(e) {
//   jokeRatingsUpdates.forEach(joke => {
//     console.log('bye')

//     $(joke).submit()
// })
// });
