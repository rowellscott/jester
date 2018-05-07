const mongoose = require("mongoose");
require("mongoose-type-email");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: { type: mongoose.SchemaTypes.Email },
    firstName: String,
    lastName: String,
    facebookID: String,
    googleID: String,
    ratings: [
      {
        jokeId: { type: Schema.Types.ObjectId, ref: "Joke" },
        rating: Number
      }
    ],
    dob: Date,
    favorites: [{ type: Schema.Types.ObjectId, ref: "Joke" }]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
