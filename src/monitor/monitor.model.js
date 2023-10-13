const mongoose = require('mongoose');

// User Schema
const SuhuSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    suhu: {type: String, required: true},
    date: {type: Date, required: true},
    sourceGudang: {type: String, required: true}
})

// User model
const Suhu = mongoose.model('Suhu', SuhuSchema)

module.exports = Suhu