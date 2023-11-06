const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Melon Schema
const TransaksiSchema = new mongoose.Schema({
  transaksiId: { type: String, unique: true },
  pengirim: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  penerima: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tanggalTanam: { type: Date },
  tanggalPanen: { type: Date },
  kuantitas: { type: String },
  jenisTanaman: { type: String },
  harga: { type: String },
  suhu: { type: String },
  lamaSimpan: { type: String },
  status: { type: String },
  varietas: { type: String },
});

// Melon model
const Transaksi = mongoose.model("Transaksi", TransaksiSchema);

module.exports = Transaksi;
