const { Router } = require("express");
const Transaksi = require("./transaksi.model");
const User = require("../user/user.model");
const Melon = require("../melon/melon.model");
const { randomUUID } = require("crypto");
const { UUID } = require("bson");
const transaksiRouter = Router();

transaksiRouter.get("/generateId", (req, res) => {
  try {
    const randomId = randomUUID();
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

transaksiRouter.post("/tambah", async (req, res) => {
  let pengirim;
  let penerima;
  let melon;
  try {
    pengirim = await User.findOne({ username: req.body.pengirim });
    penerima = await User.findOne({ username: req.body.penerima });
    melon = await Melon.findOne({ _id: req.body.melon });
    if (pengirim && penerima) {
      await Transaksi.create({
        transaksiId: req.body.transaksiId,
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
        status: req.body.status,
        jenisTransaksi: req.body.jenisTransaksi,
        alasan: req.body.alasan,
        tanggalTransaksi: new Date(),
        timeline: req.body.timeline
      });
      console.log("transaksi berhasil ke database");
      res.status(200).send({
        status: true,
        message: req.body,
      });
      res.end();
    } else {
      res.status(500).send({
        status: false,
        message: "transaksi gagal",
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

  res.end();
});

transaksiRouter.get("/status/:status", async (req, res) => {
  let status;
  try {
    status = await Transaksi.find({ status: req.params.status });
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

transaksiRouter.put("/update/:code/:transaksiId", async (req, res) => {
  let transaksiId = req.params.transaksiId;
  // let status = req.params.status;

  if(req.params.code){

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
      transaksiId: req.params.transaksiId,
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

transaksiRouter.get("/transaksi-masuk", async (req, res) => {
  try {
    // const data = await Transaksi.find({
    //   penerima: req.body.userId,
    //   status: req.body.status,
    //   jenisTransaksi: "MASUK"
    // }).populate(['pengirim', 'penerima', 'melon']);
    res
      .status(200)
      .send({
        status: true,
        // message: data,
        body: req.body,
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

module.exports = transaksiRouter;
