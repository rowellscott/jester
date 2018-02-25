const mongoose = require('mongoose');
require('mongoose-type-email')
const Schema = mongoose.Schema; 

const userSchema = new Schema ({
    username:{type: String, required: true}, 
    password: {type: String, required: true}, 
    email: {type: mongoose.SchemaTypes.Email, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    DOB: Date,
},  { 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;