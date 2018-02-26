const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jester');
const Joke = require("../models/joke")

const jokes= [{
  content: "Why did the chicken cross the road?   To get to the other side",
  category: "One-Liner",
}, 
{
  content: "What is a Jew's idea of Christmas?  A parking meter on the roof",
  category: ["One-Liner", "Jewish"],
},
{
  content: "Yo' mama so stupid, she walked into an antique shop and asked, \"What's new?\"",
  category: ["Yo Mama", "One-Liner"],
}
]

Joke.create(jokes, (err, docs)=>{
    if(err){ throw err};

    docs.forEach((joke)=>{
      console.log(joke.content)
    })
    mongoose.connection.close();
});