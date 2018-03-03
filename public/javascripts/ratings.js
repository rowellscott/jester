$(document).on('mouseover', ".star", function(){
  var onStar = parseInt($(this).data('value'), 10)
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

//Click Rating Stars
$(document).on('click', ".glyphicon-star", function(){
  var onStar = parseInt($(this).data('value'), 10)
  //Submit Form to to Star's Post Route in Ratings.js
  document.getElementById('star-' + onStar).submit();
  
  var stars = $(this).parent().children('.star');
    console.log(stars)
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