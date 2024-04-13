const { Router } = require("express");
const Anomali = require("./anomali.model");
const Monitor = require("../monitor/monitor.model");
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

anomaliRouter.post("/device", async (req, res) => {
  try {
    let deviceId = req.body.deviceID
    const message = await Monitor.find({isAnomali: true, deviceID: deviceId});
      res.status(200).send({
        status: true,
        message: message,
      });
      res.end();
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "anomali error",
      error: error,
    });
    res.end();
  }
});

module.exports = anomaliRouter;
