const amqplib = require("amqplib");
const express = require("express");
const { log } = require("mercedlogger"); // import mercedlogger's log function
const config = require("../../config.json");
const mongoose = require("mongoose");
const Monitor = require("./monitor.model");

const app = express();
const PORT = 4002;

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

const consumeMessage = async () => {
  const queue = "monitor";
  const conn = await amqplib.connect(
    "amqps://kdtcfyod:eTJ4LSahQETvqpG73HlqcwNmQoTN_jmj@armadillo.rmq.cloudamqp.com/kdtcfyod"
  );

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue, { ack: true });

  // Listener
  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      console.log("Recieved:", msg.content.toString());
      // ch1.ack(msg);

      let obj = JSON.parse(msg.content.toString());
      const data = await Monitor.create({
        suhu: obj.suhu,
        deviceID: obj.deviceID,
        lembab: obj.lembab,
        tanggal: new Date(),
      });
      console.log("transaksi berhasil ke database");
    } else {
      console.log("Consumer cancelled by server");
    }
  });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
};

consumeMessage();

app.listen(PORT, () =>
  log.green("MONITOR CONSUMER STATUS", `Listening on port ${PORT}`)
);
