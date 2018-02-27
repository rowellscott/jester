const jokesAPI = new APIHandler("http://localhost:8000/jokes")

$(document).ready( () => {
    // List All Jokes
    jokesAPI.getFullList();

    //On Search Button, Find All Jokes By Keyword
    document.getElementById('search-button').onclick = function(){
      event.preventDefault();
      var query = document.getElementById('search-input').value
      jokesAPI.getByKeyword(query);
    }

    //On All Button Click, Display All Jokes
    document.getElementById('all-link').onclick = function(){
      event.preventDefault();
      jokesAPI.getFullList();
    }

    // On Category Click, Display Jokes for that Category
    $('.dropdown-item').click(function() {
        console.log("test");
        const category = $(this).attr('id')
        jokesAPI.getByCategory(category);
    });

})

// $(document).on('click', ".glyphicon-star-empty", function(){
//   console.log('hello')
//   $(this).toggleClass('glyphicon-star glyphicon-star-empty')
// })

//Highlight
$(document).on('mouseover', ".star", function(){
    var onStar = parseInt($(this).data('value'), 10)
    console.log(onStar)
    $(this).parent().children('.star').each(function(e){
      if (e < onStar && $(this).hasClass('selected') !== true) {
        $(this).addClass('glyphicon-star ');
        $(this).removeClass('glyphicon-star-empty');
      }
      else if($(this).hasClass('selected') !== true) {
        $(this).removeClass('glyphicon-star');
        $(this).addClass('glyphicon-star-empty');
      }
    });
    
  }).on('mouseout', ".star", function(){
    $(this).parent().children('.star').each(function(e){
      if($(this).hasClass('selected') !== true){
      $(this).removeClass('glyphicon-star')
      $(this).addClass('glyphicon-star-empty');
    }
    });
  });

  $(document).on('click', ".glyphicon-star", function(){
    var onStar = parseInt($(this).data('value'), 10)
    var stars = $(this).parent().children('.star');
   
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }
    
      for (i = 0; i < onStar; i++) {
       $(stars[i]).addClass('selected');
      }

    for(i =onStar; i < 5 - onStar; i++){
      $(stars[i]).removeClass('glyphicon-star');
      $(stars[i]).addClass('glyphicon-star-empty');
    }

    
  })
  



