const amqp = require("amqplib/callback_api");
const express = require("express");
const { log } = require("mercedlogger"); // import mercedlogger's log function
const config = require("../../config.json");
const mongoose = require("mongoose");
const Monitor = require("./monitor.model");

const app = express();
const PORT = 4002;

// db connection
// const { DATABASE_URL } = process.env
mongoose.connect(config.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () =>
  log.red("ERROR CONNECTION FROM MONITOR", "connection error:")
);
db.once("open", () =>
  log.green("DATABASE STATUS FROM MONITOR", `Connected to mongo `)
);

amqp.connect(config.rabbitmq_url, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "monitor";
    channel.assertQueue(queue, {
      durable: false,
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      async function (msg) {
        var obj = JSON.parse(msg.content.toString("utf-8"));
        console.log(" [x] Received %s", obj);
        // await Suhu.create(obj);
        const data = await Monitor.create({
          suhu: obj.suhu,
          deviceID: obj.deviceID,
          lembab: obj.lembab,
          tanggal: new Date(),
        });
        console.log("transaksi berhasil ke database");
      },
      {
        noAck: true,
      }
    );
    channel.ackAll();
  });
});

app.listen(PORT, () =>
  log.green("MONITOR CONSUMER STATUS", `Listening on port ${PORT}`)
);
