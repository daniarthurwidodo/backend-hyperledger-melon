const mongoose = require("mongoose");
const Schema = mongoose.Schema
// Melon Schema
const MelonSchema = new mongoose.Schema({
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tanggalTanam: { type: Date },
  tanggalPanen: { type: Date },
  jenisPupuk: { type: String },
  kuantitas: { type: String },
  jenisTanaman: { type: String },
  namaVarietas: { type: String },
  grade: { type: String },
  tanggalRegistrasi: { type: Date },
  lokasiKebun: { type: String },
});

// Melon model
const Melon = mongoose.model("Melon", MelonSchema);

module.exports = Melon;
