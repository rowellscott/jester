class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }
  
  //Display a Joke 
  displayJoke(joke){
    console.log(joke)
    var jokeHTML = `
    <div class="jumbotron">
    <span class="joke">${joke.content}</span>
    <br>
    <br>
    <div class="rating">
    <span class="glyphicon glyphicon-star-empty star" aria-hidden="true" data-value='1'></span>
    <span class="glyphicon glyphicon-star-empty star" aria-hidden="true" data-value='2'></span>
    <span class="glyphicon glyphicon-star-empty star" aria-hidden="true" data-value='3'></span>
    <span class="glyphicon glyphicon-star-empty star" aria-hidden="true" data-value='4'></span>
    <span class="glyphicon glyphicon-star-empty star" aria-hidden="true" data-value='5'></span>
    <span class="rating-value">Avg.${joke.rating}</span>
    <button type="button" class="btn favorite"><i class="em em-laughing"></i></button>
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

  createJoke(){
      const jokeInfo ={
        
      }
  }

}


