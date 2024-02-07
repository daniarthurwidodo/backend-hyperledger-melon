const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Melon Schema
const TransaksiSchema = new mongoose.Schema({
  // transaksiId: { type: String, unique: true, require: true },
  _id: { type: Schema.Types.ObjectId, require: true, },
  pengirim: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  ],
  penerima: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
  ],
  melon: [
    {
      type: Schema.Types.ObjectId,
      ref: "Melon",
      require: true,
    },
  ],
  tanggalTanam: { type: Date },
  tanggalPanen: { type: Date },
  kuantitas: { type: String },
  jenisTanaman: { type: String },
  harga: { type: String },
  suhu: { type: String },
  noRak: { type: String },
  lamaSimpan: { type: String },
  varietas: { type: String },
  jenisTransaksi: { type: String },
  alasan: { type: String },
  tanggalTransaksi: { type: Date },
  timeline: { type: Array, default: [] },
  isHide: {type: Boolean}
}, { _id: false });

// Melon model
const Transaksi = mongoose.model("Transaksi", TransaksiSchema);

module.exports = Transaksi;
