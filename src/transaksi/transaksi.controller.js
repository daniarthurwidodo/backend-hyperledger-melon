const { Router } = require("express");
const Transaksi = require("./transaksi.model");
const User = require("../user/user.model"); // import user model

const { UUID } = require("bson");

const transaksiRouter = Router();

transaksiRouter.get("/generateId", (req, res) => {
  try {
    const randomId = new UUID().toBinary();
    res.status(200);
    res.send(randomId);
    res.end();
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "error generate id",
    });
    res.end();
  }
});

transaksiRouter.post("/tambah/:status", async (req, res) => {
  try {
    const pengirim = await User.findOne({ username: req.body.pengirim });
    const penerima = await User.findOne({ username: req.body.penerima });
    if (pengirim && penerima) {
      await Transaksi.create({
        transaksiId: req.body.transaksiId,
        pengirim: pengirim._id,
        penerima: penerima._id,
        tanggalTanam: req.body.tanggalTanam,
        tanggalPanen: req.body.tanggalPanen,
        kuantitas: req.body.kuantitas,
        jenisTanaman: req.body.jenisTanaman,
        harga: req.body.harga,
        suhu: req.body.suhu,
        lamaSimpan: req.body.lamaSimpan,
        varietas: req.body.varietas,
        status: req.params.status,
      });
      console.log("transaksi berhasil ke database");
      res.status(200).send({
        status: true,
        message: req.body,
      });
      res.end();
    } else {
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "transaksi gagal",
      error: error,
    });
    res.end();
  }
});

transaksiRouter.get("/status/:status", async (req, res) => {
  try {
    const status = await Transaksi.find({ status: req.params.status });
    res.status(200).send({
      status: true,
      message: status,
    });
    res.end();
    console.log("ambil data transaksi berhasil");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "transaksi gagal",
      error: error,
    });
    res.end();
  }
});

transaksiRouter.get("/all", async (req, res) => {
  const status = await Transaksi.find({});
  const user = await User.find({});

  console.log(status, user);
  try {

    res.status(200).send({
      status: true,
      message: status,
    });
    res.end();
    console.log("ambil semua data transaksi berhasil");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "transaksi gagal",
      error: error,
    });
    res.end();
  }
});

module.exports = transaksiRouter;
