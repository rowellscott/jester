class APIHandler {
  constructor(baseUrl) {
    this.BASE_URL = baseUrl;
  }

  //Display a Joke
  displayJoke(joke) {
    console.log(joke);
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
  `;
    document.getElementsByClassName("right-container")[0].innerHTML += jokeHTML;
  }

  //Display All Jokes to Screen
  getFullList() {
    axios
      .get(this.BASE_URL + "/jokes")
      .then(response => {
        //Clear the Joke Container
        document.getElementsByClassName("right-container")[0].innerHTML = "";
        //Prevent the Page from Reloading
        event.preventDefault();
        response.data.forEach(joke => {
          //Display Each Joke
          this.displayJoke(joke);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  // Display Jokes By Keyword Search
  getByKeyword(query) {
    axios
      .get(this.BASE_URL + "/jokes")
      .then(response => {
        //Clear the Joke Container
        document.getElementsByClassName("right-container")[0].innerHTML = "";
        response.data.forEach(joke => {
          //If Jokes Includes Query String, Display Joke
          if (joke.content.includes(query)) {
            this.displayJoke(joke);
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getByCategory(category) {
    axios
      .get(this.BASE_URL + "/jokes")
      .then(response => {
        //Clear the Joke Container
        document.getElementsByClassName("right-container")[0].innerHTML = "";
        response.data.forEach(joke => {
          //If Jokes Includes Category Display Joke
          if (joke.category.includes(category)) {
            this.displayJoke(joke);
          }
        });
      })
      .catch(err => {});
  }

  createJoke() {
    var content = document.getElementById("new-content").value;

    var checkboxes = document.getElementsByClassName("form-check-input");
    var categories = [];
    // If Category Checkbox is Checked, Add to Categories Array
    checkboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        categories.push(checkbox.value);
      }
    });

    // Get New Categories Added In Text Field
    var newCategories = document
      .getElementById("new-categories")
      .value.split(", ");
    //Add Each One to Primary Categories Array
    newCategories.forEach(category => {
      categories.push(category);
    });

    if (content === "") {
      console.error("Indicate A Name");
    }

    const jokeInfo = {
      content: document.getElementById("new-content").value,
      categories,
      user: document.getParameterByName("id")
    };

    axios
      .post(this.BASE_URL + "/jokes", jokeInfo)
      .then(response => {
        console.log("success");
      })
      .catch(error => {
        document.getElementsByClassName(
          "submit-button"
        )[0].style.backgroundColor =
          "red";
        console.log(error);
      });
  }
}
