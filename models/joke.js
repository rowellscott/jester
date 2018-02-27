const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jokeSchema= Schema({
  content: {type: String, required: true},
  categories: {type: [String], required: true},
  rating: {type: Number, default: 0, required: true},
  author: Schema.Types.ObjectId, 
  link: String
});

const Joke = mongoose.model("Joke", jokeSchema);
module.exports = Joke