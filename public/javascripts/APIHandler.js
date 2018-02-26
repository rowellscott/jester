class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }
  
  //Display All Jokes to Screen
  getFullList(){
    axios.get(this.BASE_URL)
    .then(response => {
      event.preventDefault();  
      response.data.forEach((joke)=>{
        var joke = `
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
        document.getElementsByClassName('right-container')[0].innerHTML += joke 
      });
      
    })
    .catch(err=>{
      console.error(err)
    })
  }

  //Display Jokes By Keyword Search
  getByKeywords(){
    axios.get(this.BASE_URL)
  }
}
