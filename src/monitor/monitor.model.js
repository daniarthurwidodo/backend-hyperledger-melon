const mongoose = require('mongoose');

// User Schema
const MonitorSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    suhu: {type: Number, required: true},
    tanggal: {type: Date, required: true},
    status: {type: Number, required: true}
})

// User model
const Monitor = mongoose.model('Monitor', MonitorSchema)

module.exports = Monitor