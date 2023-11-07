const { Router } = require("express"); // import router from express
const monitorRouter = Router(); // create router to create route bundle
const Monitor = require("./monitor.model");

const amqp = require("amqplib/callback_api");
const config = require("../../config.json");

monitorRouter.post("/tambah", async (req, res) => {
  try {
    if (
      req.query.deviceID &&
      req.query.suhu &&
      req.query.tanggal &&
      req.query.status
    ) {
      const data = await Monitor.create({
        suhu: req.query.suhu,
        deviceID: req.query.deviceID,
        status: req.query.status,
        tanggal: req.query.tanggal,
      });
      res.status(200);
      res.send({
        status: true,
        message: data,
      });
      res.end();
      console.log("transaksi berhasil ke database");
    } else {
      res.status(500);
      res.send({
        status: false,
        message: "data tidak lengkap",
        error: error,
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

monitorRouter.get("/harian", async (req, res) => {
  try {
    if (req.query.tanggal) {
      const currentDate = new Date(req.query.tanggal).toISOString()
      const tomorrow = new Date(req.query.tanggal).setHours(24)
      const tomorrowToISO = new Date(tomorrow).toISOString()
      const data = await Monitor.find({
        tanggal: {
          $gte: currentDate,
          $lt: tomorrowToISO,
        },
      });
      console.log(data);
      // const min = await Monitor.find({tanggal: date}).sort({a : 1}).limit(1)
      res
        .status(200)
        .send({
          status: true,
          message: data,
          // min: min
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

// router.post("/tambah", async (req, res) => {
//     try {
//         let body = req.body
//         body.sourceGudang = req.params.source;
//         body.deviceID = req.params.deviceID;
//         body.suhu = req.params.suhu

//         amqp.connect(config.rabbitmq_url, function (error0, connection) {
//             if (error0) {
//                 throw error0;
//             }
//             connection.createChannel(function (error1, channel) {
//                 if (error1) {
//                     throw error1;
//                 }

//                 var queue = 'monitor';
//                 var msg = JSON.stringify({
//                     deviceID: body.deviceID,
//                     sourceGudang: body.sourceGudang,
//                     suhu: body.suhu,
//                     date: new Date().toLocaleString('en-US', {
//                         timeZone: 'Asia/Jakarta',
//                       }),
//                 })
//                 channel.assertQueue(queue, {
//                     durable: false
//                 });
//                 channel.sendToQueue(queue, Buffer.from(msg));

//                 // console.log(" [x] Sent %s", msg);

//                 // connection.close();
//                 res.status(200)
//                 res.send(msg)
//                 res.end()
//             });
//         });
//     } catch (error) {
//         console.log(error)
//     }
// })

module.exports = monitorRouter;
