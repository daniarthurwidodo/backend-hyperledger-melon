const mongoose = require('mongoose');

// User Schema
const MonitorSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    suhu: {type: Number, required: true},
    tanggal: {type: Date},
    lembab: {type: Number, required: true},
    isAnomali: {type: Boolean, default: false},
    isView: {type: Boolean, default: false}
})

// User model
const Monitor = mongoose.model('Monitor', MonitorSchema)

module.exports = Monitor