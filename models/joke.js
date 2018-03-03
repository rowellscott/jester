const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jokeSchema= Schema({
  content: {type: String, required: true},
  categories: {type: [String], required: true},
  rating: {type: Number, default: 0, required: true},
  ratingCount: {type: Number, default: 0, required: true},
  author: Schema.Types.ObjectId, 
  link: String
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
  }
);

const Joke = mongoose.model("Joke", jokeSchema);
module.exports = Joke