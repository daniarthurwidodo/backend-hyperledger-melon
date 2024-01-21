const { Router } = require("express");
const Transaksi = require("./transaksi.model");
const User = require("../user/user.model");
const Melon = require("../melon/melon.model");
const { randomUUID } = require("crypto");
const { UUID } = require("bson");
const mongoose = require("mongoose");
const transaksiRouter = Router();

transaksiRouter.get("/generateId", (req, res) => {
  const newId = new mongoose.mongo.ObjectId();
  try {
    res.status(200);
    res.send(newId);
    res.end();
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "error generate id",
    });
    res.end();
  }
});

transaksiRouter.post("/tambah", async (req, res) => {
  let pengirim;
  let penerima;
  let melon;

  let newId = new mongoose.mongo.ObjectId();
  try {
    pengirim = await User.findOne({ username: req.body.pengirim });
    penerima = await User.findOne({ username: req.body.penerima });
    melon = await Melon.findOne({ _id: req.body.melon });

    const sendObj = {
      _id: req.body.transaksiId,
      pengirim: pengirim._id,
      penerima: penerima._id,
      melon: melon._id,
      tanggalTanam: req.body.tanggalTanam,
      tanggalPanen: req.body.tanggalPanen,
      kuantitas: req.body.kuantitas,
      jenisTanaman: req.body.jenisTanaman,
      harga: req.body.harga,
      suhu: req.body.suhu,
      lamaSimpan: req.body.lamaSimpan,
      varietas: req.body.varietas,
      alasan: req.body.alasan,
      tanggalTransaksi: new Date(),
      jenisTransaksi: req.body.jenisTransaksi,
      // tx_belum_terkonfirmasi
      // tx_terkonfirmasi_distributor
      // tx_ditolak_distributor
      // tx_terkonfirmasi_retail
      // tx_ditolak_retail
      timeline: [...req.body.timeline],
    };
    if (pengirim && penerima) {
      await Transaksi.create(sendObj);
      console.log("transaksi berhasil ke database");
      res.status(200).send({
        status: true,
        message: req.body,
      });
      res.end();

      // send to blockchain
    } else {
      res.status(500).send({
        status: false,
        message: "transaksi gagal else",
        body: req.body,
      });
      res.end();
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "transaksi gagal catch error",
      error: error,
    });
    res.end();
  }

  res.end();
});

transaksiRouter.get("/status/:jenisTransaksi", async (req, res) => {
  let status;
  try {
    status = await Transaksi.find({
      jenisTransaksi: req.params.jenisTransaksi,
    });
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
  res.end;
});

transaksiRouter.get("/all", async (req, res) => {
  // .skip(2).limit(5)
  // const user = await User.find({});
  // console.log(status, user);
  try {
    if (req.query.pengirimId) {
      const status = await Transaksi.find({
        jenisTransaksi: req.query.jenisTransaksi,
        pengirim: req.query.pengirimId,
      })
        .skip(req.query.page)
        .limit(req.query.perPage);
      res.status(200).send({
        status: true,
        message: status,
      });
      res.end();
    } else {
      const status = await Transaksi.find({
        jenisTransaksi: req.query.jenisTransaksi,
      })
        .skip(req.query.page)
        .limit(req.query.perPage);
      res.status(200).send({
        status: true,
        message: status,
      });
      res.end();
    }

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

transaksiRouter.put("/update/:code/:transaksiId", async (req, res) => {
  let transaksiId = req.params.transaksiId;
  // let status = req.params.status;

  if (req.params.code) {
  }

  try {
    const data = await Transaksi.findOneAndUpdate(
      {
        transaksiId: transaksiId,
      },
      { status: req.body.status, timeline: req.body.timeline }
    );
    res.status(200).send({ status: true, message: data });
    res.end();
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "gagal update",
      error: error,
    });
    res.end();
  }
});

transaksiRouter.get("/qr/:transaksiId", async (req, res) => {
  try {
    const data = await Transaksi.findOne({
      _id: req.params.transaksiId,
    }).populate(["pengirim", "penerima", "melon", "timeline"]);
    res
      .status(200)
      .send({
        status: true,
        message: data,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "transaksi not found",
      })
      .end();
  }
});

transaksiRouter.get("/user/:userId", async (req, res) => {
  try {
    const data = await Transaksi.find({
      pengirim: req.params.userId,
    }).populate(["pengirim", "penerima", "melon"]);
    res
      .status(200)
      .send({
        status: true,
        message: data,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "transaksi not found",
      })
      .end();
  }
});

transaksiRouter.get(
  "/cari/:userId/:status/:jenisTransaksi",
  async (req, res) => {
    try {
      const data = await Transaksi.find({
        pengirim: req.params.userId,
        status: req.params.status,
        jenisTransaksi: req.params.jenisTransaksi,
      }).populate(["pengirim", "penerima", "melon"]);
      res
        .status(200)
        .send({
          status: true,
          message: data,
        })
        .end();
    } catch (error) {
      res
        .status(400)
        .send({
          status: false,
          message: "transaksi not found",
        })
        .end();
    }
  }
);

module.exports = transaksiRouter;
