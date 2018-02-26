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
        const category = $(this).attr('id')
        jokesAPI.getByCategory(category);
    })
})