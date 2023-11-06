const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnomaliSchema = new mongoose.Schema({
  tanggal: { type: Date },
  suhu: { type: String },
  status: { type: String },
});

// Melon model
const Anomali = mongoose.model("Anomali", AnomaliSchema);

module.exports = Anomali;
