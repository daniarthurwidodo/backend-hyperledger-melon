const { Router } = require("express");
const Anomali = require("./anomali.model");
const anomaliRouter = Router();

anomaliRouter.post("/tambah/", async (req, res) => {
  try {
    let suhu = req.query.suhu;
    let status = req.query.status;
    let tanggal = new Date(req.query.date);

    if (suhu && status && tanggal) {
      const data = await Anomali.create({
        suhu: req.query.suhu,
        status: req.query.status,
        tanggal: tanggal,
      });

      res.status(200).send({
        status: true,
        message: data,
      });
      res.end();
    } else {
      res.status(500).send({
        status: false,
        message: "query kurang makanya gagal",
        error: error,
      });
      res.end();
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

anomaliRouter.get("/", async (req, res) => {
  try {
    let date = req.query.tanggal;

    if (date) {
      date = new Date(date)
      const message = await Anomali.find({ tanggal: date });
      res.status(200).send({
        status: true,
        message: message,
      });
      res.end();
    } else if (!date) {
      const message = await Anomali.find();
      res.status(200).send({
        status: true,
        message: message,
      });
      res.end();
    }

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

module.exports = anomaliRouter;
