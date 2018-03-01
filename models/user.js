const mongoose = require('mongoose');
require('mongoose-type-email')
const Schema = mongoose.Schema; 

const userSchema = new Schema ({
    username: String, 
    password: String, 
    email: {type: mongoose.SchemaTypes.Email},
    firstName: String,
    lastName: String,
    facebookID: String,
    googleID: String,
    dob: Date,
},  { 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;