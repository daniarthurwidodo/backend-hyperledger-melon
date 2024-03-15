const { Router } = require("express"); // import router from express
const monitorRouter = Router(); // create router to create route bundle
const Monitor = require("./monitor.model");
const mongoose = require("mongoose");
const amqplib = require("amqplib");

const config = require("../../config.json");

monitorRouter.get("/tambah/:deviceID/:suhu/:lembab", async (req, res) => {
  try {
    if (req.params.deviceID) {
      // let data = {
      //   suhu: req.params.suhu,
      //   deviceID: req.params.deviceID,
      //   lembab: req.params.lembab,
      //   tanggal: new Date(),
      // };

    const data =  await Monitor.create({
        suhu: req.params.suhu,
        deviceID: req.params.deviceID,
        lembab: req.params.lembab,
        tanggal: new Date(),
      });

      // send to message broker
      // const queue = "monitor";
      // const conn = await amqplib.connect(
      //   "amqps://kdtcfyod:eTJ4LSahQETvqpG73HlqcwNmQoTN_jmj@armadillo.rmq.cloudamqp.com/kdtcfyod"
      // );

      // Sender
      // const ch2 = await conn.createChannel();
      // var json = JSON.stringify(data);
      // ch2.sendToQueue(queue, Buffer.from(json));

      res.status(200);
      res.send({
        status: true,
        message: data,
      });
      res.end();
      console.log("transaksi berhasil ke broker");
    } else {
      res.status(500);
      res.send({
        status: false,
        message: "data tidak lengkap",
        error: req.param.deviceID,
      });
      res.end();
    }
  } catch (error) {
    res.status(500);
    res.send({
      status: false,
      message: "transaksi gagal",
      error: error,
    });
    res.end();
  }
});

monitorRouter.get(
  "/view/:monitorID",
  async (req, res) => {
    let monitorID = req.params.monitorID;
    let validId = mongoose.isValidObjectId(monitorID);

    if (validId) {
      let id = new mongoose.Types.ObjectId(monitorID);

      await Monitor.findOneAndUpdate({ _id: id }, {isView: true})
        .then(function (models) {
          if (models) {
            res.status(200);
            res.send({
              status: true,
              message: `ID ${id} sudah terupdate `,
              data: models,
            });
            res.end();
          } else {
            res.status(500);
            res.send({
              status: false,
              message: "id tidak ditemukan",
            });
            res.end();
          }
        })
        .catch(function (err) {
          console.log("error", err);
        });
    } else if (!validId) {
      res.status(500);
      res.send({
        status: false,
        message: "id tidak valid",
      });
      res.end();
    }
  }

);

monitorRouter.get("/harian", async (req, res) => {
  try {
    if (req.query.tanggal) {
      const currentDate = new Date(req.query.tanggal).toISOString();
      const tomorrow = new Date(req.query.tanggal).setHours(24);
      const tomorrowToISO = new Date(tomorrow).toISOString();
      const data = await Monitor.find({
        tanggal: {
          $gte: currentDate,
          $lt: tomorrowToISO,
        },
      });
      res
        .status(200)
        .send({
          status: true,
          message: data,
        })
        .end();
    } else {
      const data = await Monitor.find();

      res.status(200);
      res.send({
        status: true,
        message: data,
      });
      res.end();
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "data gagal diambil",
      error: error,
    });
    res.end();
  }
});

monitorRouter.get("/all", async (req, res) => {
  if (req.query.from && req.query.to) {
    const fromDate = new Date(req.query.from).toISOString();
    const toDate = new Date(req.query.to).toISOString();

    const data = await Monitor.find({
      tanggal: {
        $gte: fromDate,
        $lt: toDate,
      },
    });

    let dataSuhu = [];
    if (dataSuhu.length > 0) {
      data.forEach((items) => {
        return dataSuhu.push(items.suhu);
      });
      let aggregate = findMinMaxAvg(dataSuhu);
      res
        .status(200)
        .send({
          status: true,
          message: data,
          aggregate: aggregate,
        })
        .end();
    } else {
      res.status(500).send({
        status: false,
        message: "data gagal diambil",
        // error: error,
      });
      res.end();
    }
  }
});

monitorRouter.get("/anomali", async (req, res) => {
  if (req.query.deviceID) {
    const data = await Monitor.find({ deviceID: req.query.deviceID });
    res
      .status(200)
      .send({
        status: true,
        message: data,
      })
      .end();
  } else {
    res.status(500).send({
      status: false,
      message: "data gagal diambil",
      // error: error,
    });
    res.end();
  }
});

monitorRouter.get("/suhu-terbaru", async (req, res) => {
  if (req.query.deviceID) {
    const data = await Monitor.findOne({ deviceID: req.query.deviceID }).sort({
      tanggal: "desc",
    });
    res
      .status(200)
      .send({
        status: true,
        message: data,
      })
      .end();
  } else {
    res.status(500).send({
      status: false,
      message: "data gagal diambil",
      // error: error,
    });
    res.end();
  }
});

monitorRouter.get("/notif", async (req, res) => {
  const _deviceID = req.query.deviceID;
  try {
    if (
      _deviceID == "gudangPetani" ||
      _deviceID == "gudangDistributor" ||
      _deviceID == "gudangRetail"
    ) {
      const data = await Monitor.find({
        isAnomali: true,
        deviceID: _deviceID,
      }).sort({
        tanggal: "desc",
      });

      res
        .status(200)
        .send({
          status: true,
          message: data,
        })
        .end();
    } else {
      const data = await Monitor.find({ isAnomali: true }).sort({
        tanggal: "desc",
      });

      res
        .status(200)
        .send({
          status: true,
          message: data,
        })
        .end();
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "data gagal diambil",
    });
    res.end();
  }
});

const findMinMaxAvg = (array) => {
  let sortedArray = array.sort();
  let min = sortedArray[0];
  let max = sortedArray[sortedArray.length - 1];
  let sum = calcAverage(array);
  let avg = sum / array.length;
  return { min: min, max: max, avg: Math.floor(avg) };
};

const calcAverage = (array) => {
  let total = 0;
  let count = 0;
  array.forEach(function (item, index) {
    total += item;
    count++;
  });
  return total + count;
};

module.exports = monitorRouter;
