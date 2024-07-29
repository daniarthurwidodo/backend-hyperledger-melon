const { Router } = require("express");
const Transaksi = require("./transaksi.model");
const User = require("../user/user.model");
const Melon = require("../melon/melon.model");
const { randomUUID } = require("crypto");
const { UUID } = require("bson");
const mongoose = require("mongoose");
const transaksiRouter = Router();
const Pusher = require("pusher");
const request = require("request");

const pusher = new Pusher({
  appId: "1787407",
  key: "acbf3ffd05480b00732c",
  secret: "9b567fee6d12db55b36b",
  cluster: "ap1",
  useTLS: true,
});

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
  let errorMessage;
  try {
    const pengirim = await User.findOne({ username: req.body.pengirim });
    const penerima = await User.findOne({ username: req.body.penerima });
    const melon = await Melon.findOne({ _id: req.body.melon });

    if (!pengirim) {
      let message = "pengirim tidak ditemukan";
      errorMessage = message;
      throw new Error(message);
    }
    if (!penerima) {
      let message = "penerima tidak ditemukan";
      errorMessage = message;
      throw new Error(message);
    }
    if (!melon) {
      let message = "melon tidak ditemukan";
      errorMessage = message;
      throw new Error(message);
    }

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
      noRak: req.body.noRak,
      isHide: req.body.isHide,
      timeline: [...req.body.timeline],
    };
    if (pengirim && penerima) {
      // if jenisTransaksi == tx_terkonfirmasi_retail || tx_terkonfirmasi_distributor send  to blockchaiin
      console.log("jenisTransaksi === ", sendObj.jenisTransaksi);
      if (
        sendObj.jenisTransaksi === "tx_terkonfirmasi_retail" ||
        sendObj.jenisTransaksi === "tx_terkonfirmasi_distributor" || 
        sendObj.jenisTransaksi === "tx_terkonfirmasi_retail_keluar"
      ) {
        const headersOpt = {
          "content-type": "application/json",
        };
        const chaincode = 'melon'
        request(
          {
            method: "post",
            url: `http://localhost:8085/create/${chaincode}`,
            body: {
              ID: req.body.transaksiId,
              pengirim: pengirim._id,
              penerima: penerima._id,
              melon: melon._id,
              tanggalTanam: req.body.tanggalTanam,
              tanggalPanen: req.body.tanggalPanen,
              kuantitas: req.body.kuantitas,
              jenisTanaman: req.body.jenisTanaman,
              jenisTransaksi: req.body.jenisTransaksi,
              suhu: req.body.suhu,
              harga: req.body.harga,
              lamaPenyimpanan: req.body.lamaSimpan,
              timeline01: JSON.stringify(req.body.timeline[0]) ,
              timeline02: JSON.stringify(req.body.timeline[1]),
              timeline03: JSON.stringify(req.body.timeline[2]),
              timeline04: JSON.stringify(req.body.timeline[3]),
              timeline05: JSON.stringify(req.body.timeline[4]),
              timeline06: JSON.stringify(req.body.timeline[5]),
              timeline07: JSON.stringify(req.body.timeline[6]),
              timeline08: JSON.stringify(req.body.timeline[7]),
              timeline09: JSON.stringify(req.body.timeline[8]),
            },
            headers: headersOpt,
            json: true,
          },
          function (error, response, body) {
            //Print the Response
            console.log(body);
          }
        );
      }
      let _transaksi = await Transaksi.create(sendObj);
      console.log("transaksi berhasil ke database");
      res.status(200).send({
        status: true,
        message: _transaksi,
      });
      res.end();
    } else {
      res.status(500).send({
        status: false,
        message: "transaksi gagal else",
        body: req.body,
      });
      res.end();
    }
  } catch (errorMessage) {
    console.log(errorMessage);
    res.status(500).send({
      status: false,
      message: "transaksi gagal catch error",
      error: errorMessage,
    });
    res.end();
  }
  res.end();
});

transaksiRouter.post("/tx-keluar", async (req, res) => {
  let errorMessage;
  try {
    const pengirim = await User.findOne({ username: req.body.pengirim });
    const melon = await Melon.findOne({ _id: req.body.melon });

    if (!pengirim) {
      let message = "pengirim tidak ditemukan";
      errorMessage = message;
      throw new Error(message);
    }
    if (!melon) {
      let message = "melon tidak ditemukan";
      errorMessage = message;
      throw new Error(message);
    }

    const sendObj = {
      _id: req.body.transaksiId,
      pengirim: pengirim._id,
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
      noRak: req.body.noRak,
      isHide: req.body.isHide,
      timeline: [...req.body.timeline],
    };
    if (pengirim) {
      let _transaksi = await Transaksi.create(sendObj);
      console.log("transaksi berhasil ke database");
      res.status(200).send({
        status: true,
        message: _transaksi,
      });
      res.end();
    } else {
      res.status(500).send({
        status: false,
        message: "transaksi gagal else",
        body: req.body,
      });
      res.end();
    }
  } catch (errorMessage) {
    console.log(errorMessage);
    res.status(500).send({
      status: false,
      message: "transaksi gagal catch error",
      error: errorMessage,
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
      isHide: req.query.isHide,
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
  let query = req.query;

  try {
    const status = await Transaksi.find({
      ...query,
    })
      .skip(req.query.page)
      .limit(req.query.perPage)
      .populate(["pengirim", "penerima", "melon"])
      .exec();
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

transaksiRouter.put("/update/:transaksiId", async (req, res) => {
  let _transaksiId = req.params.transaksiId;
  let updateObject = req.body;

  console.log(updateObject);
  try {
    if (_transaksiId) {
      const data = await Transaksi.findOneAndUpdate(
        {
          _id: req.params.transaksiId,
        },
        { ...updateObject }
      );
      console.log(data, _transaksiId);
      res.status(200).send({ status: true, message: data });
      res.end();
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "gagal update",
      error: error,
    });
    res.end();
  }
});

transaksiRouter.put("/update-kuantitas/:transaksiId", async (req, res) => {
  let _transaksiId = req.params.transaksiId;

  try {
    if (_transaksiId) {
      const data = await Transaksi.findOneAndUpdate(
        {
          _id: req.params.transaksiId,
        },
        { kuantitas: req.body.kuantitas }
      );
      res.status(200).send({ status: true, message: data });
      res.end();
    }
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
