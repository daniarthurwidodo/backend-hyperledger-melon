const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    nama: {type: String, required: true},
    email: {type: String, required: true},
    noHandphone: {type: String, required: true}

})

// User model
const User = mongoose.model('User', UserSchema)

module.exports = User