require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { log } = require("mercedlogger");
const { readFile } = require("fs/promises");

const userController = require("./src/user/user.controller");
const monitorController = require("./src/monitor/monitor.controller");
const melonController = require("./src/melon/melon.controller");
const transaksiController = require("./src/transaksi/transaksi.controller");
const anomaliController = require("./src/anomali/anomali.controller");
const webController = require("./src/web/web.controller");
const notifController = require("./src/notif/notif.controller");

const path = require("path");

const config = require("./config.json");

const PORT = 8888;
// global middleware
const app = express();
app.use(cors()); // add cors headers
app.use(express.json());
app.use("/user", userController);
app.use("/monitor", monitorController);
app.use("/melon", melonController);
app.use("/transaksi", transaksiController);
app.use("/anomali", anomaliController);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/web", webController);
app.use("/notif", notifController);

app.get("/", (req, res) => {
  res.send("hi mom");
});

// db connection
mongoose.connect(config.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // serverSelectionTimeoutMS: 5000,

});
const db = mongoose.connection;
db.on("error", () => log.red("ERROR CONNECTION", "connection error:"));
db.once("open", () => log.green("DATABASE STATUS", `Connected to mongo `));

app.listen(PORT, () => {
  log.green("SERVER STATUS", `server is running at port ${PORT}`);
});

const runHttps = () => {
const https = require("https"),
 fs = require("fs");

const options = {
  key: fs.readFileSync("./private.key"),
  cert: fs.readFileSync("./certificate.crt"),
};
https.createServer(options, app).listen(8082);
}

process.env.ENVIRONMENT === 'production' ? runHttps() : null ;
