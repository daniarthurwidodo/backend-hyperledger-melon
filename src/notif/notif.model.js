const mongoose = require("mongoose");
const Schema = mongoose.Schema

const NotifSchema = new mongoose.Schema({
  to: { type: String },
  from: { type: String },
  message: { type: String },
  date: {type: Date},
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isRead: {type: Boolean, default: false}
});

// Notif model
const Notif = mongoose.model("Notif", NotifSchema);

module.exports = Notif;
