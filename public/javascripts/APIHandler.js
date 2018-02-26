class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }
  
  //Display a Joke 
  displayJoke(joke){
    var jokeHTML = `
    <div class="jumbotron">
    <span class="joke">${joke.content}</span>
    <br>
    <br>
    <span class="glyphicon glyphicon-star-empty rating" aria-hidden="true"></span>
    <span class="glyphicon glyphicon-star-empty rating" aria-hidden="true"></span>
    <span class="glyphicon glyphicon-star-empty rating" aria-hidden="true"></span>
    <span class="glyphicon glyphicon-star-empty rating" aria-hidden="true"></span>
    <span class="glyphicon glyphicon-star-empty rating" aria-hidden="true"></span>
  </div>
  `
    document.getElementsByClassName('right-container')[0].innerHTML += jokeHTML 
  }

  //Display All Jokes to Screen
  getFullList(){
    axios.get(this.BASE_URL)
    .then(response => {
      //Clear the Joke Container
      document.getElementsByClassName('right-container')[0].innerHTML = ""
      //Prevent the Page from Reloading
      event.preventDefault();  
      response.data.forEach((joke)=>{
          //Display Each Joke
          this.displayJoke(joke);
      });
      
    })
    .catch(err=>{
      console.error(err);
    })
  }

  // Display Jokes By Keyword Search
  getByKeyword(query){
    axios.get(this.BASE_URL)
    .then(response=>{
      //Clear the Joke Container
        document.getElementsByClassName('right-container')[0].innerHTML = ""
        response.data.forEach((joke)=>{
          //If Jokes Includes Query String, Display Joke
          if(joke.content.includes(query)){
            this.displayJoke(joke)
        }
    })
    }
    )
    .catch(err=>{
      console.error(err);
    })
  }

  getByCategory(category){
    axios.get(this.BASE_URL)
    .then(response=>{
         //Clear the Joke Container
      document.getElementsByClassName('right-container')[0].innerHTML = ""
       response.data.forEach((joke)=>{
        //If Jokes Includes Category Display Joke
        if(joke.category.includes(category)){
          this.displayJoke(joke)
      }
    })
  })
    .catch(err=>{

    })
  }

}
