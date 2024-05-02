const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotifSchema = new mongoose.Schema({
  pengirim: { type: String },
  penerima: { type: String },
  message: { type: String },
  date: { type: Date },
  trxId: { type: String },
  isRead: { type: Boolean, default: false },
  deskripsi: { type: String },
});

// Notif model
const Notif = mongoose.model("Notif", NotifSchema);

module.exports = Notif;
